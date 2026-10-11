import { useFrame, useThree } from '@react-three/fiber'
import { memo, useEffect, useMemo, useRef } from 'react'
import {
  BufferGeometry,
  CanvasTexture,
  Float32BufferAttribute,
  Frustum,
  Group,
  Matrix4,
  Object3D,
  PerspectiveCamera,
  Sphere,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  Vector3,
} from 'three'
import { observatoryEdges, observatoryProjects } from '../observatory/data'
import { projectIds } from '../observatory/contracts'
import type {
  ObservatoryLodState,
  ObservatoryProject,
  ObservatoryWorldProps,
  ProjectId,
  SemanticLevel,
} from '../observatory/contracts'
import { ObservatoryAtmosphere } from './observatory/ObservatoryAtmosphere'
import { ProjectArchitecture } from './observatory/ProjectArchitecture'
import { SchnittwerkMaterials, schnittwerk } from './SchnittwerkMaterials'

export function distanceLevel(
  distance: number,
  previous: SemanticLevel,
  compact = false,
): SemanticLevel {
  if (previous === 'micro' && distance < 250) return 'micro'
  if (distance < 220) return 'micro'
  // Portrait cluster fits need more distance to contain the same real spatial envelope.
  if (previous !== 'macro' && distance < (compact ? 2050 : 690)) return 'meso'
  return distance < (compact ? 1850 : 620) ? 'meso' : 'macro'
}

/** Three raycasts hidden descendants too; hidden hits must never stop a visible hit behind. */
export function isVisibleHit(object: Object3D): boolean {
  for (let ancestor: Object3D | null = object; ancestor; ancestor = ancestor.parent) {
    if (!ancestor.visible) return false
  }
  return true
}

const ProjectName = memo(function ProjectName({
  project,
  selectedId,
}: {
  project: ObservatoryProject
  selectedId: string | null
}) {
  const compact = useThree((state) => state.size.width < 768)
  const shortNames: Record<ProjectId, string> = {
    nexus: 'Nexus',
    cerebri: 'Cerebri',
    novacore: 'NovaCore',
    nemisis: 'Nemisis',
    adventura: 'Adventura',
    yjse: 'YjsE',
    jarvis: 'YJarvis',
  }
  const label = compact ? shortNames[project.id] : project.name
  const macroLabels: Partial<Record<ProjectId, string>> = {
    nexus: 'Arbeit & Planung',
    novacore: 'Weltenbau',
    jarvis: 'Lokale Assistenz',
  }
  const makeTexture = (text: string) => {
    const canvas = document.createElement('canvas')
    canvas.width = 768
    canvas.height = 128
    const ctx = canvas.getContext('2d')!
    ctx.font = '500 64px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const width = Math.min(752, ctx.measureText(text).width + 42)
    ctx.fillStyle = schnittwerk.mineral
    ctx.fillRect((768 - width) / 2, 18, width, 92)
    ctx.fillStyle = schnittwerk.ink
    ctx.fillText(text, 384, 64)
    const next = new CanvasTexture(canvas)
    next.colorSpace = SRGBColorSpace
    return next
  }
  const texture = useMemo(() => makeTexture(label), [label])
  const macroText = compact ? macroLabels[project.id] : undefined
  const macroTexture = useMemo(() => (macroText ? makeTexture(macroText) : null), [macroText])
  const sprite = useRef<Sprite>(null)
  const farLabels = useRef(false)
  const point = useMemo(() => new Vector3(...project.position), [project.position])
  const selectedPoint = useMemo(() => {
    const selected = observatoryProjects.find((item) => item.id === selectedId)
    return selected ? new Vector3(...selected.position) : null
  }, [selectedId])
  useEffect(() => () => texture.dispose(), [texture])
  useEffect(() => () => macroTexture?.dispose(), [macroTexture])
  useFrame(({ camera, size }) => {
    if (!sprite.current) return
    const distance = camera.position.distanceTo(point)
    farLabels.current = compact && (farLabels.current ? distance > 1550 : distance > 1650)
    // In a close reading, a distant neighbour's name must not label the foreground building.
    // Panning away restores map labels without changing selection, camera or history.
    const readingSelected = selectedPoint && camera.position.distanceTo(selectedPoint) < 320
    sprite.current.visible =
      (!readingSelected || project.id === selectedId) &&
      (!farLabels.current || Boolean(macroTexture))
    const material = sprite.current.material as SpriteMaterial
    material.map = farLabels.current && macroTexture ? macroTexture : texture
    const radians = ((camera as PerspectiveCamera).fov * Math.PI) / 180
    const height = (distance * Math.tan(radians / 2) * 2 * 27) / size.height
    sprite.current.scale.set(height * 6, height, 1)
  })
  return (
    <sprite ref={sprite} position={[0, 44, 0]} name={'label-' + project.id} renderOrder={10}>
      <spriteMaterial map={texture} depthTest={false} depthWrite={false} toneMapped={false} />
    </sprite>
  )
})

const Connection = memo(function Connection({
  from,
  to,
  technical,
  selected,
  onSelect,
}: {
  from: ObservatoryProject
  to: ObservatoryProject
  technical: boolean
  selected: boolean
  onSelect: () => void
}) {
  const geometry = useMemo(() => {
    const start = new Vector3(...from.position)
    const end = new Vector3(...to.position)
    const positions: number[] = []
    const sections = technical ? 1 : 24
    for (let i = 0; i < sections; i++) {
      const a = start.clone().lerp(end, i / sections)
      const b = start.clone().lerp(end, (i + (technical ? 1 : 0.58)) / sections)
      positions.push(...a.toArray(), ...b.toArray())
    }
    const next = new BufferGeometry()
    next.setAttribute('position', new Float32BufferAttribute(positions, 3))
    return next
  }, [from.position, to.position, technical])
  useEffect(() => () => geometry.dispose(), [geometry])
  return (
    <lineSegments
      geometry={geometry}
      name={`edge-${from.id}-${to.id}`}
      onClick={(event) => {
        if (event.delta > 6) return
        event.stopPropagation()
        onSelect()
      }}
    >
      <lineBasicMaterial
        color={selected ? '#233026' : technical ? '#526731' : '#626f60'}
        transparent
        opacity={selected ? 1 : technical ? 0.95 : 0.62}
      />
    </lineSegments>
  )
})

/** Seven independent silhouettes in one persistent G1 camera coordinate system. */
export default function ObservatoryWorld({
  selectedId,
  onFocus,
  observatory,
}: ObservatoryWorldProps) {
  const { gl, invalidate, raycaster } = useThree()
  const compact = useThree((state) => state.size.width < 768)
  const root = useRef<Group>(null)
  const visibleIds = observatory?.visibleIds ?? projectIds
  const visible = useMemo(() => new Set(visibleIds), [visibleIds])
  const onLodChange = useRef(observatory?.onLodChange)
  onLodChange.current = observatory?.onLodChange
  const levels = useRef<Record<ProjectId, SemanticLevel>>({
    nexus: 'macro',
    cerebri: 'macro',
    novacore: 'macro',
    nemisis: 'macro',
    adventura: 'macro',
    yjse: 'macro',
    jarvis: 'macro',
  })
  const lastReport = useRef('')
  const overallLevel = useRef<SemanticLevel>('macro')
  const spatial = useMemo(
    () => ({
      frustum: new Frustum(),
      matrix: new Matrix4(),
      spheres: observatoryProjects.map(
        (project) => new Sphere(new Vector3(...project.position), project.radius),
      ),
    }),
    [],
  )
  const layerRefs = useRef(new Map<ProjectId, { meso: Group | null; micro: Group | null }>())

  useEffect(() => {
    invalidate()
    return () => {
      gl.domElement.style.cursor = ''
    }
  }, [gl, invalidate, visible, selectedId])

  useEffect(() => {
    const previous = raycaster.params.Line.threshold
    raycaster.params.Line.threshold = 5
    return () => {
      raycaster.params.Line.threshold = previous
    }
  }, [raycaster])

  useFrame(({ camera }) => {
    if (!root.current) return
    spatial.matrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    spatial.frustum.setFromProjectionMatrix(spatial.matrix)
    let closest = Infinity
    observatoryProjects.forEach((project, index) => {
      const distance = camera.position.distanceTo(spatial.spheres[index].center)
      const inView =
        visible.has(project.id) && spatial.frustum.intersectsSphere(spatial.spheres[index])
      const level = inView ? distanceLevel(distance, levels.current[project.id], compact) : 'macro'
      levels.current[project.id] = level
      if (inView) closest = Math.min(closest, distance)
      let layers = layerRefs.current.get(project.id)
      if (!layers) {
        layers = {
          meso: root.current!.getObjectByName('meso-' + project.id) as Group | null,
          micro: root.current!.getObjectByName('micro-' + project.id) as Group | null,
        }
        layerRefs.current.set(project.id, layers)
      }
      if (layers.meso) layers.meso.visible = level !== 'macro'
      if (layers.micro) layers.micro.visible = level === 'micro'
    })
    const level = distanceLevel(closest, overallLevel.current, compact)
    overallLevel.current = level
    const signature = level + ':' + projectIds.map((id) => levels.current[id]).join(',')
    if (signature !== lastReport.current) {
      lastReport.current = signature
      const snapshot: ObservatoryLodState = { level, levels: { ...levels.current } }
      onLodChange.current?.(snapshot)
    }
  })

  return (
    <SchnittwerkMaterials>
      <color attach="background" args={[schnittwerk.sky]} />
      <fog attach="fog" args={[schnittwerk.sky, 3100, 5600]} />
      <group ref={root} name="observatory-world">
        <ambientLight intensity={0.45} color="#dae5da" />
        <hemisphereLight args={['#f4f5dc', '#5b674f', 0.85]} />
        <directionalLight
          position={[-450, 760, 450]}
          color="#fffbe4"
          intensity={2.6}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-950}
          shadow-camera-right={950}
          shadow-camera-top={950}
          shadow-camera-bottom={-950}
          shadow-camera-far={2300}
          shadow-bias={-0.0003}
          shadow-normalBias={1.1}
        />
        <directionalLight position={[550, 230, -650]} color="#dce8ec" intensity={0.7} />
        <ObservatoryAtmosphere />
        {observatoryEdges.map((edge) => {
          if (!visible.has(edge.from) || !visible.has(edge.to)) return null
          return (
            <Connection
              key={edge.id}
              from={observatoryProjects.find((project) => project.id === edge.from)!}
              to={observatoryProjects.find((project) => project.id === edge.to)!}
              technical={edge.kind === 'technical'}
              selected={edge.id === observatory?.selectedEdgeId}
              onSelect={() => observatory?.onSelectEdge?.(edge.id)}
            />
          )
        })}
        {observatoryProjects.map((project) => (
          <group
            key={project.id}
            name={'observatory-' + project.id}
            position={[...project.position]}
            visible={visible.has(project.id)}
            onClick={(event) => {
              if (event.delta > 6 || !visible.has(project.id) || !isVisibleHit(event.object)) return
              event.stopPropagation()
              onFocus(project.id)
            }}
            onPointerOver={(event) => {
              if (!visible.has(project.id) || !isVisibleHit(event.object)) return
              event.stopPropagation()
              gl.domElement.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
              gl.domElement.style.cursor = ''
            }}
          >
            <ProjectArchitecture
              id={project.id}
              color={project.visual.color}
              selected={selectedId === project.id}
              level="macro"
            />
            <group name={'meso-' + project.id} visible={false}>
              <ProjectArchitecture
                id={project.id}
                color={project.visual.color}
                selected={selectedId === project.id}
                level="meso"
              />
            </group>
            <group name={'micro-' + project.id} visible={false}>
              <ProjectArchitecture
                id={project.id}
                color={project.visual.color}
                selected={selectedId === project.id}
                level="micro"
              />
            </group>
            <ProjectName project={project} selectedId={selectedId} />
          </group>
        ))}
      </group>
    </SchnittwerkMaterials>
  )
}
