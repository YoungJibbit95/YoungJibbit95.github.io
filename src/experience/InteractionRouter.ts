import type { CameraBridge } from './worldTypes'

export function isFormTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  )
}

/** Canvas owns its gestures; other UI and document scroll retain theirs. */
export function bindSpatialInput(element: HTMLElement, interrupt: () => void): () => void {
  const wheel = (event: WheelEvent) => {
    event.preventDefault()
    event.stopPropagation()
    interrupt()
  }
  const start = () => interrupt()
  const context = (event: MouseEvent) => event.preventDefault()
  element.addEventListener('wheel', wheel, { passive: false })
  element.addEventListener('pointerdown', start, { capture: true })
  element.addEventListener('touchstart', start, { capture: true, passive: true })
  element.addEventListener('contextmenu', context)
  return () => {
    element.removeEventListener('wheel', wheel)
    element.removeEventListener('pointerdown', start, true)
    element.removeEventListener('touchstart', start, true)
    element.removeEventListener('contextmenu', context)
  }
}

export function moveWithKey(event: KeyboardEvent, camera: CameraBridge | null): boolean {
  if (isFormTarget(event.target)) return false
  const moves: Record<string, readonly [number, number]> = {
    ArrowLeft: [-1.2, 0],
    ArrowRight: [1.2, 0],
    ArrowUp: [0, 1.2],
    ArrowDown: [0, -1.2],
  }
  const move = moves[event.key]
  if (!move || !camera) return false
  event.preventDefault()
  void camera.pan(move[0], move[1])
  return true
}
