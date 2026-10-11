import { memo, useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  Object3D,
  PlaneGeometry,
  SRGBColorSpace,
  Vector3,
} from 'three'
import type { ProjectId } from '../../observatory/contracts'
import type { Vec3 } from '../../worldTypes'
import { useExperienceStore } from '../../../store/experienceStore'
import { schnittwerk, SchnittwerkSurface } from '../SchnittwerkMaterials'

interface Piece {
  geometry: BufferGeometry
  color: string
  position?: Vec3
  rotation?: Vec3
}

/** Curved cut wall with real bevelled top, inner, outer and end faces. */
function arc(
  rx: number,
  rz: number,
  width: number,
  start: number,
  end: number,
  y: number,
  height: number,
  steps = 22,
) {
  const vertices: number[] = []
  const indices: number[] = []
  const uvs: number[] = []
  const profile = [
    [0, 0.45],
    [0.45, 0],
    [width - 0.45, 0],
    [width, 0.45],
    [width, height - 0.45],
    [width - 0.45, height],
    [0.45, height],
    [0, height - 0.45],
  ]
  for (let i = 0; i <= steps; i++) {
    const angle = start + ((end - start) * i) / steps
    profile.forEach(([inset, vertical], j) => {
      vertices.push(Math.cos(angle) * (rx - inset), y + vertical, Math.sin(angle) * (rz - inset))
      uvs.push((i / steps) * 3, j / profile.length)
    })
    if (i < steps)
      for (let j = 0; j < profile.length; j++) {
        const a = i * profile.length + j
        const b = i * profile.length + ((j + 1) % profile.length)
        indices.push(a, a + profile.length, b, b, a + profile.length, b + profile.length)
      }
  }
  for (let j = 1; j < profile.length - 1; j++) {
    indices.push(0, j, j + 1)
    const last = steps * profile.length
    indices.push(last, last + j + 1, last + j)
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}
function box(
  size: Vec3,
  position: Vec3,
  color: string = schnittwerk.mineral,
  rotation?: Vec3,
): Piece {
  return { geometry: new BoxGeometry(...size), position, color, rotation }
}
function curve(
  rx: number,
  rz: number,
  width: number,
  start: number,
  end: number,
  y: number,
  height: number,
  color: string = schnittwerk.mineral,
  steps = 22,
): Piece {
  return { geometry: arc(rx, rz, width, start, end, y, height, steps), color }
}

/** Merge solids and authored tints into one draw and dispose all construction inputs. */
function mergePieces(pieces: Piece[]): BufferGeometry {
  const positions: number[] = []
  const normals: number[] = []
  const colors: number[] = []
  const uvs: number[] = []
  const transform = new Object3D()
  const tint = new Color()
  for (const piece of pieces) {
    transform.position.set(...(piece.position ?? [0, 0, 0]))
    transform.rotation.set(...(piece.rotation ?? [0, 0, 0]))
    transform.updateMatrix()
    piece.geometry.applyMatrix4(transform.matrix)
    const p = piece.geometry.getAttribute('position')
    const n = piece.geometry.getAttribute('normal')
    const uv = piece.geometry.getAttribute('uv')
    const index = piece.geometry.index
    tint.set(piece.color)
    for (let i = 0; i < (index?.count ?? p.count); i++) {
      const v = index ? index.getX(i) : i
      positions.push(p.getX(v), p.getY(v), p.getZ(v))
      normals.push(n.getX(v), n.getY(v), n.getZ(v))
      colors.push(tint.r, tint.g, tint.b)
      uvs.push(uv?.getX(v) ?? 0, uv?.getY(v) ?? 0)
    }
    piece.geometry.dispose()
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3))
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  geometry.computeBoundingSphere()
  return geometry
}

function architecture(id: ProjectId, level: 'macro' | 'meso' | 'micro'): Piece[] {
  const pieces: Piece[] = []
  const white = schnittwerk.mineral
  const cut = schnittwerk.cut
  const yellow = schnittwerk.signal
  if (level === 'macro') {
    pieces.push(curve(47, 43, 42, 0.05, Math.PI * 2 - 0.05, -39, 3.5, schnittwerk.strata, 30))
    if (id === 'nexus') {
      pieces.push({
        geometry: new CylinderGeometry(8, 8, 15, 36),
        color: schnittwerk.ink,
        position: [0, -26, 0],
      })
    } else if (id === 'cerebri') {
      for (let i = 0; i < 6; i++)
        pieces.push(
          curve(
            40 - i * 2.8,
            35 - i * 2.5,
            6,
            0.3 + i * 0.28,
            Math.PI * 1.7 + i * 0.28,
            -33 + i * 10,
            7,
            i % 2 ? '#c6ceba' : white,
            22,
          ),
        )
    } else if (id === 'novacore') {
      for (let i = 0; i < 5; i++) {
        const z = i * 15 - 30
        pieces.push(
          box([6, 52, 7], [-28, -7, z]),
          box([6, 52, 7], [28, -7, z]),
          box([62, 7, 7], [0, 22, z]),
        )
      }
      pieces.push(box([18, 4, 74], [0, -31, 0], cut))
    } else if (id === 'nemisis') {
      for (const side of [-1, 1])
        for (let i = 0; i < 4; i++)
          pieces.push(
            box(
              [7, 9, 83 - i * 8],
              [side * (16 + i * 4), -28 + i * 14, i * 2],
              i % 2 ? '#c6ceba' : white,
              [0, 0, side * -0.1],
            ),
          )
      pieces.push(box([20, 3, 85], [0, -32, 0], cut))
    } else if (id === 'adventura') {
      for (let i = 0; i < 6; i++)
        pieces.push(
          box(
            [79 - i * 11, 7, 66 - i * 8],
            [i * 3 - 8, -33 + i * 9, i * 1.5],
            i % 2 ? '#a5b692' : '#d1d9bc',
          ),
        )
    } else if (id === 'yjse') {
      for (let i = 0; i < 3; i++) {
        pieces.push(box([77, 5, 62], [i * 3 - 3, -30 + i * 21, -i * 5], white))
        for (const side of [-1, 1])
          pieces.push(box([4, 17, 4], [side * 29, -19 + i * 21, -21 - i * 5], cut))
      }
    } else {
      for (let i = 0; i < 7; i++)
        pieces.push(
          curve(
            25 + Math.sin((i / 6) * Math.PI) * 15,
            25 + Math.sin((i / 6) * Math.PI) * 11,
            5.5,
            -0.3 + i * 0.06,
            Math.PI * 1.38 + i * 0.06,
            -33 + i * 9.5,
            7.3,
            i % 2 ? '#c6ceba' : white,
            23,
          ),
        )
    }
    return pieces
  }
  if (level === 'meso') {
    pieces.push(curve(46, 42, 1.5, 0.12, Math.PI * 1.9, -33.8, 1.1, cut, 32))
    if (id === 'nexus')
      for (let q = 0; q < 4; q++)
        pieces.push(
          box(
            [31, 1.4, 2.2],
            [Math.cos((q * Math.PI) / 2) * 17, -30.5, Math.sin((q * Math.PI) / 2) * 17],
            yellow,
            [0, (-q * Math.PI) / 2, 0],
          ),
        )
    else if (id === 'cerebri')
      for (let i = 0; i < 18; i++)
        pieces.push(
          box(
            [3.5, 2, 7],
            [
              Math.cos((i / 18) * Math.PI * 1.5) * 30,
              -29 + i * 2.6,
              Math.sin((i / 18) * Math.PI * 1.5) * 26,
            ],
            i % 6 === 0 ? yellow : cut,
            [0, (-i / 18) * Math.PI * 1.5, 0],
          ),
        )
    else if (id === 'novacore')
      pieces.push(box([7, 1.5, 68], [0, -27, 0], yellow), box([3, 39, 3], [0, -9, -32], cut))
    else if (id === 'nemisis')
      for (let i = 0; i < 7; i++)
        pieces.push(box([15, 1.5, 1.2], [0, -29, 32 - i * 10], i === 0 ? yellow : white))
    else if (id === 'adventura')
      for (let i = 0; i < 8; i++)
        pieces.push(box([3, 1.2, 7], [-28 + i * 5, -27 + i * 5, 24 - i * 2], i % 2 ? cut : yellow))
    else if (id === 'yjse')
      for (let i = 0; i < 3; i++)
        pieces.push(
          box([71, 1.4, 3], [i * 3 - 3, -26 + i * 21, 28 - i * 5], i === 2 ? yellow : cut),
        )
    else
      pieces.push(
        curve(12, 12, 2, 0, Math.PI * 1.6, -29, 2, yellow, 22),
        box([2.5, 35, 2.5], [3, -9, 0], cut),
      )
    return pieces
  }
  if (id === 'nexus') {
    pieces.push(curve(10, 10, 2, 0, Math.PI * 2, -18.2, 1.6, yellow, 32))
    for (let q = 0; q < 4; q++) {
      const a = (q * Math.PI) / 2 + Math.PI / 4
      pieces.push(box([12, 2.2, 12], [Math.cos(a) * 23, -28, Math.sin(a) * 21], cut, [0, -a, 0]))
      for (let line = 0; line < 4; line++)
        pieces.push(
          box([8, 0.5, 0.55], [Math.cos(a) * 23, -26.5, Math.sin(a) * 21 - 3 + line * 2], yellow, [
            0,
            -a,
            0,
          ]),
        )
    }
  } else if (id === 'cerebri') {
    for (let i = 0; i < 11; i++) {
      const a = (i / 11) * Math.PI * 1.35
      pieces.push(
        box(
          [1.1, 8, 1.1],
          [Math.cos(a) * 19, -4 + i * 2.8, Math.sin(a) * 17],
          i % 3 === 0 ? yellow : cut,
        ),
      )
    }
    pieces.push(box([11, 1.4, 15], [0, -24, 0], cut))
  } else if (id === 'novacore') {
    for (let i = 0; i < 4; i++)
      pieces.push(box([22, 4, 9], [0, -22 + i * 9, -9 + i * 7], i === 3 ? yellow : cut))
    for (let i = 0; i < 12; i++)
      pieces.push(
        box([1.4, 1, 3], [i % 2 === 0 ? -10 : 10, -26, -29 + Math.floor(i / 2) * 11], white),
      )
  } else if (id === 'nemisis') {
    for (let i = 0; i < 5; i++)
      pieces.push(box([8, 2, 8], [i % 2 === 0 ? -3 : 3, -26, 24 - i * 12], i === 2 ? yellow : cut))
    pieces.push(box([2, 20, 2], [0, -16, -35], yellow))
  } else if (id === 'adventura') {
    for (let i = 0; i < 18; i++)
      pieces.push(
        box(
          [3.6, 3.6, 3.6],
          [-13 + (i % 6) * 5, 15 + Math.floor(i / 6) * 2, -8 + Math.floor(i / 6) * 5],
          i % 5 === 0 ? yellow : cut,
        ),
      )
  } else if (id === 'yjse') {
    for (let i = 0; i < 24; i++)
      pieces.push(
        box(
          [7.2, 1, 7.2],
          [-25 + (i % 6) * 10, 15, -27 + Math.floor(i / 6) * 10],
          i === 9 || i === 14 ? yellow : i % 2 ? cut : '#bac6a6',
        ),
      )
  } else {
    for (let i = 0; i < 8; i++)
      pieces.push(
        curve(
          14 - i * 0.8,
          14 - i * 0.8,
          1.4,
          -0.2,
          Math.PI * 1.7,
          -26 + i * 3.5,
          1.3,
          i === 7 ? yellow : cut,
          16,
        ),
      )
    pieces.push(box([12, 1.4, 10], [4, -31, 22], yellow))
  }
  return pieces
}

function NexusRoof({ selected }: { selected: boolean }) {
  const reducedMotion = useExperienceStore((state) => state.motion !== 'full')
  const ref = useRef<InstancedMesh>(null)
  const walls = useRef<InstancedMesh>(null)
  const geometry = useMemo(() => arc(42, 38, 21, 0.12, Math.PI / 2 - 0.12, 14, 3, 20), [])
  const wallGeometry = useMemo(
    () =>
      mergePieces(
        [0, 1, 2].map((layer) =>
          curve(
            38,
            34,
            7,
            0.13,
            Math.PI / 2 - 0.13,
            -31 + layer * 15,
            12,
            layer === 1 ? '#cbd2bf' : schnittwerk.mineral,
            18,
          ),
        ),
      ),
    [],
  )
  const scratch = useMemo(
    () => ({ point: new Vector3(), transform: new Object3D(), last: -1, amount: 0, open: false }),
    [],
  )
  const invalidate = useThree((state) => state.invalidate)
  useEffect(
    () => () => {
      geometry.dispose()
      wallGeometry.dispose()
    },
    [geometry, wallGeometry],
  )
  useFrame(({ camera }, delta) => {
    if (!ref.current) return
    ref.current.getWorldPosition(scratch.point)
    const distance = camera.position.distanceTo(scratch.point)
    // The approach pose is ~178.7 units away: Back must restore its closed envelope.
    scratch.open = selected && (scratch.open ? distance < 176 : distance <= 172)
    const target = scratch.open ? 1 : 0
    scratch.amount = reducedMotion
      ? target
      : scratch.amount + (target - scratch.amount) * (1 - Math.exp(-Math.min(delta, 0.05) * 8))
    if (Math.abs(scratch.amount - target) < 0.002) scratch.amount = target
    if (scratch.last !== scratch.amount) {
      for (let q = 0; q < 4; q++) {
        const a = (q * Math.PI) / 2
        scratch.transform.position.set(
          Math.cos(a + Math.PI / 4) * scratch.amount * 9,
          -scratch.amount * 46,
          Math.sin(a + Math.PI / 4) * scratch.amount * 9,
        )
        scratch.transform.rotation.set(0, -a, 0)
        scratch.transform.updateMatrix()
        ref.current.setMatrixAt(q, scratch.transform.matrix)
        // The four client precincts are revealed by a sectional cut through the envelope.
        // This is an authored architectural metaphor, not a live process visualization.
        scratch.transform.position.set(
          Math.cos(a + Math.PI / 4) * scratch.amount * 5,
          -scratch.amount * 34,
          Math.sin(a + Math.PI / 4) * scratch.amount * 5,
        )
        scratch.transform.updateMatrix()
        walls.current?.setMatrixAt(q, scratch.transform.matrix)
      }
      ref.current.instanceMatrix.needsUpdate = true
      ref.current.computeBoundingSphere()
      if (walls.current) {
        walls.current.instanceMatrix.needsUpdate = true
        walls.current.computeBoundingSphere()
      }
      scratch.last = scratch.amount
    }
    if (scratch.amount !== target) invalidate()
  })
  return (
    <group>
      <instancedMesh
        ref={ref}
        geometry={geometry}
        args={[undefined, undefined, 4]}
        name="nexus-opening-roof"
        castShadow
      >
        <SchnittwerkSurface />
      </instancedMesh>
      <instancedMesh
        ref={walls}
        geometry={wallGeometry}
        args={[undefined, undefined, 4]}
        name="nexus-opening-walls"
        castShadow
      >
        <SchnittwerkSurface color="white" vertexColors />
      </instancedMesh>
    </group>
  )
}

function NexusClientPlaques({ selected }: { selected: boolean }) {
  const group = useRef<Group>(null)
  const point = useMemo(() => new Vector3(), [])
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 320
    const context = canvas.getContext('2d')!
    context.fillStyle = schnittwerk.mineral
    context.fillRect(0, 0, 512, 320)
    context.fillStyle = schnittwerk.ink
    context.font = '500 36px Arial, sans-serif'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    ;['Desktop', 'Mobile', 'Code Desktop', 'Code Mobile', '@nexus/core'].forEach((text, i) =>
      context.fillText(text, 256, i * 64 + 32),
    )
    const next = new CanvasTexture(canvas)
    next.colorSpace = SRGBColorSpace
    return next
  }, [])
  const geometry = useMemo(() => {
    const positions: Vec3[] = [
      [-18, -24.5, -16],
      [18, -24.5, -16],
      [-18, -24.5, 16],
      [18, -24.5, 16],
      [0, -18.1, 0],
    ]
    return mergePieces(
      positions.map((position, i) => {
        const geometry = new PlaneGeometry(i === 4 ? 17 : 20, 5)
        geometry.rotateX(-Math.PI / 2)
        const uv = geometry.getAttribute('uv')
        for (let p = 0; p < uv.count; p++) uv.setY(p, (uv.getY(p) + 4 - i) / 5)
        return { geometry, color: 'white', position }
      }),
    )
  }, [])
  useEffect(
    () => () => {
      texture.dispose()
      geometry.dispose()
    },
    [texture, geometry],
  )
  useFrame(({ camera }) => {
    if (group.current) {
      group.current.getWorldPosition(point)
      group.current.visible = selected && camera.position.distanceTo(point) < 176
    }
  })
  return (
    <group ref={group} name="nexus-client-evidence">
      <mesh geometry={geometry}>
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  )
}

/** Illustrative places; the sourced semantic dossier retains factual interpretation. */
export const ProjectArchitecture = memo(function ProjectArchitecture({
  id,
  selected,
  level,
}: {
  id: ProjectId
  color: string
  selected: boolean
  level: 'macro' | 'meso' | 'micro'
}) {
  const geometry = useMemo(() => mergePieces(architecture(id, level)), [id, level])
  useEffect(() => () => geometry.dispose(), [geometry])
  return (
    <group>
      <mesh geometry={geometry} castShadow={level === 'macro'} name={`${level}-architecture-${id}`}>
        <SchnittwerkSurface color="white" vertexColors />
      </mesh>
      {id === 'nexus' && level === 'macro' && <NexusRoof selected={selected} />}
      {id === 'nexus' && level === 'micro' && <NexusClientPlaques selected={selected} />}
    </group>
  )
})
