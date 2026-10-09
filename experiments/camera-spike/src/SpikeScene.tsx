import { Line } from '@react-three/drei'
import { Canvas, type ThreeEvent } from '@react-three/fiber'
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'
import { CameraRig } from './CameraRig'
import { DEFAULT_POSE, FOCUS_POINTS, type PointId } from './cameraModel'
import type { CameraRigHandle, SceneProps } from './cameraTypes'

type SpikeSceneProps = SceneProps & { onWebGLFailure: () => void }

function SpatialConstellation({ onFocus }: { onFocus: (id: PointId) => void }) {
  const stars = useMemo(() => {
    // Stable, curated noise: both near-field and far-field, no random layout.
    const result = new Float32Array(170 * 3)
    for (let index = 0; index < 170; index++) {
      const number = (index * 73) % 181
      result[index * 3] = ((number * 43) % 181) / 4 - 21
      result[index * 3 + 1] = ((number * 71) % 181) / 6 - 14
      result[index * 3 + 2] = ((number * 19) % 181) / 3 - 34
    }
    return result
  }, [])

  const focus = (id: PointId, event: ThreeEvent<MouseEvent>) => {
    if (event.delta > 6) return
    event.stopPropagation()
    onFocus(id)
  }

  return (
    <>
      <color attach="background" args={['#070914']} />
      <fog attach="fog" args={['#070914', 32, 96]} />
      <ambientLight intensity={0.42} />
      <directionalLight position={[-7, 10, 12]} intensity={2} color="#a5ecf3" />
      <pointLight position={[-8, 5, 1]} intensity={52} color="#78e8e8" />
      <pointLight position={[8, 5, -8]} intensity={75} color="#a891ff" />
      <gridHelper args={[56, 28, '#3d697a', '#213341']} position={[0, -5, -5]} />

      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#b0d2e5"
          size={0.085}
          sizeAttenuation
          transparent
          opacity={0.67}
          depthWrite={false}
        />
      </points>

      <Line
        points={FOCUS_POINTS.map((point) => [...point.position] as [number, number, number])}
        color="#78e8e8"
        lineWidth={1.5}
        transparent
        opacity={0.4}
      />

      {FOCUS_POINTS.map((point, index) => (
        <group key={point.id} position={[...point.position]}>
          <mesh
            name={`focus-${point.id}`}
            onClick={(event) => focus(point.id, event)}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto'
            }}
          >
            {index === 1 ? (
              <octahedronGeometry args={[1.4, 1]} />
            ) : (
              <icosahedronGeometry args={[index === 0 ? 1.35 : 1.95, 2]} />
            )}
            <meshStandardMaterial
              color={index === 0 ? '#78e8e8' : index === 1 ? '#f3b867' : '#a891ff'}
              roughness={0.27}
              metalness={0.52}
              emissive={index === 0 ? '#114b59' : '#36224c'}
              emissiveIntensity={0.56}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2.7, index * 0.6, 0]}>
            <torusGeometry args={[2.65, 0.026, 6, 110]} />
            <meshBasicMaterial
              color={index === 1 ? '#f3b867' : '#92dfe4'}
              transparent
              opacity={0.7}
              depthWrite={false}
            />
          </mesh>
          <mesh rotation={[0.2, Math.PI / 3, index * 0.8]}>
            <torusGeometry args={[3.35, 0.012, 5, 104]} />
            <meshBasicMaterial color="#9aabef" transparent opacity={0.34} depthWrite={false} />
          </mesh>
          <mesh rotation={[0, 0, index * 0.4]} position={[0, -3, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 3, 5]} />
            <meshBasicMaterial color="#6d96ac" transparent opacity={0.37} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, -5.1, -9]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshBasicMaterial color="#0b1423" transparent opacity={0.65} />
      </mesh>
    </>
  )
}

const SpikeScene = forwardRef<CameraRigHandle, SpikeSceneProps>(function SpikeScene(
  props,
  handle,
) {
  const rig = useRef<CameraRigHandle>(null)

  useImperativeHandle(handle, () => ({
    focus: (point) => rig.current?.focus(point) ?? Promise.resolve(),
    back: () => rig.current?.back() ?? Promise.resolve(false),
    reset: () => rig.current?.reset() ?? Promise.resolve(),
    pan: (x, y) => rig.current?.pan(x, y) ?? Promise.resolve(),
    dolly: (value) => rig.current?.dolly(value) ?? Promise.resolve(),
    cancel: () => rig.current?.cancel(),
    pose: () => rig.current?.pose() ?? null,
  }))

  return (
    <div
      className="canvas-surface"
      data-testid="camera-stage"
      onContextMenu={(event) => event.preventDefault()}
      onPointerDownCapture={() => rig.current?.cancel()}
      onWheelCapture={() => rig.current?.cancel()}
      onTouchStartCapture={() => rig.current?.cancel()}
    >
      <Canvas
        camera={{
          position: [...DEFAULT_POSE.position],
          fov: DEFAULT_POSE.fov,
          near: 0.1,
          far: 230,
        }}
        gl={{ antialias: true, alpha: false, powerPreference: 'low-power' }}
        dpr={[1, 1.5]}
        frameloop="demand"
        onCreated={({ gl }) => {
          gl.domElement.addEventListener(
            'webglcontextlost',
            (event) => {
              event.preventDefault()
              props.onWebGLFailure()
            },
            { once: true },
          )
        }}
      >
        <CameraRig
          ref={rig}
          reducedMotion={props.reducedMotion}
          onPose={props.onPose}
          onSelection={props.onSelection}
        />
        <SpatialConstellation onFocus={(point) => void rig.current?.focus(point)} />
      </Canvas>
    </div>
  )
})

export default SpikeScene
