import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import { fitProjects } from '/src/experience/observatory/camera'
import ObservatoryWorld from '/src/experience/worlds/ObservatoryWorld'
import { observatoryProjects } from '/src/experience/observatory/data'
const compact = innerWidth < 600
const overview = compact
  ? fitProjects(observatoryProjects, 0.5)
  : { position: [320, 300, 620], target: [0, 0, -220] }
const bindControls = (c) => {
  window.controls = c
  c?.setLookAt(...overview.position, ...overview.target, false)
}
function Probe() {
  const { camera, gl, scene, invalidate } = useThree()
  useEffect(() => {
    window.art = {
      camera,
      gl,
      scene,
      invalidate,
      setPose: (position, target) => {
        window.controls.setLookAt(...position, ...target, false)
        invalidate()
      },
      capture: () => ({
        position: camera.position.toArray(),
        calls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
        geometries: gl.info.memory.geometries,
        textures: gl.info.memory.textures,
      }),
    }
    return () => delete window.art
  }, [camera, gl, scene, invalidate])
  useFrame(() => {
    window.painted = (window.painted || 0) + 1
  })
  return null
}
function App() {
  const [selected, setSelected] = useState(null)
  const [visible, setVisible] = useState(observatoryProjects.map((p) => p.id))
  window.setVisible = setVisible
  return (
    <>
      <header>
        <h1>Die Sternwarte.</h1>
        <p>
          Sieben Projekte. Unterschiedliche Fragen.
          <br />
          Ein Raum zum Erkunden.
        </p>
      </header>
      <Canvas
        camera={{
          position: compact ? [390, 480, 1160] : [320, 300, 620],
          fov: 48,
          far: 6000,
          near: 0.1,
        }}
        dpr={1}
        frameloop="demand"
        gl={{ antialias: true, powerPreference: 'low-power' }}
      >
        <CameraControls ref={bindControls} makeDefault minDistance={20} maxDistance={3600} />
        <ObservatoryWorld
          selectedId={selected}
          onFocus={setSelected}
          observatory={{
            visibleIds: visible,
            selectedEdgeId: null,
            onLodChange: (s) => (window.lod = s),
            onSelectEdge: (id) => (window.selectedEdge = id),
          }}
        />
        <Probe />
      </Canvas>
      <footer>Architektonische Interpretation der Projekte</footer>
    </>
  )
}
createRoot(document.getElementById('root')).render(<App />)
