import type {
  AvailableWorldId,
  CameraPose,
  NavigationSnapshot,
  WorldDefinition,
  WorldHotspot,
} from './worldTypes'

const bounds = {
  minDistance: 3,
  maxDistance: 54,
  box: { x: [-19, 19], y: [-12, 12], z: [-26, 15] },
} as const

const origin: WorldDefinition = {
  id: 'origin',
  title: 'Ursprung',
  subtitle: 'Alles beginnt mit einer Frage.',
  introduction: 'Ein Gedanke setzt etwas in Bewegung. Daraus entstehen Verbindungen.',
  renderer: 'r3f',
  defaultPose: { position: [0, 7, 28], target: [0, 0, -7], fov: 51, zoom: 1 },
  bounds,
  hotspots: [
    {
      id: 'signal',
      title: 'Das Signal',
      kind: 'Neugier',
      description: 'Eine kleine Beobachtung kann ein ganzes System in Bewegung setzen.',
      position: [-9, 2, -8],
      focusPose: { position: [-6, 4, 3], target: [-9, 2, -8], fov: 51, zoom: 1 },
      evidenceStatus: 'illustrative',
    },
    {
      id: 'relation',
      title: 'Die Verbindung',
      kind: 'Zusammenhang',
      description: 'Im räumlichen Wechsel werden Beziehungen sichtbar.',
      position: [0, -2, -3],
      focusPose: { position: [1, 1, 9], target: [0, -2, -3], fov: 51, zoom: 1 },
      evidenceStatus: 'illustrative',
      destination: 'observatory',
    },
    {
      id: 'horizon',
      title: 'Der Horizont',
      kind: 'Entdeckung',
      description: 'Hinter dem nächsten Ort liegen die Projekte.',
      position: [10, 3, -20],
      focusPose: { position: [11, 5, -8], target: [10, 3, -20], fov: 51, zoom: 1 },
      evidenceStatus: 'illustrative',
      destination: 'observatory',
    },
  ],
  destinations: ['observatory'],
  contentSectionId: 'origin-content',
  fallbackText: 'Die Projekte sind auch ohne dreidimensionale Ansicht direkt erreichbar.',
  assets: [],
  motion: 'optional',
  loadScene: () => import('./worlds/OriginPreview'),
}

const observatory: WorldDefinition = {
  id: 'observatory',
  title: 'Sternwarte',
  subtitle: 'Ideen bilden Konstellationen.',
  introduction: 'Unterschiedliche Fragen, die sich über Projekte miteinander verbinden.',
  renderer: 'r3f',
  defaultPose: { position: [0, 8, 32], target: [0, 0, -8], fov: 51, zoom: 1 },
  bounds,
  hotspots: [
    {
      id: 'nexus',
      title: 'Nexus',
      kind: 'Workspaces',
      description: 'Notizen, Aufgaben, Dateien und Code gehören für mich zusammen.',
      position: [-10, 2, -14],
      focusPose: { position: [-7, 5, -3], target: [-10, 2, -14], fov: 51, zoom: 1 },
      evidenceStatus: 'verified',
    },
    {
      id: 'cerebri',
      title: 'Cerebri',
      kind: 'Planung',
      description: 'Ein Plan muss überprüfbar und nachvollziehbar bleiben.',
      position: [1, -2, -5],
      focusPose: { position: [2, 2, 6], target: [1, -2, -5], fov: 51, zoom: 1 },
      evidenceStatus: 'verified',
    },
    {
      id: 'forge',
      title: 'Engines',
      kind: 'Eigene Welten',
      description: 'Wie aus Technik Bewegung, Spiel und neue Orte entstehen.',
      position: [11, 2, -19],
      focusPose: { position: [12, 5, -7], target: [11, 2, -19], fov: 51, zoom: 1 },
      evidenceStatus: 'verified',
    },
  ],
  destinations: ['origin'],
  contentSectionId: 'observatory-content',
  fallbackText: 'Direkte Links zu den Repositories bleiben jederzeit zugänglich.',
  assets: [],
  motion: 'optional',
  loadScene: () => import('./worlds/ObservatoryPreview'),
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
): NavigationSnapshot {
  const focus = findHotspot(world, focusId)
  return {
    world,
    focusId: focus?.id ?? null,
    selectionId: focus?.id ?? null,
    pose: clonePose(focus?.focusPose ?? sceneRegistry[world].defaultPose),
    filters: [],
  }
}

export function parseWorldRoute(search: string): NavigationSnapshot {
  const params = new URLSearchParams(search)
  const raw = params.get('world')
  const world = isAvailableWorld(raw) ? raw : 'origin'
  return defaultSnapshot(world, params.get('focus'))
}

export function worldHref(snapshot: NavigationSnapshot): string {
  const query = new URLSearchParams({ atlas: 'preview', world: snapshot.world })
  if (snapshot.focusId) query.set('focus', snapshot.focusId)
  return '/?' + query.toString()
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
