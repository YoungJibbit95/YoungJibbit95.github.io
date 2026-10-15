import ObservatoryWorld, { type ObservatoryVisuals } from './ObservatoryWorld'
import type { ObservatoryWorldProps } from '../observatory/contracts'
import { CosmicEnvironment } from './cosmos/CosmicEnvironment'
import { CosmicProjectMarker } from './cosmos/CosmicProjectMarker'
import { NexusSystem } from './cosmos/NexusSystem'
import { CosmicLabels } from './cosmos/CosmicLabels'

const visuals: ObservatoryVisuals = {
  Environment: CosmicEnvironment,
  Labels: CosmicLabels,
  Architecture: function CosmicArchitecture({ id, selected, level }) {
    return id === 'nexus' ? (
      <NexusSystem selected={selected} level={level} />
    ) : (
      <CosmicProjectMarker id={id} selected={selected} level={level} />
    )
  },
}

/** Art-review slice using the registered Observatory's geometry/state contracts. */
export default function CosmicObservatoryWorld(props: ObservatoryWorldProps) {
  return <ObservatoryWorld {...props} visuals={visuals} />
}
