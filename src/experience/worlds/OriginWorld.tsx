import { Line } from '@react-three/drei'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { memo, useEffect, useMemo, useRef } from 'react'
import { CatmullRomCurve3, Group, Mesh, Vector3 } from 'three'
import { useExperienceStore } from '../../store/experienceStore'
import { useOriginSignal } from '../../store/originSignalStore'
import type { WorldSceneProps } from '../worldTypes'
import { landmarkPosition, originEdges, originLandmarks, signalResponse } from './originModel'
import {
  OriginArchitecture,
  OriginFold,
  OriginHorizonFrame,
  OriginHorizonLeaf,
} from './OriginArchitecture'

const curves = originEdges.map(
  (edge) =>
    new CatmullRomCurve3([
      new Vector3(...landmarkPosition(edge.from)),
      new Vector3(...edge.via),
      new Vector3(...landmarkPosition(edge.to)),
    ]),
)
const curvePoints = curves.map((curve) => curve.getPoints(60))

const QuietSpace = memo(function QuietSpace() {
  return (
    <>
      <color attach="background" args={['#c9d0bf']} />
      <ambientLight intensity={0.3} color="#e3e6d5" />
      <hemisphereLight args={['#f6fae8', '#55604e', 0.85]} />
      <directionalLight
        position={[-60, 95, 45]}
        intensity={2.5}
        color="#fffde9"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-110}
        shadow-camera-right={110}
        shadow-camera-top={110}
        shadow-camera-bottom={-110}
        shadow-camera-far={280}
        shadow-bias={-0.0004}
        shadow-normalBias={0.08}
      />
      <directionalLight position={[70, 40, -70]} intensity={0.6} color="#dcebef" />
      <OriginArchitecture />
    </>
  )
})

function SignalPath() {
  const step = useOriginSignal((state) => state.step)
  const revision = useOriginSignal((state) => state.revision)
  const paused = useOriginSignal((state) => state.playback === 'paused')
  const reduced = useExperienceStore((state) => state.motion !== 'full')
  const pulse = useRef<Mesh>(null)
  const age = useRef(2)
  const invalidate = useThree((state) => state.invalidate)
  const point = useMemo(() => new Vector3(), [])
  useEffect(() => {
    age.current = reduced ? 2 : 0
    invalidate()
  }, [revision, reduced, invalidate])
  useEffect(() => invalidate(), [paused, invalidate])
  useFrame((state, delta) => {
    if (!pulse.current || paused) return
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
          color={step > index ? '#d7e775' : '#667658'}
          lineWidth={step > index ? 2.6 : 0.85}
          transparent
          opacity={step > index ? 1 : 0.5}
        />
      ))}
      <mesh ref={pulse} visible={false}>
        <sphereGeometry args={[0.46, 12, 8]} />
        <meshBasicMaterial color="#f5f8c2" toneMapped={false} />
      </mesh>
    </>
  )
}

/** The existing causal graph moves real architecture; reduced motion reaches identical final poses. */
export default function OriginWorld({ onFocus, selectedId }: WorldSceneProps) {
  const step = useOriginSignal((state) => state.step)
  const reduced = useExperienceStore((state) => state.motion !== 'full')
  const paused = useOriginSignal((state) => state.playback === 'paused')
  const response = signalResponse(step)
  const left = useRef<Group>(null)
  const right = useRef<Group>(null)
  const horizonLeft = useRef<Group>(null)
  const horizonRight = useRef<Group>(null)
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => invalidate(), [step, reduced, paused, invalidate])
  useFrame((state, delta) => {
    if (!left.current || !right.current || !horizonLeft.current || !horizonRight.current) return
    if (paused && !reduced) return
    const move = (first: Group, second: Group, destination: number, turn: number) => {
      const current = second.position.x
      const next = reduced
        ? destination
        : current + (destination - current) * (1 - Math.exp(-delta * 5))
      const settled = Math.abs(next - destination) < 0.003
      second.position.x = settled ? destination : next
      first.position.x = -second.position.x
      second.rotation.y = -second.position.x * turn
      first.rotation.y = -second.rotation.y
      if (!settled) state.invalidate()
    }
    move(left.current, right.current, response.aperture * 7.8, 0.011)
    move(horizonLeft.current, horizonRight.current, response.portal ? 6.4 : 0, 0.016)
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
      <group position={[...originLandmarks[1].position]} onClick={choose('relation')}>
        <group ref={left}>
          <OriginFold side={-1} />
        </group>
        <group ref={right}>
          <OriginFold side={1} />
        </group>
        <mesh position={[0, -12.9, 8]} receiveShadow>
          <boxGeometry args={[21, 0.65, 8]} />
          <meshStandardMaterial color="#e3e6d5" roughness={0.9} />
        </mesh>
        <mesh position={[0, -12.54, 8]}>
          <boxGeometry args={[2.35, 0.055, 8]} />
          <meshStandardMaterial color="#d7e775" roughness={0.85} />
        </mesh>
        {selectedId === 'relation' && (
          <Line
            points={[
              [-12, -12.5, 12],
              [12, -12.5, 12],
            ]}
            color="#d7e775"
            lineWidth={2}
          />
        )}
      </group>
      <group position={[...originLandmarks[0].position]} onClick={choose('signal')}>
        {[0, 1, 2, 3].map((layer) => (
          <mesh key={layer} position={[0, -7.75 + layer * 0.85, 0]} receiveShadow>
            <cylinderGeometry args={[5.7 - layer * 0.3, 5.7 - layer * 0.3, 0.9, 48]} />
            <meshStandardMaterial color={layer % 2 ? '#adbaa1' : '#e3e6d5'} roughness={0.9} />
          </mesh>
        ))}
        <group rotation-y={-0.32}>
          <mesh position={[-1.35, -0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.3, 9.5, 2.5]} />
            <meshStandardMaterial color="#e3e6d5" roughness={0.84} />
          </mesh>
          <mesh position={[1.1, -1.7, -0.35]} castShadow receiveShadow>
            <boxGeometry args={[2.2, 6.5, 3.2]} />
            <meshStandardMaterial color="#626f60" roughness={0.86} />
          </mesh>
          <mesh position={[0.1, -0.2, 1.35]}>
            <boxGeometry args={[0.22, 8, 0.1]} />
            <meshStandardMaterial
              color={step ? '#f1f7ad' : '#d7e775'}
              emissive="#d7e775"
              emissiveIntensity={step ? 0.3 : 0}
              roughness={0.6}
            />
          </mesh>
          {[0, 1, 2, 3].map((index) => (
            <mesh key={index} position={[-1.35, -2.2 + index * 0.8, 1.29]}>
              <boxGeometry args={[1.6, 0.04, 0.025]} />
              <meshStandardMaterial color="#839176" roughness={0.85} />
            </mesh>
          ))}
        </group>
        {selectedId === 'signal' && (
          <Line
            points={[
              [-4, -4.5, 4],
              [4, -4.5, 4],
            ]}
            color="#d7e775"
            lineWidth={2}
          />
        )}
      </group>
      <group position={[...originLandmarks[2].position]} onClick={choose('horizon')}>
        <OriginHorizonFrame />
        <group ref={horizonLeft}>
          <OriginHorizonLeaf side={-1} />
        </group>
        <group ref={horizonRight}>
          <OriginHorizonLeaf side={1} />
        </group>
        <mesh position={[0, -12.32, -7]} receiveShadow>
          <boxGeometry args={[2.4, 0.07, 24]} />
          <meshStandardMaterial color={response.portal ? '#e5ee97' : '#9eac73'} roughness={0.85} />
        </mesh>
      </group>
    </>
  )
}
