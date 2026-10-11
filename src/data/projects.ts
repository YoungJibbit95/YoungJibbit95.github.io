export type ProjectId =
  'nexus' | 'cerebri' | 'novacore' | 'nemisis' | 'adventura' | 'yjse' | 'jarvis'

export interface Project {
  id: ProjectId
  name: string
  category: string
  status: string
  tagline: string
  description: string
  question: string
  stack: string[]
  repo: string
  site?: string
}

const github = 'https://github.com/YoungJibbit95'

export const projects: Project[] = [
  {
    id: 'nexus',
    name: 'Nexus Ecosystem',
    category: 'WORKSPACES',
    status: 'In Entwicklung',
    tagline: 'Eine Idee. Ein verbundenes System.',
    description:
      'Notizen, Aufgaben, Dateien und Code gehören für mich zusammen. Mit Nexus erkunde ich, wie ein lokaler Workspace diese Bereiche verbinden kann – über Desktop und Mobile hinweg.',
    question: 'Wie bleiben mehrere Anwendungen ein verständliches Ganzes?',
    stack: ['TypeScript', 'React', 'Electron', 'Capacitor'],
    repo: `${github}/Nexus-Ecosystem`,
    site: 'https://nexusproject.dev',
  },
  {
    id: 'cerebri',
    name: 'Nexus Cerebri',
    category: 'PLANUNG & ALGORITHMEN',
    status: 'Forschungs- und Lernprojekt',
    tagline: 'Ein guter Plan muss erklärbar bleiben.',
    description:
      'Cerebri untersucht zeitliche Planung mit expliziten Fakten, Regeln und begrenzter Suche. Die aktuelle Grundlage ist deterministisch. Vorschlag, Prüfung, Freigabe und Ausführung haben eigene Grenzen.',
    question: 'Warum passt ein Plan – und was darf ein System wirklich verändern?',
    stack: ['Rust', 'Zeitliche Planung', 'Typisierte Evidenz'],
    repo: `${github}/Nexus-Cerebri`,
  },
  {
    id: 'novacore',
    name: 'NovaCore Engine',
    category: 'ENGINES & SPIELE',
    status: 'Experimentelle Engine',
    tagline: 'Die Technik hinter eigenen Welten.',
    description:
      'Eine modulare C++-Engine als Grundlage für Nemisis. Ich beschäftige mich mit fester Simulation, einem eigenen Entity Component System, Vulkan und der Trennung von Engine und Spiel.',
    question: 'Wie greifen Simulation, Rendering und Spielsysteme ineinander?',
    stack: ['C++23', 'Vulkan', 'SDL3', 'CMake'],
    repo: `${github}/Novacore-Engine`,
  },
  {
    id: 'nemisis',
    name: 'Nemisis',
    category: 'ENGINES & SPIELE',
    status: 'Frühe Entwickler-Sandbox',
    tagline: 'Eine Engine braucht eine echte Spielidee.',
    description:
      'Ein FPS-Projekt auf NovaCore. Die frühe Sandbox verbindet Eingaben, Bewegung, Waffenlogik und feste Simulation mit einer eigenen Spielschicht.',
    question: 'Was passiert mit Architektur, wenn daraus Gameplay werden soll?',
    stack: ['C++23', 'NovaCore', 'FPS'],
    repo: `${github}/Nemisis`,
  },
  {
    id: 'adventura',
    name: 'Adventura',
    category: 'ENGINES & SPIELE',
    status: 'Früher Prototyp',
    tagline: 'Eine Welt, die Stück für Stück entsteht.',
    description:
      'Ein Voxel-Survival-Adventure-Prototyp in Java. Weltgenerierung, ein eigener Client und ein dedizierter Server bilden die Grundlage für Erkunden, Bauen und eine gemütlichere Spielwelt.',
    question: 'Wie entsteht aus einzelnen Blöcken eine zusammenhängende Welt?',
    stack: ['Java', 'LWJGL', 'Netty'],
    repo: `${github}/Adventura`,
  },
  {
    id: 'yjse',
    name: 'YjsE',
    category: 'ENGINES & SPIELE',
    status: '2D-Engine-Prototyp',
    tagline: 'Kleine Tiles. Viele Möglichkeiten.',
    description:
      'Eine MonoGame-basierte 2D-Sandbox-Engine in C#. Wiederverwendbarer Kern, Client und Spielinhalt sind getrennt; das Projekt ist mein Experimentierfeld für Welten und Spielsysteme in zwei Dimensionen.',
    question: 'Welche Bausteine braucht eine wiederverwendbare 2D-Welt?',
    stack: ['C#', '.NET', 'MonoGame'],
    repo: `${github}/2D-Game-Engine`,
  },
  {
    id: 'jarvis',
    name: 'YJarvis',
    category: 'LOKALE ASSISTENZ',
    status: 'Experimenteller Desktop-Assistent',
    tagline: 'Assistenz, die auf dem eigenen Rechner bleibt.',
    description:
      'Ein lokaler Desktop-Assistent für macOS. Sprachverarbeitung, ein lokales Modell und Werkzeuge treffen auf bewusste Freigaben. Ich erkunde, wie Assistenz hilfreich und nachvollziehbar werden kann.',
    question: 'Wie kann Software helfen, ohne einfach die Kontrolle zu übernehmen?',
    stack: ['Python', 'FastAPI', 'React', 'Ollama'],
    repo: `${github}/YJarvis`,
  },
]

export const featuredIds: ProjectId[] = ['nexus', 'cerebri', 'novacore', 'jarvis']
export const getProject = (id: ProjectId) => projects.find((project) => project.id === id)!

export const archiveProjects = [
  {
    name: 'Dino-Game',
    description: 'Ein kleines Spiel und ein frühes JavaScript-Experiment.',
    repo: `${github}/Dino-Game`,
  },
  {
    name: 'Simple-Calculator',
    description: 'Ein farbiger Rechner aus meinen ersten Webprojekten.',
    repo: `${github}/Simple-Calculator`,
  },
  {
    name: 'Win11-Cleaner',
    description: 'Ein kleines Python-Werkzeug für Windows.',
    repo: `${github}/Win11-Cleaner`,
  },
]
