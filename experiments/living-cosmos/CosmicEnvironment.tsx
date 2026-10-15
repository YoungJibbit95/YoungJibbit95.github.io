import { memo, useEffect, useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  SRGBColorSpace,
  TextureLoader,
} from 'three'
import dustUrl from './nebula-dust.png'

export type CosmosVariant = 'nebula' | 'meridian'

export const cosmos = {
  void: '#070914',
  navy: '#0B1232',
  violet: '#7257B8',
  focus: '#A891FF',
  signal: '#78E8E8',
  starlight: '#E9EDF4',
} as const

function randomGenerator(seed: number) {
  return () => {
    seed = (1664525 * seed + 1013904223) >>> 0
    return seed / 4294967296
  }
}

/** Authored imaginary sky, not astronomical or project data. */
function starGeometry() {
  const random = randomGenerator(950317)
  const positions: number[] = []
  const colors: number[] = []
  const sizes: number[] = []
  const color = new Color()
  for (let index = 0; index < 2800; index++) {
    // Three actual world-space depth strata make camera movement reveal parallax.
    const layer = index % 3
    const band = index >= 1900
    const x = (random() - 0.5) * (band ? 5800 : layer === 0 ? 3200 : 7500)
    const y = band
      ? x * 0.28 - 250 + (random() - 0.5) * 620
      : (random() - 0.5) * (layer === 0 ? 1800 : 4300)
    const z = band
      ? -2100 - random() * 1000
      : layer === 0
        ? -350 - random() * 1150
        : -1500 - random() * 4800
    positions.push(x, y, z)
    color.set(index % 11 === 0 ? '#e4c4ac' : index % 4 === 0 ? '#a99be4' : '#cbdff7')
    color.multiplyScalar(0.35 + random() * 0.65)
    colors.push(color.r, color.g, color.b)
    sizes.push(index % 23 === 0 ? 5.2 : 1.4 + random() * 1.5)
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
  geometry.setAttribute('starSize', new Float32BufferAttribute(sizes, 1))
  geometry.computeBoundingSphere()
  return geometry
}

const vertexShader = `
  attribute float starSize;
  varying vec3 vColor;
  void main() {
    vColor = color;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = clamp(starSize * 1700.0 / max(350.0, -mv.z), 1.0, 7.0);
    gl_Position = projectionMatrix * mv;
  }
`
const fragmentShader = `
  varying vec3 vColor;
  void main() {
    float r = length(gl_PointCoord - .5) * 2.0;
    float alpha = pow(max(0.0, 1.0-r), 1.5);
    gl_FragColor = vec4(vColor, alpha);
  }
`

/** Drop into the existing persistent Canvas. No camera, lights, events or frame loop. */
export const CosmicEnvironment = memo(function CosmicEnvironment({
  variant = 'nebula',
}: {
  variant?: CosmosVariant
}) {
  const stars = useMemo(starGeometry, [])
  const dust = useLoader(TextureLoader, dustUrl)
  dust.colorSpace = SRGBColorSpace
  useEffect(() => () => stars.dispose(), [stars])
  const quiet = variant === 'meridian'
  return (
    <group name="living-cosmos-environment">
      <points geometry={stars} frustumCulled={false} name="cosmos-depth-stars">
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          vertexColors
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </points>
      <sprite position={[-720, 240, -1900]} scale={[5600, 2200, 1]}>
        <spriteMaterial
          map={dust}
          color="#6854ab"
          opacity={quiet ? 0.18 : 0.88}
          rotation={-0.34}
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </sprite>
      <sprite position={[1100, -300, -2750]} scale={[4700, 1800, 1]}>
        <spriteMaterial
          map={dust}
          color="#254d9a"
          opacity={quiet ? 0.2 : 0.8}
          rotation={0.46}
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </sprite>
      <sprite position={[-500, -1500, -2000]} scale={[5200, 2400, 1]}>
        <spriteMaterial
          map={dust}
          color="#504d98"
          opacity={quiet ? 0.13 : 0.64}
          rotation={-0.3}
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </sprite>
      <sprite position={[-1000, 470, -4200]} scale={[6500, 3000, 1]}>
        <spriteMaterial
          map={dust}
          color="#7265a9"
          opacity={quiet ? 0.12 : 0.43}
          rotation={0.1}
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </sprite>
    </group>
  )
})
