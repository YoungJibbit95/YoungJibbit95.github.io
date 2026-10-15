import type { ExplodedPart } from './explodedView'

export interface NexusClient extends ExplodedPart {
  label: string
  role: string
  kind: 'workspace' | 'code'
  platform: 'desktop' | 'mobile'
  color: string
}

/** Authored spatial explanation of the pinned public architecture, never live telemetry. */
export const nexusSemantics = {
  core: {
    id: 'core',
    label: '@nexus/core',
    role: 'Gemeinsame Runtime für Darstellung, Bewegung und Client-Verträge',
  },
  clients: [
    {
      id: 'main',
      label: 'Nexus Main',
      role: 'Workspace · Desktop',
      kind: 'workspace',
      platform: 'desktop',
      color: '#8ddde2',
      closed: [-24, 6, -2],
      opened: [-35, 12, -4],
    },
    {
      id: 'mobile',
      label: 'Nexus Mobile',
      role: 'Workspace · Mobil',
      kind: 'workspace',
      platform: 'mobile',
      color: '#9ab9e8',
      closed: [-12, -6, 22],
      opened: [-17, -12, 33],
    },
    {
      id: 'code',
      label: 'Nexus Code',
      role: 'Code-Editor · Desktop',
      kind: 'code',
      platform: 'desktop',
      color: '#baaff0',
      closed: [12, 6, -22],
      opened: [17, 12, -33],
    },
    {
      id: 'code-mobile',
      label: 'Nexus Code Mobile',
      role: 'Code-Editor · Mobil',
      kind: 'code',
      platform: 'mobile',
      color: '#d1b6e8',
      closed: [24, -6, 2],
      opened: [35, -12, 4],
    },
  ] satisfies readonly NexusClient[],
  explanation:
    'Vier eigenständige Apps teilen @nexus/core. Die Verbindungen zeigen diese gemeinsame Grundlage; sie stellen keinen Live-Datenfluss dar.',
  source:
    'https://github.com/YoungJibbit95/Nexus-Ecosystem/blob/835cd116174981efe2f330b1083552091f52f808/README.md',
} as const
