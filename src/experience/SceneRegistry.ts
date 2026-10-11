import { originLandmarks, originOverview } from './worlds/originModel'
import { observatoryProjects, observatoryClusters } from './observatory/data'
import {
  observatoryBounds,
  observatoryOverview,
  observatoryArrival,
  projectPose,
  fitProjects,
} from './observatory/camera'
import { appendTokensToQuery, tokensFromQuery } from './observatory/routeState'
import { experienceEntryPath } from './entryPath'
import type {
  AvailableWorldId,
  CameraPose,
  NavigationSnapshot,
  WorldDefinition,
  WorldHotspot,
} from './worldTypes'

const origin: WorldDefinition = {
  id: 'origin',
  title: 'Ursprung',
  subtitle: 'Alles beginnt mit einer Frage.',
  introduction: 'Ein Gedanke setzt etwas in Bewegung. Daraus entstehen Verbindungen.',
  renderer: 'r3f',
  defaultPose: originOverview,
  compactPose: { position: [28, 32, 126], target: [9, -3, -16], fov: 56, zoom: 1 },
  bounds: {
    minDistance: 8,
    maxDistance: 165,
    box: { x: [-85, 85], y: [-42, 55], z: [-120, 50] },
  },
  hotspots: originLandmarks,
  destinations: ['observatory'],
  contentSectionId: 'origin-content',
  fallbackText: 'Die Projekte sind auch ohne dreidimensionale Ansicht direkt erreichbar.',
  assets: [],
  motion: 'optional',
  loadScene: () => import('./worlds/OriginWorld'),
}

const observatory: WorldDefinition = {
  id: 'observatory',
  title: 'Sternwarte',
  subtitle: 'Ideen bilden Konstellationen.',
  introduction: 'Unterschiedliche Fragen, die sich über Projekte miteinander verbinden.',
  renderer: 'r3f',
  defaultPose: observatoryOverview,
  compactPose: observatoryArrival(observatoryProjects.find((project) => project.id === 'nexus')!),
  bounds: observatoryBounds,
  hotspots: [
    ...observatoryProjects.map((project): WorldHotspot => ({
      id: project.id,
      title: project.id === 'nexus' ? 'Nexus' : project.id === 'cerebri' ? 'Cerebri' : project.name,
      kind:
        project.id === 'nexus'
          ? 'Workspaces'
          : project.id === 'cerebri'
            ? 'Planung'
            : project.category,
      description: project.description,
      position: project.position,
      focusPose: projectPose(project),
      compactFocusPose: projectPose(project, true),
      evidenceStatus: 'verified',
    })),
    ...observatoryClusters.map((cluster): WorldHotspot => {
      const members = observatoryProjects.filter((project) => project.clusterId === cluster.id)
      const focusPose = fitProjects(members, 1.7)
      return {
        id: 'cluster-' + cluster.id,
        title: cluster.name,
        kind: 'Thematische Region',
        description: cluster.description,
        position: focusPose.target,
        focusPose,
        compactFocusPose: fitProjects(members, 0.5),
        evidenceStatus: 'illustrative',
      }
    }),
  ],
  destinations: ['origin'],
  contentSectionId: 'observatory-content',
  fallbackText: 'Direkte Links zu den Repositories bleiben jederzeit zugänglich.',
  assets: [],
  motion: 'optional',
  loadScene: () => import('./worlds/ObservatoryWorld'),
}

/** Production registry remains intentionally limited until G2/G3 evidence gates. */
export const sceneRegistry: Readonly<Record<AvailableWorldId, WorldDefinition>> = {
  origin,
  observatory,
}
export const availableWorlds: readonly AvailableWorldId[] = ['origin', 'observatory']

export function isAvailableWorld(id: unknown): id is AvailableWorldId {
  return id === 'origin' || id === 'observatory'
}

export function getWorld(id: AvailableWorldId): WorldDefinition {
  return sceneRegistry[id]
}

export function findHotspot(world: AvailableWorldId, focusId: string | null): WorldHotspot | null {
  return sceneRegistry[world].hotspots.find((spot) => spot.id === focusId) ?? null
}

export function clonePose(pose: CameraPose): CameraPose {
  return {
    position: [...pose.position] as [number, number, number],
    target: [...pose.target] as [number, number, number],
    fov: pose.fov,
    zoom: pose.zoom,
  }
}

export function defaultSnapshot(
  world: AvailableWorldId,
  focusId: string | null,
  compact = false,
): NavigationSnapshot {
  const focus = findHotspot(world, focusId)
  const definition = sceneRegistry[world]
  return {
    world,
    focusId: focus?.id ?? null,
    selectionId: focus?.id ?? null,
    pose: clonePose(
      (compact ? focus?.compactFocusPose : null) ??
        focus?.focusPose ??
        (compact ? definition.compactPose : null) ??
        definition.defaultPose,
    ),
    filters: [],
  }
}

export function parseWorldRoute(
  search: string,
  compact = false,
  entryWorld: AvailableWorldId = 'origin',
): NavigationSnapshot {
  const params = new URLSearchParams(search)
  const raw = params.get('world')
  const world = isAvailableWorld(raw) ? raw : entryWorld
  const snapshot = defaultSnapshot(world, params.get('focus'), compact)
  if (world === 'observatory') snapshot.filters = tokensFromQuery(params)
  return snapshot
}

export function worldHref(snapshot: NavigationSnapshot, pathname?: string): string {
  const query = new URLSearchParams({ atlas: 'preview', world: snapshot.world })
  if (snapshot.focusId) query.set('focus', snapshot.focusId)
  if (snapshot.world === 'observatory') appendTokensToQuery(query, snapshot.filters)
  return experienceEntryPath(pathname, snapshot.world) + '?' + query.toString()
}

export function validateRegistry(): string[] {
  const issues: string[] = []
  for (const world of availableWorlds) {
    const definition = sceneRegistry[world]
    const names = new Set<string>()
    if (!definition.loadScene || definition.id !== world) issues.push('Invalid world: ' + world)
    for (const destination of definition.destinations) {
      if (!isAvailableWorld(destination)) issues.push('Missing destination: ' + destination)
    }
    for (const spot of definition.hotspots) {
      if (names.has(spot.id)) issues.push('Duplicate hotspot: ' + spot.id)
      names.add(spot.id)
      if (spot.destination && !isAvailableWorld(spot.destination)) {
        issues.push('Missing portal: ' + spot.id)
      }
      if (spot.position.length !== 3 || spot.focusPose.position.length !== 3) {
        issues.push('Invalid position: ' + spot.id)
      }
    }
  }
  return issues
}
