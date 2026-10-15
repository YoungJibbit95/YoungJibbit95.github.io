import { memo, useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  PerspectiveCamera,
  Sprite,
  SRGBColorSpace,
  Vector3,
} from 'three'
import { observatoryProjects } from '../../observatory/data'
import type { ProjectId } from '../../observatory/contracts'

const names: Record<ProjectId, string> = {
  nexus: 'Nexus',
  cerebri: 'Cerebri',
  novacore: 'NovaCore',
  nemisis: 'Nemisis',
  adventura: 'Adventura',
  yjse: 'YjsE',
  jarvis: 'YJarvis',
}
type Rect = { x: number; y: number; width: number; height: number }
const intersects = (a: Rect, b: Rect) =>
  a.x < b.x + b.width + 5 &&
  a.x + a.width + 5 > b.x &&
  a.y < b.y + b.height + 5 &&
  a.y + a.height + 5 > b.y

function labelTexture(text: string) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!
  context.font = '500 32px Arial, sans-serif'
  canvas.width = Math.ceil(context.measureText(text).width) + 36
  canvas.height = 64
  context.font = '500 32px Arial, sans-serif'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  const shade = context.createLinearGradient(0, 0, canvas.width, 0)
  shade.addColorStop(0, 'rgba(7,9,20,0)')
  shade.addColorStop(0.18, 'rgba(7,9,20,0.72)')
  shade.addColorStop(0.82, 'rgba(7,9,20,0.72)')
  shade.addColorStop(1, 'rgba(7,9,20,0)')
  context.fillStyle = shade
  context.fillRect(0, 7, canvas.width, 50)
  context.fillStyle = '#e9edf4'
  context.fillText(text, canvas.width / 2, 32)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return { texture, aspect: canvas.width / canvas.height }
}

/** Seven bounded sprites, updated only on existing demand frames; never React camera state. */
export const CosmicLabels = memo(function CosmicLabels({
  selectedId,
  visibleIds,
  onFocus,
}: {
  selectedId: string | null
  visibleIds: readonly ProjectId[]
  onFocus: (id: ProjectId) => void
}) {
  const { gl, invalidate } = useThree()
  const sprites = useRef(new Map<ProjectId, Sprite>())
  const obstacles = useRef<Rect[]>([])
  const visible = useMemo(() => new Set(visibleIds), [visibleIds])
  const items = useMemo(
    () =>
      observatoryProjects.map((project) => ({
        project,
        ...labelTexture(names[project.id]),
        point: new Vector3(...project.position),
        clip: new Vector3(),
        view: new Vector3(),
        distance: 0,
        eligible: false,
        radius: 0,
        center: { x: 0, y: 0 },
        geometry: { x: 0, y: 0, width: 0, height: 0 },
      })),
    [],
  )
  const scratch = useMemo(() => ({ placed: [] as Rect[], point: new Vector3() }), [])
  const leaders = useMemo(() => {
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(7 * 6), 3))
    geometry.setDrawRange(0, 0)
    return geometry
  }, [])
  useEffect(() => () => leaders.dispose(), [leaders])
  useEffect(() => () => items.forEach((item) => item.texture.dispose()), [items])

  useEffect(() => {
    // Read DOM layout only when overlay layout changes, not during camera motion.
    const host = gl.domElement.closest('.atlas-v3')
    if (!host) return
    const measure = () => {
      const canvas = gl.domElement.getBoundingClientRect()
      obstacles.current = Array.from(host.querySelectorAll('[data-cosmos-occluder]'))
        .filter(
          (element) =>
            element.getClientRects().length &&
            element.getAttribute('data-focused') !== 'true' &&
            getComputedStyle(element).visibility !== 'hidden',
        )
        .map((element) => {
          const rect = element.getBoundingClientRect()
          return {
            x: rect.x - canvas.x,
            y: rect.y - canvas.y,
            width: rect.width,
            height: rect.height,
          }
        })
      invalidate()
    }
    const resize = new ResizeObserver(measure)
    const observe = () => {
      resize.disconnect()
      resize.observe(gl.domElement)
      host.querySelectorAll('[data-cosmos-occluder]').forEach((element) => resize.observe(element))
      measure()
    }
    const mutation = new MutationObserver((records) => {
      // Renderer diagnostic text changes every demand frame. It must never
      // trigger layout reads or schedule another frame through this observer.
      if (
        records.some((record) =>
          [...record.addedNodes, ...record.removedNodes].some(
            (node) =>
              node instanceof Element &&
              (node.matches('[data-cosmos-occluder]') ||
                node.querySelector('[data-cosmos-occluder]')),
          ),
        )
      )
        observe()
    })
    mutation.observe(host, { childList: true, subtree: true })
    observe()
    return () => {
      resize.disconnect()
      mutation.disconnect()
    }
  }, [gl, invalidate, selectedId])

  useFrame(({ camera, size }) => {
    const compact = size.width < 768
    const selected = items.find((item) => item.project.id === selectedId)
    const reading = selected && camera.position.distanceTo(selected.point) < 280
    const focalLength =
      (size.height * (camera as PerspectiveCamera).zoom) /
      (2 * Math.tan(((camera as PerspectiveCamera).fov * Math.PI) / 360))
    for (const item of items) {
      const sprite = sprites.current.get(item.project.id)
      if (!sprite) continue
      sprite.visible = false
      item.distance = camera.position.distanceTo(item.point)
      item.clip.copy(item.point).project(camera)
      item.view.copy(item.point).applyMatrix4(camera.matrixWorldInverse)
      item.eligible =
        visible.has(item.project.id) &&
        item.view.z < 0 &&
        item.clip.z > -1 &&
        item.clip.z < 1 &&
        Math.abs(item.clip.x) < 1 &&
        Math.abs(item.clip.y) < 1 &&
        (!reading || item === selected)
      // In the discovered Nexus, the five actual runtime names take over.
      if (item === selected && item.project.id === 'nexus' && item.distance <= 176)
        item.eligible = false
      item.center.x = ((item.clip.x + 1) * size.width) / 2
      item.center.y = ((1 - item.clip.y) * size.height) / 2
      item.radius = Math.min(
        120,
        Math.max(12, (item.project.radius * 0.78 * focalLength) / -item.view.z),
      )
      Object.assign(item.geometry, {
        x: item.center.x - item.radius,
        y: item.center.y - item.radius,
        width: item.radius * 2,
        height: item.radius * 2,
      })
    }
    // Focus wins; then physically nearer places. Stable order keeps distant labels quiet.
    items.sort((a, b) => Number(b === selected) - Number(a === selected) || a.distance - b.distance)
    scratch.placed.length = 0
    const leaderPositions = leaders.getAttribute('position') as BufferAttribute
    for (const item of items) {
      const sprite = sprites.current.get(item.project.id)
      if (!sprite || !item.eligible) continue
      const height = item === selected ? 32 : compact ? 28 : 30
      const width = height * item.aspect
      const gap = item.radius + 9
      const offsets = [
        [0, -gap - height / 2],
        [0, gap + height / 2],
        [gap + width / 2, 0],
        [-gap - width / 2, 0],
      ]
      for (const [dx, dy] of offsets) {
        const box = {
          x: item.center.x + dx - width / 2,
          y: item.center.y + dy - height / 2,
          width,
          height,
        }
        if (
          box.x < 12 ||
          box.y < 12 ||
          box.x + width > size.width - 12 ||
          box.y + height > size.height - 12
        )
          continue
        if (
          scratch.placed.some((other) => intersects(box, other)) ||
          obstacles.current.some((other) => intersects(box, other))
        )
          continue
        if (items.some((other) => other.eligible && intersects(box, other.geometry))) continue
        scratch.point
          .set(
            ((box.x + width / 2) / size.width) * 2 - 1,
            1 - ((box.y + height / 2) / size.height) * 2,
            item.clip.z,
          )
          .unproject(camera)
        sprite.position.copy(scratch.point)
        const units = -item.view.z / focalLength
        sprite.scale.set(width * units, height * units, 1)
        sprite.visible = true
        const length = Math.hypot(dx, dy)
        const nx = dx / length
        const ny = dy / length
        const end = length - (dx === 0 ? height / 2 : width / 2) - 4
        for (const [index, reach] of [item.radius * 0.62, end].entries()) {
          scratch.point
            .set(
              ((item.center.x + nx * reach) / size.width) * 2 - 1,
              1 - ((item.center.y + ny * reach) / size.height) * 2,
              item.clip.z,
            )
            .unproject(camera)
          leaderPositions.setXYZ(
            scratch.placed.length * 2 + index,
            scratch.point.x,
            scratch.point.y,
            scratch.point.z,
          )
        }
        scratch.placed.push(box)
        break
      }
    }
    leaderPositions.needsUpdate = true
    leaders.setDrawRange(0, scratch.placed.length * 2)
  })

  return (
    <group name="cosmic-project-labels">
      <lineSegments
        geometry={leaders}
        frustumCulled={false}
        renderOrder={11}
        raycast={() => undefined}
      >
        <lineBasicMaterial
          color="#a69ac9"
          transparent
          opacity={0.45}
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>
      {items.map((item) => (
        <sprite
          key={item.project.id}
          ref={(value) => {
            if (value) sprites.current.set(item.project.id, value)
            else sprites.current.delete(item.project.id)
          }}
          name={'cosmic-label-' + item.project.id}
          visible={false}
          renderOrder={12}
          onClick={(event) => {
            if (!event.object.visible || !visible.has(item.project.id) || event.delta > 6) return
            event.stopPropagation()
            onFocus(item.project.id)
          }}
        >
          <spriteMaterial
            map={item.texture}
            depthTest={false}
            depthWrite={false}
            toneMapped={false}
          />
        </sprite>
      ))}
    </group>
  )
})
