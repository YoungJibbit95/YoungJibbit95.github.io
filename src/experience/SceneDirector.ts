import { defaultSnapshot, findHotspot, getWorld, parseWorldRoute, worldHref } from './SceneRegistry'
import type { AvailableWorldId, CameraBridge, CameraPose, NavigationSnapshot } from './worldTypes'
import { useExperienceStore } from '../store/experienceStore'
import { copySnapshot, readBrowserEntry } from '../store/worldHistory'

type BrowserHistoryState = Record<string, unknown> & {
  livingAtlas?: {
    snapshot: NavigationSnapshot
    history: NavigationSnapshot[]
  }
}

/** One navigation owner for every gesture, URL entry and camera flight. */
export class SceneDirector {
  private camera: CameraBridge | null = null
  private sequence = 0
  private started = false

  private readonly pop = (event: PopStateEvent) => {
    const entry = readBrowserEntry(event.state)
    const route = parseWorldRoute(window.location.search)
    const snapshot =
      entry?.snapshot.world === route.world && entry.snapshot.focusId === route.focusId
        ? entry.snapshot
        : route
    void this.apply(snapshot, entry?.history ?? [], false, true)
  }

  start(): void {
    if (this.started) return
    this.started = true
    const route = parseWorldRoute(window.location.search)
    const entry = readBrowserEntry(window.history.state)
    const snapshot =
      entry?.snapshot.world === route.world && entry.snapshot.focusId === route.focusId
        ? entry.snapshot
        : route
    const stack = entry?.history ?? []
    this.persist(snapshot, stack)
    void this.apply(snapshot, stack, false, false)
    window.addEventListener('popstate', this.pop)
  }

  dispose(): void {
    this.started = false
    this.sequence++
    this.camera?.cancel()
    this.camera = null
    window.removeEventListener('popstate', this.pop)
  }

  attach(camera: CameraBridge | null): void {
    this.camera = camera
    if (camera) {
      const state = useExperienceStore.getState()
      const pose = this.snapshot(state.pose)
      void camera.moveTo(pose.pose, false).then((complete) => {
        if (complete && this.camera === camera) this.rest(camera.capture() ?? pose.pose)
      })
    }
  }

  bridge(): CameraBridge | null {
    return this.camera
  }

  private snapshot(pose?: CameraPose): NavigationSnapshot {
    const state = useExperienceStore.getState()
    return copySnapshot({
      world: state.activeWorld,
      focusId: state.focusId,
      selectionId: state.selectionId,
      pose: pose ?? this.camera?.capture() ?? state.pose,
      filters: state.filters,
    })
  }

  private persist(snapshot: NavigationSnapshot, stack: NavigationSnapshot[]): void {
    const original = window.history.state
    const existing: BrowserHistoryState =
      original && typeof original === 'object' ? original : {}
    window.history.replaceState(
      {
        ...existing,
        livingAtlas: {
          snapshot: copySnapshot(snapshot),
          history: stack.map(copySnapshot),
        },
      },
      '',
      window.location.href,
    )
  }

  navigate(world: AvailableWorldId, requestedFocus: string | null = null): void {
    const focus = findHotspot(world, requestedFocus)
    const destination = defaultSnapshot(world, focus?.id ?? null)
    const state = useExperienceStore.getState()
    const previous = this.snapshot()
    const stack = [...state.history, previous].slice(-32)
    this.persist(previous, state.history)
    window.history.pushState(
      { livingAtlas: { snapshot: copySnapshot(destination), history: stack } },
      '',
      worldHref(destination),
    )
    void this.apply(destination, stack, true, false)
  }

  back(): void {
    const state = useExperienceStore.getState()
    if (state.history.length > 0) {
      window.history.back()
    } else if (state.focusId) {
      this.navigate(state.activeWorld)
    } else if (state.activeWorld !== 'origin') {
      this.navigate('origin')
    }
  }

  overview(): void {
    this.navigate(useExperienceStore.getState().activeWorld)
  }

  interrupt(): void {
    this.sequence++
    this.camera?.cancel()
    useExperienceStore.getState().setTransition('interrupted')
  }

  /** Called on CameraControls rest/sleep, never on every frame. */
  rest(pose: CameraPose): void {
    const state = useExperienceStore.getState()
    if (state.transition === 'transitioning' || state.transition === 'returning') return
    state.capturePose(pose)
    state.setTransition(state.focusId ? 'focused' : 'idle')
    if (this.started) this.persist(this.snapshot(pose), state.history)
  }

  private async apply(
    snapshot: NavigationSnapshot,
    history: NavigationSnapshot[],
    animate: boolean,
    returning: boolean,
  ): Promise<void> {
    const sequence = ++this.sequence
    const before = useExperienceStore.getState().activeWorld
    this.camera?.cancel()
    if (before !== snapshot.world) getWorld(before).onExit?.()
    useExperienceStore.getState().navigateState(snapshot, history)
    useExperienceStore.getState().setTransition(returning ? 'returning' : 'transitioning')
    if (before !== snapshot.world) getWorld(snapshot.world).onEnter?.()
    if (!this.camera) {
      useExperienceStore.getState().setTransition(snapshot.focusId ? 'focused' : 'idle')
      return
    }
    try {
      const motion = useExperienceStore.getState().motion
      const complete = await this.camera.moveTo(snapshot.pose, animate && motion === 'full')
      if (sequence !== this.sequence || !complete) return
      const actual = this.camera.capture() ?? snapshot.pose
      useExperienceStore.getState().capturePose(actual)
      useExperienceStore.getState().setTransition(snapshot.focusId ? 'focused' : 'idle')
      this.persist(this.snapshot(actual), history)
    } catch {
      if (sequence === this.sequence) useExperienceStore.getState().setTransition('error')
    }
  }
}
