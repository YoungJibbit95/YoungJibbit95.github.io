import { useEffect, useRef } from 'react'
import { useMotion } from './MotionProvider'

export function SpaceBackdrop() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const { motion } = useMotion()
  useEffect(() => {
    const element = canvas.current!
    const context = element.getContext('2d')
    if (!context) return
    let width = 0,
      height = 0,
      frame = 0,
      last = 0
    const stars = Array.from({ length: 130 }, (_, i) => ({
      x: ((i * 73.37) % 101) / 101,
      y: ((i * 47.71) % 103) / 103,
      r: 0.55 + (i % 4) * 0.3,
      phase: i * 0.83,
    }))
    function draw(time: number) {
      context!.clearRect(0, 0, width, height)
      stars.forEach((star, i) => {
        const pulse = motion === 'full' ? 0.52 + Math.sin(time * 0.00035 + star.phase) * 0.25 : 0.58
        context!.fillStyle =
          i % 5 === 0 ? `rgba(134,219,242,${pulse})` : `rgba(215,223,253,${pulse})`
        context!.beginPath()
        context!.arc(star.x * width, star.y * height, star.r, 0, Math.PI * 2)
        context!.fill()
        if (i % 17 === 0) {
          context!.strokeStyle = `rgba(154,214,250,${pulse * 0.5})`
          context!.beginPath()
          context!.moveTo(star.x * width - 4, star.y * height)
          context!.lineTo(star.x * width + 4, star.y * height)
          context!.moveTo(star.x * width, star.y * height - 4)
          context!.lineTo(star.x * width, star.y * height + 4)
          context!.stroke()
        }
      })
    }
    function resize() {
      width = innerWidth
      height = innerHeight
      const ratio = Math.min(devicePixelRatio || 1, 1.5)
      element.width = width * ratio
      element.height = height * ratio
      context!.setTransform(ratio, 0, 0, ratio, 0, 0)
      draw(0)
    }
    function tick(time: number) {
      if (time - last > 33) {
        draw(time)
        last = time
      }
      frame = requestAnimationFrame(tick)
    }
    function visibility() {
      cancelAnimationFrame(frame)
      if (motion === 'full' && !document.hidden) frame = requestAnimationFrame(tick)
    }
    resize()
    visibility()
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [motion])
  return (
    <div className="space-backdrop" aria-hidden="true">
      <div className="nebula nebula--blue" />
      <div className="nebula nebula--violet" />
      <canvas ref={canvas} />
    </div>
  )
}
