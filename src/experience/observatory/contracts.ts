import type { Project, ProjectId } from '../../data/projects'
import type { CameraPose, Vec3, WorldSceneProps } from '../worldTypes'

export type { ProjectId }
export const projectIds = [
  'nexus',
  'cerebri',
  'novacore',
  'nemisis',
  'adventura',
  'yjse',
  'jarvis',
] as const
export type ClusterId = 'connected-work' | 'world-building' | 'local-intelligence'
export type SemanticLevel = 'macro' | 'meso' | 'micro'
export type RelationKind = 'technical' | 'thematic' | 'illustrative'

export interface ProjectEvidence {
  id: string
  url: string
  revision: string | null
  checkedAt: string
  kind: 'repository-doc' | 'code' | 'curation'
  claim: string
  limits: string
}

export interface ObservatoryProject extends Project {
  clusterId: ClusterId
  position: Vec3
  radius: number
  visual: { color: string; silhouette: string; interpretation: string }
  evidence: readonly ProjectEvidence[]
}

export interface ObservatoryEdge {
  id: string
  from: ProjectId
  to: ProjectId
  kind: RelationKind
  label: string
  description: string
  evidence: readonly ProjectEvidence[]
}

export interface ObservatoryCluster {
  id: ClusterId
  name: string
  description: string
  projectIds: readonly ProjectId[]
}

/** Serialized into the existing NavigationSnapshot.filters, never a second router. */
export interface ObservatoryFilters {
  query: string
  category: string
  technology: string
  status: string
  cluster: ClusterId | ''
}

export interface ObservatoryLodState {
  level: SemanticLevel
  levels: Readonly<Record<ProjectId, SemanticLevel>>
}

export interface ObservatorySceneInput {
  visibleIds: readonly ProjectId[]
  selectedEdgeId: string | null
  onSelectEdge?: (id: string) => void
  onLodChange?: (state: ObservatoryLodState) => void
}

export interface ObservatoryWorldProps extends WorldSceneProps {
  observatory?: ObservatorySceneInput
}

export interface ObservatoryNavigation {
  focusProject: (id: ProjectId, detail?: boolean) => void
  fitAll: () => void
  fitCluster: (id: ClusterId) => void
  setFilters: (filters: ObservatoryFilters) => void
  selectEdge: (id: string | null) => void
  back: () => void
}

export interface ObservatoryFocusTarget {
  id: ProjectId | ClusterId
  pose: CameraPose
  compactPose: CameraPose
}
