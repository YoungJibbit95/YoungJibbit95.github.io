import { memo, useEffect, useMemo } from 'react'
import { useLoader, useThree } from '@react-three/fiber'
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  NormalBlending,
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
function starGeometry(foreground: boolean) {
  const random = randomGenerator(950317)
  const positions: number[] = []
  const colors: number[] = []
  const sizes: number[] = []
  const color = new Color()
  // The same 2,800 stars now describe a rift, a distant stellar lens and sparse near space.
  // These are authored sky landmarks, never additional software/project nodes.
  for (let index = 0; index < (foreground ? 200 : 2600); index++) {
    let x: number
    let y: number
    let z: number
    let concentration = 0
    if (foreground) {
      x = (random() - 0.5) * 3900
      y = (random() - 0.5) * 2300
      z = -120 - random() * 1200
    } else if (index < 550) {
      x = (random() - 0.5) * 10000
      y = (random() - 0.5) * 6500
      z = -2800 - random() * 3900
    } else if (index < 2000) {
      const t = random()
      x = (t - 0.5) * 7900 - 650
      const bend = Math.sin(t * Math.PI * 2.3) * 220
      // Unequal arms leave a dark channel; distribution width changes along the band.
      const shoulder = index % 3 === 0 ? -1 : 1
      const spread = 100 + Math.pow(Math.sin(t * Math.PI), 2) * 380
      y = x * 0.28 + bend + shoulder * (95 + random() * spread)
      z = -2300 - random() * 1500
    } else {
      const radius = Math.pow(random(), index % 5 === 0 ? 2.2 : 0.7) * 1450
      const angle = (index % 2) * Math.PI + radius * 0.005 + (random() - 0.5) * 0.7
      const horizontal = Math.cos(angle) * radius
      concentration = 1 - radius / 1450
      x = -2100 + horizontal
      y = -650 + horizontal * 0.27 + Math.sin(angle) * radius * 0.28
      z = -4800 + Math.sin(angle) * radius * 0.55
    }
    positions.push(x, y, z)
    color.set(index % 29 === 0 ? '#d8c2aa' : index % 3 === 0 ? '#9b8bc9' : '#a8c6e2')
    const lens = !foreground && index >= 2000
    color.multiplyScalar(
      (foreground ? 0.4 : lens ? 0.4 + concentration * 0.25 : 0.25) + random() * 0.5,
    )
    colors.push(color.r, color.g, color.b)
    sizes.push(
      foreground
        ? 1.7 + random() * 2
        : lens
          ? 3.2 + random() * 3
          : index % 41 === 0
            ? 5.2
            : 1.5 + random() * 1.7,
    )
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
  geometry.setAttribute('starSize', new Float32BufferAttribute(sizes, 1))
  geometry.computeBoundingSphere()
  return geometry
}

const ignoreRaycast = () => undefined

function amplifyDustShadow(shader: { fragmentShader: string }) {
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <map_fragment>',
    '#include <map_fragment>\n diffuseColor.a = min(0.92, diffuseColor.a * 3.0);',
  )
}
const dustShadowCacheKey = () => 'cosmos-dark-rift-v1'

const dustLayers: {
  position: [number, number, number]
  scale: [number, number, number]
  color: string
  opacity: number
  rotation: number
  order: number
  dark?: boolean
}[] = [
  // Asymmetric, overlapping shoulders continue beyond the viewport at distinct depths.
  {
    position: [-1550, 260, -3200],
    scale: [7100, 1900, 1],
    color: '#6c55ae',
    opacity: 1,
    rotation: 0.23,
    order: -36,
  },
  {
    position: [1250, -190, -2450],
    scale: [4700, 2650, 1],
    color: '#294d9a',
    opacity: 0.82,
    rotation: -0.34,
    order: -35,
  },
  {
    position: [-800, -1700, -2200],
    scale: [5000, 1900, 1],
    color: '#3c438f',
    opacity: 0.78,
    rotation: 0.41,
    order: -34,
  },
  {
    position: [-1850, -620, -4750],
    scale: [3600, 1150, 1],
    color: '#a497c6',
    opacity: 0.62,
    rotation: 0.27,
    order: -37,
  },
  // Normal blending creates an actual dark dust rift instead of raising the whole sky's luminance.
  {
    position: [-650, -100, -2150],
    scale: [5700, 560, 1],
    color: '#030511',
    opacity: 0.84,
    rotation: 0.26,
    order: -30,
    dark: true,
  },
  {
    position: [1150, 280, -1800],
    scale: [2200, 650, 1],
    color: '#060817',
    opacity: 0.73,
    rotation: -0.12,
    order: -29,
    dark: true,
  },
  // Peripheral foreground dust changes its overlap when orbiting, with the project region left clear.
  {
    position: [-1300, -260, -350],
    scale: [1500, 1850, 1],
    color: '#3a3f83',
    opacity: 0.28,
    rotation: -0.48,
    order: -18,
  },
  {
    position: [1550, -650, -850],
    scale: [1900, 1250, 1],
    color: '#4d397e',
    opacity: 0.27,
    rotation: 0.36,
    order: -17,
  },
]

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
  const { camera, invalidate } = useThree()
  useEffect(() => {
    const previous = camera.far
    // Preserve the same camera and pose while retaining the distant sky at max dolly.
    camera.far = 14000
    camera.updateProjectionMatrix()
    invalidate()
    return () => {
      camera.far = previous
      camera.updateProjectionMatrix()
      invalidate()
    }
  }, [camera, invalidate])
  const stars = useMemo(() => [starGeometry(false), starGeometry(true)], [])
  const dust = useLoader(TextureLoader, dustUrl)
  dust.colorSpace = SRGBColorSpace
  useEffect(() => () => stars.forEach((geometry) => geometry.dispose()), [stars])
  const quiet = variant === 'meridian'
  return (
    <group name="living-cosmos-environment">
      {stars.map((geometry, index) => (
        <points
          key={index}
          geometry={geometry}
          frustumCulled={false}
          name={index ? 'cosmos-near-stars' : 'cosmos-depth-stars'}
          renderOrder={index ? -20 : -40}
          raycast={ignoreRaycast}
        >
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
      ))}
      {dustLayers.map((layer, index) => (
        <sprite
          key={index}
          position={layer.position}
          scale={layer.scale}
          renderOrder={layer.order}
          raycast={ignoreRaycast}
          name={layer.dark ? 'cosmos-dark-rift' : 'cosmos-dust-stratum'}
        >
          <spriteMaterial
            {...(layer.dark
              ? { onBeforeCompile: amplifyDustShadow, customProgramCacheKey: dustShadowCacheKey }
              : {})}
            map={dust}
            fog={false}
            color={layer.color}
            opacity={layer.opacity * (quiet ? 0.25 : 1)}
            rotation={layer.rotation}
            depthWrite={false}
            blending={layer.dark ? NormalBlending : AdditiveBlending}
            toneMapped={false}
          />
        </sprite>
      ))}
    </group>
  )
})
