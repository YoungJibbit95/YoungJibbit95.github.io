import { getProject } from '../../../data/projects'
import type {
  ObservatoryCluster,
  ObservatoryEdge,
  ObservatoryProject,
  ProjectEvidence,
  ProjectId,
} from '../contracts'

const checkedAt = '2026-10-11'
const github = 'https://github.com/YoungJibbit95'

/** Default-branch revisions inspected through the GitHub API; no runtime requests. */
export const sourceRevisions = {
  nexus: { repository: 'Nexus-Ecosystem', revision: '835cd116174981efe2f330b1083552091f52f808' },
  cerebri: { repository: 'Nexus-Cerebri', revision: '7acff32c266c1fdab91847388cbeff3854e2d0a2' },
  novacore: { repository: 'Novacore-Engine', revision: 'dbdfc38d092e018952ead43d9cb669333ebf70bc' },
  nemisis: { repository: 'Nemisis', revision: '6b0f411eab1a717656adfd7f70f10e2f76a5dcbf' },
  adventura: { repository: 'Adventura', revision: '04b4e2dd8e50db2a3fefd35647e0b7e08028b380' },
  yjse: { repository: '2D-Game-Engine', revision: '5ceb115420cc91ae2cdd36d0b63e4c8c476e05ee' },
  jarvis: { repository: 'YJarvis', revision: 'bad64ef4b9ce67a11b72f11d930e6bf5603ec761' },
} as const

function source(
  id: ProjectId,
  path: string,
  kind: ProjectEvidence['kind'],
  claim: string,
  limits: string,
): ProjectEvidence {
  const { repository, revision } = sourceRevisions[id]
  return {
    id: `${id}:${path}`,
    url: `${github}/${repository}/blob/${revision}/${path}`,
    revision,
    checkedAt,
    kind,
    claim,
    limits,
  }
}

const evidence: Record<ProjectId, readonly ProjectEvidence[]> = {
  nexus: [
    source(
      'nexus',
      'README.md',
      'repository-doc',
      'Vier öffentliche Workspace-/Code-Clients mit React, TypeScript, Electron und Capacitor sowie gemeinsamem @nexus/core.',
      'Lokale Clients in Entwicklung. Cloud, Sync und KI-Angebote sind geplant beziehungsweise privat und hier nicht produktionsverifiziert.',
    ),
  ],
  cerebri: [
    source(
      'cerebri',
      'README.md',
      'repository-doc',
      'Deterministische zeitliche Planung in Rust mit typisierter Evidenz und begrenzter Suche; Software 0.2.0 ist unveröffentlicht.',
      'Keine produktive Kalenderanbindung, kein gelerntes Ranking und keine autonome Kalendermutation. Ausführung ist nur über Mock-/In-Memory-Verträge beschrieben.',
    ),
    source(
      'cerebri',
      'Cargo.toml',
      'code',
      'Rust-Workspace 0.2.0 mit getrennten Temporal-, Constraints-, Planner-, Core- und Integrations-Crates.',
      'Das Manifest belegt die Paketstruktur, keine Veröffentlichung oder Produktreife.',
    ),
  ],
  novacore: [
    source(
      'novacore',
      'README.md',
      'repository-doc',
      'C++23-Engine mit Fixed-Step-Simulation, ECS, SDL3 und Vulkan-Grundlage; als wiederverwendbare Basis für Nemisis entwickelt.',
      'Experimentelle Grundlage. Vollständiges GPU-Mesh-Rendering, UDP-Netzwerk und weitere Systeme stehen laut README noch auf der Roadmap.',
    ),
  ],
  nemisis: [
    source(
      'nemisis',
      'README.md',
      'repository-doc',
      'Frühe FPS-Entwickler-Sandbox mit NovaCore-Eingaben, Bewegung, Waffenlogik und fester Simulation.',
      '6v6 und kommerzielle Spielreife sind Ziele, keine hier nachgewiesenen fertigen Spielmodi. Kein eigener Laufzeittest des Spiels in diesem Audit.',
    ),
    source(
      'nemisis',
      'CMakeLists.txt',
      'code',
      'nemisis_game linkt Novacore::Engine. Die Engine wird per NOVACORE_ENGINE_ROOT, Nachbar-Checkout oder installiertem CMake-Paket aufgelöst.',
      'Belegt eine Build-Abhängigkeit. Belegt weder eine veröffentlichte Engine-Version noch die Vollständigkeit des Spiels.',
    ),
  ],
  adventura: [
    source(
      'adventura',
      'README.md',
      'repository-doc',
      'Früher Java-Voxel-Prototyp mit LWJGL-Client, Netty-Server und deterministischer Weltgenerierung.',
      'Das README nennt ausdrücklich einen frühen Prototyp mit unfertigen Spielschleifen. Vorhandene Multiplayer-Bausteine bedeuten kein fertiges Multiplayer-Produkt.',
    ),
  ],
  yjse: [
    source(
      'yjse',
      'README.md',
      'repository-doc',
      'YjsE ist eine spielbare 2D-Prototyp-Hülle mit MonoGame DesktopGL und .NET 8; Engine, Client und Beispielinhalt sind getrennt.',
      'Prototypstatus. Externe Spiel-Repositories sind ein unterstützter Vertrag; eine Nutzung durch Adventura oder Nemisis ist nicht belegt.',
    ),
  ],
  jarvis: [
    source(
      'jarvis',
      'README.md',
      'repository-doc',
      'YJarvis Local v1: lokaler macOS-Assistent mit Python/FastAPI, Electron/React, Ollama, whisper.cpp und Piper; Aktionen erfordern Freigabe.',
      'V2-Migration beginnt mit Infrastruktur. Plattformübergreifende Setup-Skripte belegen keine native Windows-/Linux-Audio- oder Automationsunterstützung. macOS-Laufzeit hier nicht getestet.',
    ),
  ],
}

/** Coordinates, sizes and silhouettes are authored navigation, never project metrics. */
export const observatoryProjects: readonly ObservatoryProject[] = [
  {
    ...getProject('nexus'),
    status: 'In Entwicklung',
    clusterId: 'connected-work',
    position: [-230, 35, -120],
    radius: 55,
    visual: {
      color: '#a6c9f1',
      silhouette: 'Offener Campus',
      interpretation:
        'Ein Kern und räumlich getrennte Flügel stehen illustrativ für den verbundenen Workspace; keine Darstellung live synchroner Clients.',
    },
    evidence: evidence.nexus,
  },
  {
    ...getProject('cerebri'),
    status: '0.2.0 · unveröffentlicht',
    stack: ['Rust', 'Svelte', 'Zeitliche Planung', 'Typisierte Evidenz'],
    clusterId: 'connected-work',
    position: [-110, 95, -370],
    radius: 55,
    visual: {
      color: '#d3c2a3',
      silhouette: 'Geteiltes Zeitrad',
      interpretation:
        'Geschichtete Ringe erinnern an zeitliche Regeln. Die Geometrie ist eine Illustration, kein laufender Planer.',
    },
    evidence: evidence.cerebri,
  },
  {
    ...getProject('novacore'),
    clusterId: 'world-building',
    position: [115, 15, -190],
    radius: 55,
    visual: {
      color: '#e6ae73',
      silhouette: 'Offene Turbine',
      interpretation:
        'Mechanische Lamellen stehen illustrativ für Engine-Bausteine; ihre Zahl oder Bewegung misst keine tatsächliche Engine-Leistung.',
    },
    evidence: evidence.novacore,
  },
  {
    ...getProject('nemisis'),
    clusterId: 'world-building',
    position: [310, 5, -300],
    radius: 55,
    visual: {
      color: '#df9390',
      silhouette: 'Gerichtetes Fragment',
      interpretation:
        'Die gerichtete Silhouette greift die FPS-Spielidee auf. Sie ist kein Spielasset oder Nachweis fertigen Gameplays.',
    },
    evidence: evidence.nemisis,
  },
  {
    ...getProject('adventura'),
    clusterId: 'world-building',
    position: [255, -70, 40],
    radius: 55,
    visual: {
      color: '#afc8a2',
      silhouette: 'Voxel-Terrassen',
      interpretation:
        'Gestaffelte Blöcke verweisen auf die Voxel-Welt. Sie sind eine kuratierte Miniatur, kein aus Adventura exportierter Spielstand.',
    },
    evidence: evidence.adventura,
  },
  {
    ...getProject('yjse'),
    clusterId: 'world-building',
    position: [-70, -105, -470],
    radius: 55,
    visual: {
      color: '#d4caa2',
      silhouette: 'Schwebende Tile-Ebenen',
      interpretation:
        'Flache Ebenen vermitteln den 2D-Tile-Kontext. Die räumliche Anordnung macht YjsE nicht zu einer 3D-Engine.',
    },
    evidence: evidence.yjse,
  },
  {
    ...getProject('jarvis'),
    name: 'YJarvis',
    status: 'Local v1 · experimentell',
    stack: ['Python', 'FastAPI', 'React', 'Electron', 'Ollama'],
    clusterId: 'local-intelligence',
    position: [-400, -15, -520],
    radius: 55,
    visual: {
      color: '#aaa1cc',
      silhouette: 'Verwobener Signalkörper',
      interpretation:
        'Verschränkte Bögen stehen illustrativ für lokale Verarbeitung mit Grenzen; kein neuronales Modell und kein aktiver Agent.',
    },
    evidence: evidence.jarvis,
  },
]

export const observatoryClusters: readonly ObservatoryCluster[] = [
  {
    id: 'connected-work',
    name: 'Arbeit & Planung',
    description:
      'Kuratierte Nachbarschaft von Workspace und zeitlicher Planung. Eine technische Integration zwischen beiden Projekten ist hier nicht belegt.',
    projectIds: ['nexus', 'cerebri'],
  },
  {
    id: 'world-building',
    name: 'Weltenbau',
    description:
      'Engines, Spiele und wiederverwendbare Weltbausteine. Nur die Verbindung NovaCore → Nemisis ist als technische Abhängigkeit belegt.',
    projectIds: ['novacore', 'nemisis', 'adventura', 'yjse'],
  },
  {
    id: 'local-intelligence',
    name: 'Lokale Assistenz',
    description: 'Ein eigener Ort für lokale Sprachverarbeitung und bewusst freigegebene Aktionen.',
    projectIds: ['jarvis'],
  },
]

export const observatoryEdges: readonly ObservatoryEdge[] = [
  {
    id: 'novacore-nemisis',
    from: 'novacore',
    to: 'nemisis',
    kind: 'technical',
    label: 'Engine → Spiel',
    description:
      'Nemisis bindet NovaCore als CMake-Build-Abhängigkeit ein und linkt Novacore::Engine. Die Richtung zeigt die bereitgestellte Grundlage.',
    evidence: [evidence.nemisis[1], evidence.novacore[0]],
  },
  {
    id: 'nexus-cerebri',
    from: 'nexus',
    to: 'cerebri',
    kind: 'thematic',
    label: 'Arbeit & Planung',
    description:
      'Ein Workspace und ein zeitlicher Planer behandeln verwandte Fragen. Diese kuratierte Nähe behauptet keine Integration oder gemeinsame Runtime.',
    evidence: [evidence.nexus[0], evidence.cerebri[0]],
  },
  {
    id: 'adventura-yjse',
    from: 'adventura',
    to: 'yjse',
    kind: 'thematic',
    label: 'Weltbausteine',
    description:
      'Voxel- und Tile-Welten teilen das Thema des Weltenbaus. Adventura nutzt Java/LWJGL, YjsE C#/MonoGame; eine technische Abhängigkeit ist nicht belegt.',
    evidence: [evidence.adventura[0], evidence.yjse[0]],
  },
  {
    id: 'cerebri-jarvis',
    from: 'cerebri',
    to: 'jarvis',
    kind: 'thematic',
    label: 'Handeln mit Grenzen',
    description:
      'Beide Projekte trennen Vorschlag und Ausführungsbefugnis. Das ist eine thematische Lesart; YJarvis verwendet damit nicht nachweislich Cerebri.',
    evidence: [evidence.cerebri[0], evidence.jarvis[0]],
  },
]
