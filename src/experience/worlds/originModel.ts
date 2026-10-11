import type { CameraPose, Vec3, WorldHotspot } from '../worldTypes'

/** An artistic model of curiosity, not a claim about a running project. */
export const originLandmarks: readonly WorldHotspot[] = [
  {
    id: 'signal',
    title: 'Das Signal',
    kind: 'Neugier',
    description: 'Du gibst den Impuls. Die Verbindung trägt ihn weiter.',
    position: [-28, -5, 8],
    focusPose: { position: [-22, 4, 34], target: [-28, -5, 8], fov: 48, zoom: 1 },
    compactFocusPose: { position: [-21, 2, 41], target: [-28, -5, 8], fov: 48, zoom: 1 },
    evidenceStatus: 'illustrative',
  },
  {
    id: 'relation',
    title: 'Die Verbindung',
    kind: 'Zusammenhang',
    description: 'Der Impuls öffnet die Struktur. Aus einer Frage wird ein Weg.',
    position: [9, 2, -16],
    focusPose: { position: [25, 9, 19], target: [9, 2, -16], fov: 48, zoom: 1 },
    compactFocusPose: { position: [26, 13, 84], target: [9, -5, -16], fov: 48, zoom: 1 },
    evidenceStatus: 'illustrative',
    destination: 'observatory',
  },
  {
    id: 'horizon',
    title: 'Der Horizont',
    kind: 'Entdeckung',
    description: 'Am Ende der Verbindung beginnt der Blick auf meine Projekte.',
    position: [60, 5, -76],
    focusPose: { position: [67, 9, -43], target: [60, 5, -76], fov: 48, zoom: 1 },
    compactFocusPose: { position: [68, 13, -13], target: [60, 1, -76], fov: 48, zoom: 1 },
    evidenceStatus: 'illustrative',
    destination: 'observatory',
  },
]

export const originOverview: CameraPose = {
  position: [0, 10, 48],
  target: [0, 1, -16],
  fov: 48,
  zoom: 1,
}

export const originEdges = [
  { id: 'question-to-connection', from: 'signal', to: 'relation', via: [-14, -10, -8] as Vec3 },
  { id: 'connection-to-horizon', from: 'relation', to: 'horizon', via: [47, -7, -44] as Vec3 },
] as const

export type SignalStep = 0 | 1 | 2
export type SignalAction = 'send' | 'reset'

export function nextSignalStep(step: SignalStep, action: SignalAction): SignalStep {
  if (action === 'reset') return 0
  return step === 1 ? 2 : 1
}

export function signalResponse(step: SignalStep) {
  return {
    reached: originLandmarks.slice(0, step ? step + 1 : 0).map((node) => node.id),
    edges: originEdges.slice(0, step).map((edge) => edge.id),
    aperture: step > 0 ? 1 : 0,
    portal: step === 2,
    message: [
      'Ein Gedanke. Noch ist alles offen.',
      'Dein Impuls öffnet die Verbindung.',
      'Die Verbindung erreicht den Horizont.',
    ][step],
    action: ['Signal senden', 'Signal weitergeben', 'Erneut senden'][step],
  }
}

/** Shared by geometry, interaction and evidence. No renderer dependency. */
export function landmarkPosition(id: string): Vec3 {
  const landmark = originLandmarks.find((node) => node.id === id)
  if (!landmark) throw new Error('Unknown Origin landmark: ' + id)
  return landmark.position
}
