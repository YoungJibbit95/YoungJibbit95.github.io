import { memo, useLayoutEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { InstancedMesh, Object3D } from 'three'

/** Cut stone terraces give the suspended paper structure a human scale and horizon. */
export const OriginArchitecture = memo(function OriginArchitecture() {
  const strata = useRef<InstancedMesh>(null)
  const invalidate = useThree((state) => state.invalidate)
  useLayoutEffect(() => {
    const transform = new Object3D()
    for (let index = 0; index < 18; index++) {
      transform.position.set(9, -19 - index * 0.6, -20)
      transform.scale.set(45 + index * 2.5, 0.46, 36 + index * 3)
      transform.rotation.y = -0.38
      transform.updateMatrix()
      strata.current?.setMatrixAt(index, transform.matrix)
    }
    if (strata.current) {
      strata.current.instanceMatrix.needsUpdate = true
      strata.current.computeBoundingSphere()
    }
    invalidate()
  }, [invalidate])
  return (
    <group>
      <instancedMesh ref={strata} args={[undefined, undefined, 18]}>
        <boxGeometry />
        <meshStandardMaterial color="#18232a" metalness={0.25} roughness={0.75} />
      </instancedMesh>
      <mesh position={[6, -30.5, -45]}>
        <boxGeometry args={[240, 3, 250]} />
        <meshStandardMaterial color="#080e19" roughness={0.92} />
      </mesh>
      <group position={[-54, -15, -56]} rotation={[0, -0.38, 0]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[-i * 5.5, -i * 1.5, -i * 4]}>
            <boxGeometry args={[3.5, 33 - i * 3, 15]} />
            <meshStandardMaterial color={i === 0 ? '#53606a' : '#343e4b'} roughness={0.9} />
          </mesh>
        ))}
      </group>
      <mesh position={[60, -19, -76]} rotation={[0, -0.22, 0]}>
        <boxGeometry args={[25, 3, 20]} />
        <meshStandardMaterial color="#52606b" roughness={0.8} />
      </mesh>
    </group>
  )
})
