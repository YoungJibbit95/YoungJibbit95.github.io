import { Line } from '@react-three/drei'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { memo, useEffect, useMemo, useRef } from 'react'
import { CatmullRomCurve3, Group, InstancedMesh, Mesh, Object3D, Vector3 } from 'three'
import { useExperienceStore } from '../../store/experienceStore'
import { useOriginSignal } from '../../store/originSignalStore'
import type { WorldSceneProps } from '../worldTypes'
import { landmarkPosition, originEdges, originLandmarks, signalResponse } from './originModel'

const stars = Float32Array.from(
  Array.from({ length: 240 }, (_, index) => [
    ((index * 73) % 347) - 173,
    ((index * 47) % 181) - 70,
    -45 - ((index * 109) % 160),
  ]).flat(),
)

const curves = originEdges.map(
  (edge) =>
    new CatmullRomCurve3([
      new Vector3(...landmarkPosition(edge.from)),
      new Vector3(...edge.via),
      new Vector3(...landmarkPosition(edge.to)),
    ]),
)
const curvePoints = curves.map((curve) => curve.getPoints(60))

/** Each fin is a section of one continuous, split body. Repeated ribs are instanced. */
function Lamellae({ side, lit }: { side: -1 | 1; lit: boolean }) {
  const fins = useRef<InstancedMesh>(null)
  const seams = useRef<InstancedMesh>(null)
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => {
    const transform = new Object3D()
    for (let index = 0; index < 42; index++) {
      const t = index / 41
      const waist = Math.sin(t * Math.PI)
      const width = 2.4 + waist * 9.4
      transform.position.set(
        side * (1.4 + width * 0.5),
        (t - 0.5) * 29,
        Math.sin(t * Math.PI * 1.3) * 2,
      )
      transform.rotation.set(0, (t - 0.5) * 1.45 * side, side * 0.03)
      transform.scale.set(width, 0.36, 3.2 + waist * 2.5)
      transform.updateMatrix()
      fins.current?.setMatrixAt(index, transform.matrix)
      transform.position.x -= side * width * 0.47
      transform.scale.set(0.07, 0.39, 2.2 + waist * 3.6)
      transform.updateMatrix()
      seams.current?.setMatrixAt(index, transform.matrix)
    }
    if (fins.current) {
      fins.current.instanceMatrix.needsUpdate = true
      fins.current.computeBoundingSphere()
    }
    if (seams.current) {
      seams.current.instanceMatrix.needsUpdate = true
      seams.current.computeBoundingSphere()
    }
    invalidate()
  }, [side, invalidate])
  return (
    <>
      <instancedMesh ref={fins} args={[undefined, undefined, 42]}>
        <boxGeometry />
        <meshStandardMaterial
          color={side === 1 ? '#a4b5bd' : '#738b9c'}
          metalness={0.42}
          roughness={0.34}
        />
      </instancedMesh>
      <instancedMesh ref={seams} args={[undefined, undefined, 42]}>
        <boxGeometry />
        <meshStandardMaterial
          color="#87c8cd"
          emissive="#78e8e8"
          emissiveIntensity={lit ? 2 : 0.35}
          metalness={0.35}
          roughness={0.4}
        />
      </instancedMesh>
    </>
  )
}

const QuietSpace = memo(function QuietSpace() {
  return (
    <>
      <color attach="background" args={['#070914']} />
      <fog attach="fog" args={['#070914', 115, 250]} />
      <ambientLight intensity={0.8} color="#b7c9da" />
      <directionalLight position={[-35, 48, 36]} intensity={3.8} color="#d5ecf4" />
      <directionalLight position={[38, -9, -8]} intensity={2.8} color="#6e9cab" />
      <directionalLight position={[-20, -14, -38]} intensity={2.4} color="#ac927c" />
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#aab9d1"
          size={0.105}
          transparent
          opacity={0.48}
          depthWrite={false}
        />
      </points>
      {/* Clipped foreground remnants and distant siblings establish physical parallax. */}
      <group position={[-40, -23, 23]} rotation={[0.18, 0.2, -0.34]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[i * 2.5, 0, -i * 2]}>
            <boxGeometry args={[1.1, 35 - i * 3, 3]} />
            <meshStandardMaterial color="#263c4b" metalness={0.6} roughness={0.5} />
          </mesh>
        ))}
      </group>
      <group position={[-64, -12, -85]} rotation={[0.2, 0.5, 0.15]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[i * 3, i * 1.5, -i]}>
            <boxGeometry args={[1.5, 23, 3]} />
            <meshStandardMaterial color="#455e72" roughness={0.8} />
          </mesh>
        ))}
      </group>
      <Line
        points={[
          [-95, -18, -95],
          [-42, -17, -30],
          [9, -18, -16],
          [76, -19, -90],
        ]}
        color="#344b5d"
        lineWidth={0.65}
        transparent
        opacity={0.6}
      />
    </>
  )
})

function SignalPath() {
  const step = useOriginSignal((state) => state.step)
  const revision = useOriginSignal((state) => state.revision)
  const reduced = useExperienceStore((state) => state.motion !== 'full')
  const pulse = useRef<Mesh>(null)
  const age = useRef(2)
  const invalidate = useThree((state) => state.invalidate)
  const point = useMemo(() => new Vector3(), [])
  useEffect(() => {
    age.current = reduced ? 2 : 0
    invalidate()
  }, [revision, reduced, invalidate])
  useFrame((state, delta) => {
    if (!pulse.current) return
    const moving = step > 0 && !reduced && age.current < 1.4
    pulse.current.visible = moving
    if (!moving) return
    age.current += Math.min(delta, 0.05)
    curves[step - 1].getPoint(Math.min(age.current / 1.4, 1), point)
    pulse.current.position.copy(point)
    state.invalidate()
  })
  return (
    <>
      {originEdges.map((edge, index) => (
        <Line
          key={edge.id}
          points={curvePoints[index]}
          color={step > index ? '#78e8e8' : '#425968'}
          lineWidth={step > index ? 2.4 : 0.85}
          transparent
          opacity={step > index ? 0.95 : 0.55}
        />
      ))}
      <mesh ref={pulse} visible={false}>
        <sphereGeometry args={[0.46, 12, 8]} />
        <meshBasicMaterial color="#e5ffff" toneMapped={false} />
      </mesh>
    </>
  )
}

/** Origin's geometry responds to the same pure graph as its accessible controls. */
export default function OriginWorld({ onFocus, selectedId }: WorldSceneProps) {
  const step = useOriginSignal((state) => state.step)
  const reduced = useExperienceStore((state) => state.motion !== 'full')
  const response = signalResponse(step)
  const left = useRef<Group>(null)
  const right = useRef<Group>(null)
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => invalidate(), [step, reduced, invalidate])
  useFrame((state, delta) => {
    if (!left.current || !right.current) return
    const destination = response.aperture * 2.8
    const current = right.current.position.x
    const next = reduced
      ? destination
      : current + (destination - current) * (1 - Math.exp(-delta * 5))
    right.current.position.x = Math.abs(next - destination) < 0.003 ? destination : next
    left.current.position.x = -right.current.position.x
    if (Math.abs(current - destination) > 0.003) state.invalidate()
  })
  const choose = (id: string) => (event: ThreeEvent<MouseEvent>) => {
    if (event.delta > 6) return
    event.stopPropagation()
    onFocus(id)
  }
  return (
    <>
      <QuietSpace />
      <SignalPath />
      <group
        position={[...originLandmarks[1].position]}
        rotation={[0.06, -0.38, -0.22]}
        onClick={choose('relation')}
      >
        <group ref={left}>
          <Lamellae side={-1} lit={response.aperture > 0} />
        </group>
        <group ref={right}>
          <Lamellae side={1} lit={response.aperture > 0} />
        </group>
        <mesh rotation={[0, 0, 0.05]}>
          <boxGeometry args={[0.13, 25, 0.18]} />
          <meshBasicMaterial color={step ? '#9dffff' : '#4a818c'} toneMapped={false} />
        </mesh>
        <mesh position={[0, -15.5, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[1.1, 1.1, 1.1]} />
          <meshStandardMaterial color="#e3b98d" metalness={0.6} roughness={0.3} />
        </mesh>
        {selectedId === 'relation' && (
          <Line
            points={[
              [-16, -17, 0],
              [-16, -19, 0],
              [16, -19, 0],
              [16, -17, 0],
            ]}
            color="#a891ff"
            lineWidth={1.5}
          />
        )}
      </group>
      <group
        position={[...originLandmarks[0].position]}
        rotation={[0.2, 0.4, 0.15]}
        onClick={choose('signal')}
      >
        <mesh>
          <boxGeometry args={[1.5, 7, 1.7]} />
          <meshStandardMaterial color="#8295a1" metalness={0.7} roughness={0.35} />
        </mesh>
        <mesh position={[1, 0, 1]}>
          <boxGeometry args={[0.12, 6, 0.18]} />
          <meshBasicMaterial color={step ? '#a7ffff' : '#78b7c4'} toneMapped={false} />
        </mesh>
        <mesh position={[-1.4, -2, -0.5]}>
          <boxGeometry args={[0.4, 10, 3]} />
          <meshStandardMaterial color="#3d5465" metalness={0.6} roughness={0.45} />
        </mesh>
        {selectedId === 'signal' && (
          <Line
            points={[
              [-3, -6, 0],
              [3, -6, 0],
            ]}
            color="#a891ff"
            lineWidth={2}
          />
        )}
      </group>
      <group
        position={[...originLandmarks[2].position]}
        rotation={[0, -0.22, 0]}
        onClick={choose('horizon')}
      >
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 5.3, 0, 0]} rotation={[0, 0, side * -0.11]}>
            <mesh>
              <boxGeometry args={[1.4, 22, 3]} />
              <meshStandardMaterial color="#708591" metalness={0.5} roughness={0.5} />
            </mesh>
            <mesh position={[-side * 0.75, 0, 1.5]}>
              <boxGeometry args={[0.12, 21, 0.12]} />
              <meshBasicMaterial
                color={response.portal ? '#acffff' : '#4d7585'}
                toneMapped={false}
              />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 11, 0]}>
          <boxGeometry args={[8, 0.8, 3]} />
          <meshStandardMaterial color="#98a7a9" metalness={0.6} roughness={0.4} />
        </mesh>
        {response.portal && (
          <Line
            points={[
              [-4, -10, 1],
              [0, -12, 1],
              [4, -10, 1],
            ]}
            color="#9cffff"
            lineWidth={3}
          />
        )}
      </group>
    </>
  )
}
