import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { CanvasTexture, RepeatWrapping } from 'three'

export const schnittwerk = {
  sky: '#c9d0bf',
  mineral: '#e3e6d5',
  cut: '#626f60',
  ink: '#233026',
  ground: '#87967c',
  signal: '#d7e775',
  strata: '#b7c2a7',
} as const

const GrainContext = createContext<CanvasTexture | null>(null)

/** A single authored texture per mounted world; no persistent GPU cache. */
export function SchnittwerkMaterials({ children }: { children: ReactNode }) {
  const grain = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 64
    const context = canvas.getContext('2d')!
    const pixels = context.createImageData(64, 64)
    let seed = 95
    for (let i = 0; i < pixels.data.length; i += 4) {
      seed = (1664525 * seed + 1013904223) >>> 0
      const value = 175 + (seed % 70)
      pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = value
      pixels.data[i + 3] = 255
    }
    context.putImageData(pixels, 0, 0)
    const texture = new CanvasTexture(canvas)
    texture.wrapS = texture.wrapT = RepeatWrapping
    texture.repeat.set(8, 8)
    return texture
  }, [])
  useEffect(() => () => grain.dispose(), [grain])
  return <GrainContext.Provider value={grain}>{children}</GrainContext.Provider>
}

export function SchnittwerkSurface({
  color = schnittwerk.mineral,
  vertexColors = false,
  roughness = 0.84,
}: {
  color?: string
  vertexColors?: boolean
  roughness?: number
}) {
  const grain = useContext(GrainContext)
  return (
    <meshStandardMaterial
      color={color}
      vertexColors={vertexColors}
      roughness={roughness}
      metalness={0.025}
      bumpMap={grain}
      bumpScale={0.045}
    />
  )
}
