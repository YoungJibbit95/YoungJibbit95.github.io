import { memo, useEffect, useMemo } from 'react'
import { BufferGeometry, CatmullRomCurve3, Color, Float32BufferAttribute, Vector3 } from 'three'
import { observatoryProjects } from '../../observatory/data'
import { schnittwerk, SchnittwerkSurface } from '../SchnittwerkMaterials'

/** The verified project elevations shape one landscape; coordinates are not changed. */
function groundHeight(x: number, z: number) {
  let heights = 0
  let weights = 0
  for (const project of observatoryProjects) {
    const distance = Math.hypot(x - project.position[0], z - project.position[2])
    if (distance < 57) return project.position[1] - 42
    const weight = 1 / Math.pow(Math.max(12, distance - 45), 4)
    heights += (project.position[1] - 42) * weight
    weights += weight
  }
  return heights / weights
}

function surface() {
  const geometry = new BufferGeometry()
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  const columns = 84
  const rows = 78
  for (let row = 0; row <= rows; row++)
    for (let column = 0; column <= columns; column++) {
      const x = -1050 + (column / columns) * 2100
      const z = -1400 + (row / rows) * 2100
      positions.push(x, groundHeight(x, z), z)
      uvs.push(x / 220, z / 220)
      if (row < rows && column < columns) {
        const a = row * (columns + 1) + column
        const b = a + columns + 1
        indices.push(a, b, a + 1, a + 1, b, b + 1)
      }
    }
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  geometry.computeBoundingSphere()
  return geometry
}

function contourBanks() {
  const positions: number[] = []
  const colors: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  const tint = new Color()
  const sections = 88
  for (const side of [-1, 1])
    for (let layer = 0; layer < 7; layer++) {
      const offset = positions.length / 3
      tint.set(layer % 2 ? schnittwerk.strata : schnittwerk.mineral)
      for (let i = 0; i <= sections; i++) {
        const z = -1420 + (i / sections) * 2120
        const inside =
          (495 + Math.sin(z * 0.009) * 48 + Math.sin(z * 0.021) * 12 + layer * 34) * side
        const outer = inside + side * 35
        const height = groundHeight(inside, z) + layer * 11 + 7
        // Horizontal ledge and vertical cut edge form a solid, legible landscape section.
        for (const [x, y] of [
          [inside, height - 8],
          [inside, height],
          [outer, height],
          [outer, height - 8],
        ]) {
          positions.push(x, y, z)
          uvs.push(z / 220, x / 220)
          colors.push(tint.r, tint.g, tint.b)
        }
        if (i < sections)
          for (let face = 0; face < 4; face++) {
            const a = offset + i * 4 + face
            const b = offset + i * 4 + ((face + 1) % 4)
            if (side < 0) indices.push(a, b, a + 4, b, b + 4, a + 4)
            else indices.push(a, a + 4, b, b, a + 4, b + 4)
          }
      }
    }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  geometry.computeBoundingSphere()
  return geometry
}

function visitorPath() {
  const path = new CatmullRomCurve3([
    new Vector3(-70, 0, 490),
    new Vector3(-18, 0, 180),
    new Vector3(-45, 0, -90),
    new Vector3(18, 0, -285),
    new Vector3(-180, 0, -670),
    new Vector3(-160, 0, -1040),
  ])
  const positions: number[] = []
  const indices: number[] = []
  const sections = 140
  for (let i = 0; i <= sections; i++) {
    const t = i / sections
    const point = path.getPoint(t)
    const tangent = path.getTangent(t)
    for (const side of [-1, 1]) {
      const x = point.x + tangent.z * side * 3.4
      const z = point.z - tangent.x * side * 3.4
      positions.push(x, groundHeight(x, z) + 2, z)
    }
    if (i < sections) {
      const a = i * 2
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
    }
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  geometry.computeBoundingSphere()
  return geometry
}

/** The continuous terrain and visitor path are curatorial scenery, not software edges. */
export const ObservatoryAtmosphere = memo(function ObservatoryAtmosphere() {
  const ground = useMemo(surface, [])
  const banks = useMemo(contourBanks, [])
  const path = useMemo(visitorPath, [])
  useEffect(
    () => () => {
      ground.dispose()
      banks.dispose()
      path.dispose()
    },
    [ground, banks, path],
  )
  return (
    <group name="observatory-atmosphere">
      <mesh geometry={ground} receiveShadow name="schnittwerk-landscape">
        <SchnittwerkSurface color={schnittwerk.ground} roughness={0.94} />
      </mesh>
      <mesh geometry={banks} receiveShadow name="schnittwerk-cut-banks">
        <SchnittwerkSurface color="white" vertexColors />
      </mesh>
      <mesh geometry={path} name="schnittwerk-visitor-path">
        <meshStandardMaterial color={schnittwerk.signal} roughness={0.88} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={-170} receiveShadow>
        <planeGeometry args={[14000, 14000]} />
        <meshStandardMaterial color={schnittwerk.ground} roughness={1} />
      </mesh>
    </group>
  )
})
