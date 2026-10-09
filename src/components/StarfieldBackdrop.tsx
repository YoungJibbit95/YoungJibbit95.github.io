import { useEffect, useRef, useState } from 'react'
import { useMotion } from './MotionProvider'

interface Star {
  x: number
  y: number
  z: number
  radius: number
  alpha: number
  twinkleSpeed: number
  twinklePhase: number
  colorIdx: number
  hasSpikes: boolean
}

interface NebulaCloud {
  x: number
  y: number
  rx: number
  ry: number
  rotation: number
  alpha: number
  layer: number
}

interface ShootingStar {
  x: number
  y: number
  vx: number
  vy: number
  length: number
  life: number
  maxLife: number
  active: boolean
}

export interface CosmicRealmTheme {
  id: string
  code: string
  name: string
  subtitle: string
  primaryHue: string
  secondaryHue: string
  tertiaryHue: string
  coreGlow: string
  starPalette: [string, string, string, string]
  ringStyle: 'constellation' | 'solar' | 'nebula' | 'pulsar' | 'forge' | 'brain' | 'biosphere'
}

export const COSMIC_REALMS: CosmicRealmTheme[] = [
  {
    id: 'start',
    code: 'SEKTOR 00',
    name: 'DEEP SPACE URSPRUNG',
    subtitle: 'STERNENKARTE & KONSTELLATION · 0.00 LY',
    primaryHue: '#6bdbee',
    secondaryHue: '#5678e0',
    tertiaryHue: '#a688fa',
    coreGlow: 'rgba(107, 219, 238, 0.22)',
    starPalette: ['#ffffff', '#aeeeff', '#bfd4ff', '#ffe9c4'],
    ringStyle: 'constellation',
  },
  {
    id: 'tech-orbit',
    code: 'SEKTOR 01',
    name: 'HELIOSPHÄRE · DAS SONNENSYSTEM',
    subtitle: 'TECH-PLANETEN IM ORBIT · 1.00 AU',
    primaryHue: '#ffbe55',
    secondaryHue: '#ff7b39',
    tertiaryHue: '#6bdbee',
    coreGlow: 'rgba(255, 190, 85, 0.24)',
    starPalette: ['#fff9eb', '#ffd584', '#9be8f7', '#ffbfa0'],
    ringStyle: 'solar',
  },
  {
    id: 'projekte',
    code: 'SEKTOR 02',
    name: 'ORBITALE STERNWARTE',
    subtitle: 'INTERAKTIVES STERNENSYSTEM · 2.40 LY',
    primaryHue: '#6bdbee',
    secondaryHue: '#8e7cf6',
    tertiaryHue: '#ffbe55',
    coreGlow: 'rgba(107, 219, 238, 0.20)',
    starPalette: ['#f2f8ff', '#7ce3f7', '#c5b8ff', '#ffe2ad'],
    ringStyle: 'constellation',
  },
  {
    id: 'nexus-geschichte',
    code: 'SEKTOR 03',
    name: 'NEXUS-SPIRALGALAXIE & PULSARE',
    subtitle: 'DREI PULSARE IM GALAKTISCHEN KERN · 4.20 KPC',
    primaryHue: '#38e2eb',
    secondaryHue: '#6b8afd',
    tertiaryHue: '#c084fc',
    coreGlow: 'rgba(56, 226, 235, 0.24)',
    starPalette: ['#e6fdff', '#5eead4', '#93c5fd', '#d8b4fe'],
    ringStyle: 'nebula',
  },
  {
    id: 'cerebri-system',
    code: 'SEKTOR 04',
    name: 'WURMLOCH-CHRONOMETER · CEREBRI',
    subtitle: 'RAUMZEIT-UHRWERK & RUST-EVIDENZ · 7.80 KPC',
    primaryHue: '#c084fc',
    secondaryHue: '#6bdbee',
    tertiaryHue: '#f472b6',
    coreGlow: 'rgba(192, 132, 252, 0.24)',
    starPalette: ['#f8f0ff', '#d8b4fe', '#7dd3fc', '#f9a8d4'],
    ringStyle: 'pulsar',
  },
  {
    id: 'engines-welten',
    code: 'SEKTOR 05',
    name: 'KOSMISCHE WELTEN-SCHMIEDE',
    subtitle: 'AMBOSS · ESSE · NOVACORE & NEMISIS · 12.5 KPC',
    primaryHue: '#ff8a4c',
    secondaryHue: '#fbbf24',
    tertiaryHue: '#6bdbee',
    coreGlow: 'rgba(255, 138, 76, 0.24)',
    starPalette: ['#fff4ed', '#fdba74', '#fcd34d', '#93c5fd'],
    ringStyle: 'forge',
  },
  {
    id: 'jarvis-system',
    code: 'SEKTOR 06',
    name: 'NEURAL-GALAXIE · YJARVIS',
    subtitle: 'SYNAPSEN-KOSMOS & FREIGABE-SCHRANKE · 16.0 KPC',
    primaryHue: '#4ade80',
    secondaryHue: '#38bdf8',
    tertiaryHue: '#a855f7',
    coreGlow: 'rgba(74, 222, 128, 0.22)',
    starPalette: ['#ecfdf5', '#86efac', '#7dd3fc', '#d8b4fe'],
    ringStyle: 'brain',
  },
  {
    id: 'denkweise',
    code: 'SEKTOR 07',
    name: 'STERNEN-MERIDIAN DER ARBEITSWEISE',
    subtitle: '6-STATIONEN-KONSTELLATION · 21.0 KPC',
    primaryHue: '#7dd3fc',
    secondaryHue: '#818cf8',
    tertiaryHue: '#34d399',
    coreGlow: 'rgba(125, 211, 252, 0.20)',
    starPalette: ['#f0f9ff', '#bae6fd', '#c7d2fe', '#a7f3d0'],
    ringStyle: 'constellation',
  },
  {
    id: 'mensch',
    code: 'SEKTOR 08',
    name: 'DER STERNENGARTEN · BIOSPHÄRE',
    subtitle: 'BAUM · SEE · KLANG-LICHTUNG · NATUR',
    primaryHue: '#6ee7b7',
    secondaryHue: '#34d399',
    tertiaryHue: '#fde68a',
    coreGlow: 'rgba(110, 231, 183, 0.24)',
    starPalette: ['#f0fdf4', '#a7f3d0', '#fef08a', '#bae6fd'],
    ringStyle: 'biosphere',
  },
]

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const num = parseInt(clean, 16)
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

export function StarfieldBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { motion } = useMotion()
  const [activeRealm, setActiveRealm] = useState<CosmicRealmTheme>(COSMIC_REALMS[0])
  const realmRef = useRef<CosmicRealmTheme>(COSMIC_REALMS[0])

  useEffect(() => {
    realmRef.current = activeRealm
  }, [activeRealm])

  useEffect(() => {
    const elements = COSMIC_REALMS.map((r) => document.getElementById(r.id)).filter(
      (el): el is HTMLElement => el !== null,
    )
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) {
          const found = COSMIC_REALMS.find((r) => r.id === visible[0].target.id)
          if (found) {
            setActiveRealm(found)
            document.documentElement.setAttribute('data-cosmic-realm', found.id)
          }
        }
      },
      { rootMargin: '-25% 0px -45% 0px', threshold: [0, 0.15, 0.35] },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId = 0
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let scrollY = window.scrollY
    let targetScrollY = window.scrollY
    let scrollVelocity = 0
    let pointerX = 0
    let pointerY = 0

    let currentPrimaryRgb = hexToRgb(realmRef.current.primaryHue)
    let currentSecondaryRgb = hexToRgb(realmRef.current.secondaryHue)
    let currentTertiaryRgb = hexToRgb(realmRef.current.tertiaryHue)

    const starCount = width < 768 ? 140 : 280
    const stars: Star[] = Array.from({ length: starCount }, (_, i) => {
      const depth = (i % 4) + 1 // 1 = deep background dust, 2 = far, 3 = mid, 4 = bright foreground star
      return {
        x: ((i * 137.508) % 100) / 100,
        y: ((i * 293.713) % 100) / 100,
        z: depth,
        radius: depth === 4 ? 2.1 : depth === 3 ? 1.35 : depth === 2 ? 0.9 : 0.55,
        alpha: depth === 4 ? 0.96 : depth === 3 ? 0.72 : depth === 2 ? 0.48 : 0.26,
        twinkleSpeed: 0.012 + (i % 9) * 0.003,
        twinklePhase: i * 0.77,
        colorIdx: i % 4,
        hasSpikes: depth === 4 && i % 5 === 0,
      }
    })

    const nebulae: NebulaCloud[] = [
      { x: 0.22, y: 0.28, rx: 420, ry: 230, rotation: -0.35, alpha: 0.13, layer: 1 },
      { x: 0.78, y: 0.36, rx: 480, ry: 260, rotation: 0.42, alpha: 0.11, layer: 2 },
      { x: 0.48, y: 0.68, rx: 520, ry: 240, rotation: -0.18, alpha: 0.10, layer: 3 },
      { x: 0.18, y: 0.82, rx: 360, ry: 190, rotation: 0.28, alpha: 0.09, layer: 1 },
    ]

    const shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      vx: -9,
      vy: 4.5,
      length: 110,
      life: 0,
      maxLife: 55,
      active: false,
    }

    const drawDiffractionStar = (cx: number, cy: number, r: number, color: string, alpha: number) => {
      ctx.save()
      ctx.globalAlpha = alpha * 0.55
      ctx.strokeStyle = color
      ctx.lineWidth = 0.9
      const spikeLen = r * 6.5
      ctx.beginPath()
      ctx.moveTo(cx - spikeLen, cy)
      ctx.lineTo(cx + spikeLen, cy)
      ctx.moveTo(cx, cy - spikeLen)
      ctx.lineTo(cx, cy + spikeLen)
      ctx.stroke()
      ctx.restore()
    }

    const drawScene = (tick: number) => {
      ctx.clearRect(0, 0, width, height)

      const targetPrimary = hexToRgb(realmRef.current.primaryHue)
      const targetSecondary = hexToRgb(realmRef.current.secondaryHue)
      const targetTertiary = hexToRgb(realmRef.current.tertiaryHue)

      currentPrimaryRgb = [
        currentPrimaryRgb[0] + (targetPrimary[0] - currentPrimaryRgb[0]) * 0.04,
        currentPrimaryRgb[1] + (targetPrimary[1] - currentPrimaryRgb[1]) * 0.04,
        currentPrimaryRgb[2] + (targetPrimary[2] - currentPrimaryRgb[2]) * 0.04,
      ]
      currentSecondaryRgb = [
        currentSecondaryRgb[0] + (targetSecondary[0] - currentSecondaryRgb[0]) * 0.04,
        currentSecondaryRgb[1] + (targetSecondary[1] - currentSecondaryRgb[1]) * 0.04,
        currentSecondaryRgb[2] + (targetSecondary[2] - currentSecondaryRgb[2]) * 0.04,
      ]
      currentTertiaryRgb = [
        currentTertiaryRgb[0] + (targetTertiary[0] - currentTertiaryRgb[0]) * 0.04,
        currentTertiaryRgb[1] + (targetTertiary[1] - currentTertiaryRgb[1]) * 0.04,
        currentTertiaryRgb[2] + (targetTertiary[2] - currentTertiaryRgb[2]) * 0.04,
      ]

      const [pr, pg, pb] = currentPrimaryRgb.map(Math.round)
      const [sr, sg, sb] = currentSecondaryRgb.map(Math.round)
      const [tr, tg, tb] = currentTertiaryRgb.map(Math.round)

      // 1. Deep Space Milky Way / Galactic Dust Band Diagonal Across Sky
      ctx.save()
      ctx.translate(width * 0.5 + pointerX * 18, height * 0.5 + pointerY * 18)
      ctx.rotate(-0.38 + scrollY * 0.00008)
      const dustBand = ctx.createLinearGradient(0, -height * 0.45, 0, height * 0.45)
      dustBand.addColorStop(0, 'rgba(6, 9, 19, 0)')
      dustBand.addColorStop(0.35, `rgba(${sr}, ${sg}, ${sb}, 0.055)`)
      dustBand.addColorStop(0.5, `rgba(${pr}, ${pg}, ${pb}, 0.095)`)
      dustBand.addColorStop(0.65, `rgba(${tr}, ${tg}, ${tb}, 0.055)`)
      dustBand.addColorStop(1, 'rgba(6, 9, 19, 0)')
      ctx.fillStyle = dustBand
      ctx.fillRect(-width, -height * 0.45, width * 2, height * 0.9)
      ctx.restore()

      // 2. Volumetric Multi-Layer Nebulae
      for (const neb of nebulae) {
        const nx = neb.x * width + pointerX * (neb.layer * 16)
        const ny =
          (((neb.y * height - scrollY * 0.04 * neb.layer) % (height * 1.4)) + height * 1.4) %
            (height * 1.4) -
          height * 0.2
        ctx.save()
        ctx.translate(nx, ny)
        ctx.rotate(neb.rotation + tick * 0.0003 * (neb.layer % 2 === 0 ? 1 : -1))
        const rgb = neb.layer === 1 ? [pr, pg, pb] : neb.layer === 2 ? [sr, sg, sb] : [tr, tg, tb]
        const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, neb.rx)
        grad.addColorStop(0, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${neb.alpha})`)
        grad.addColorStop(0.5, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${neb.alpha * 0.45})`)
        grad.addColorStop(1, 'rgba(6, 9, 19, 0)')
        ctx.fillStyle = grad
        ctx.scale(1, neb.ry / neb.rx)
        ctx.beginPath()
        ctx.arc(0, 0, neb.rx, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // 3. Realm-Specific Background Celestial Phenomenon
      const centerX = width * 0.5 + pointerX * 24
      const centerY = height * 0.5 + pointerY * 24
      const ringStyle = realmRef.current.ringStyle

      ctx.save()
      ctx.translate(centerX, centerY)
      const baseRot = tick * 0.001 - scrollY * 0.0003

      if (ringStyle === 'solar') {
        // Realistic Solar Corona & Keplerian Ecliptic
        const sunGlow = ctx.createRadialGradient(0, 0, 8, 0, 0, 320)
        sunGlow.addColorStop(0, `rgba(${pr}, ${pg}, ${pb}, 0.16)`)
        sunGlow.addColorStop(0.4, `rgba(${sr}, ${sg}, ${sb}, 0.06)`)
        sunGlow.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = sunGlow
        ctx.beginPath()
        ctx.arc(0, 0, 320, 0, Math.PI * 2)
        ctx.fill()
      } else if (ringStyle === 'nebula') {
        // Spiral Galaxy Arms in the background
        for (let arm = 0; arm < 2; arm++) {
          ctx.save()
          ctx.rotate(baseRot + arm * Math.PI)
          ctx.beginPath()
          for (let t = 0; t < 45; t++) {
            const angle = t * 0.15
            const r = 24 + t * 8.5
            const x = Math.cos(angle) * r
            const y = Math.sin(angle) * r * 0.62
            if (t === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.strokeStyle = `rgba(${pr}, ${pg}, ${pb}, 0.09)`
          ctx.lineWidth = 18
          ctx.lineCap = 'round'
          ctx.stroke()
          ctx.restore()
        }
      } else if (ringStyle === 'pulsar') {
        // Wormhole Gravitational Lensing Rings
        for (let i = 1; i <= 5; i++) {
          ctx.save()
          ctx.rotate(baseRot * (i % 2 === 0 ? 1.4 : -1.1))
          ctx.beginPath()
          ctx.ellipse(0, 0, i * 82, i * 48, 0.25, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(${pr}, ${pg}, ${pb}, ${0.15 - i * 0.022})`
          ctx.lineWidth = 1.2
          ctx.setLineDash([8, 12])
          ctx.stroke()
          ctx.restore()
        }
      } else if (ringStyle === 'forge') {
        // Rising Forge Embers in the background
        for (let e = 0; e < 24; e++) {
          const ex = ((e * 97) % 600) - 300 + Math.sin(tick * 0.02 + e) * 18
          const ey = 280 - (((tick * 0.7 + e * 45) % 560) + 560) % 560
          ctx.beginPath()
          ctx.arc(ex, ey, 1.5 + (e % 3), 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${pr}, ${pg}, ${pb}, 0.28)`
          ctx.fill()
        }
      } else if (ringStyle === 'brain') {
        // Neural-Galactic Synaptic Web
        ctx.strokeStyle = `rgba(${pr}, ${pg}, ${pb}, 0.09)`
        ctx.lineWidth = 1
        for (let n = 0; n < 12; n++) {
          const a1 = (n / 12) * Math.PI * 2 + baseRot * 0.4
          const a2 = ((n + 3) / 12) * Math.PI * 2 - baseRot * 0.3
          ctx.beginPath()
          ctx.moveTo(Math.cos(a1) * 220, Math.sin(a1) * 140)
          ctx.quadraticCurveTo(0, 0, Math.cos(a2) * 280, Math.sin(a2) * 170)
          ctx.stroke()
        }
      } else if (ringStyle === 'biosphere') {
        // Aurora Borealis Shimmer over the Garden
        for (let w = 0; w < 3; w++) {
          ctx.beginPath()
          const yBase = -height * 0.22 + w * 42
          ctx.moveTo(-width * 0.6, yBase)
          ctx.bezierCurveTo(
            -width * 0.2,
            yBase - 55 * Math.sin(tick * 0.008 + w),
            width * 0.2,
            yBase + 55 * Math.cos(tick * 0.008 + w),
            width * 0.6,
            yBase,
          )
          ctx.strokeStyle = `rgba(${pr}, ${pg}, ${pb}, ${0.11 - w * 0.025})`
          ctx.lineWidth = 26
          ctx.lineCap = 'round'
          ctx.stroke()
        }
      }
      ctx.restore()

      // 4. Multi-Depth Parallax Starfield with Diffraction Spikes
      const palette = realmRef.current.starPalette
      const warpStretch = motion === 'full' ? Math.min(Math.abs(scrollVelocity) * 0.3, 12) : 0

      for (const star of stars) {
        const parallaxFactor = star.z * 0.065
        const offsetX = pointerX * star.z * 12
        const offsetY = -scrollY * parallaxFactor + pointerY * star.z * 12

        const sx = (((star.x * width + offsetX) % width) + width) % width
        const sy = (((star.y * height + offsetY) % height) + height) % height

        const twinkle =
          motion === 'full'
            ? 0.65 + 0.35 * Math.sin(tick * star.twinkleSpeed + star.twinklePhase)
            : 1

        const color = palette[star.colorIdx]
        const alpha = star.alpha * twinkle
        ctx.fillStyle = color
        ctx.globalAlpha = alpha

        if (warpStretch > 1.3 && star.z >= 3) {
          ctx.beginPath()
          ctx.strokeStyle = color
          ctx.lineWidth = star.radius * 1.1
          ctx.moveTo(sx, sy - warpStretch * (star.z * 0.45))
          ctx.lineTo(sx, sy + warpStretch * (star.z * 0.45))
          ctx.stroke()
        } else {
          ctx.beginPath()
          ctx.arc(sx, sy, star.radius, 0, Math.PI * 2)
          ctx.fill()
        }

        if (star.z === 4) {
          ctx.beginPath()
          ctx.arc(sx, sy, star.radius * 3.8, 0, Math.PI * 2)
          ctx.globalAlpha = alpha * 0.16
          ctx.fill()

          if (star.hasSpikes && twinkle > 0.78) {
            drawDiffractionStar(sx, sy, star.radius, color, alpha)
          }
        }
      }

      // 5. Occasional Realistic Shooting Meteor
      if (motion === 'full') {
        if (!shootingStar.active && tick % 240 === 90) {
          shootingStar.active = true
          shootingStar.x = width * (0.55 + ((tick * 17) % 35) / 100)
          shootingStar.y = height * (0.08 + ((tick * 13) % 25) / 100)
          shootingStar.life = 0
        }
        if (shootingStar.active) {
          shootingStar.x += shootingStar.vx
          shootingStar.y += shootingStar.vy
          shootingStar.life += 1
          const progress = shootingStar.life / shootingStar.maxLife
          const meteorAlpha = Math.sin(progress * Math.PI) * 0.85

          const tailX = shootingStar.x - shootingStar.vx * 8
          const tailY = shootingStar.y - shootingStar.vy * 8
          const meteorGrad = ctx.createLinearGradient(
            shootingStar.x,
            shootingStar.y,
            tailX,
            tailY,
          )
          meteorGrad.addColorStop(0, `rgba(255, 255, 255, ${meteorAlpha})`)
          meteorGrad.addColorStop(0.4, `rgba(${pr}, ${pg}, ${pb}, ${meteorAlpha * 0.6})`)
          meteorGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')

          ctx.save()
          ctx.strokeStyle = meteorGrad
          ctx.lineWidth = 1.8
          ctx.beginPath()
          ctx.moveTo(shootingStar.x, shootingStar.y)
          ctx.lineTo(tailX, tailY)
          ctx.stroke()
          ctx.restore()

          if (shootingStar.life >= shootingStar.maxLife) {
            shootingStar.active = false
          }
        }
      }

      ctx.globalAlpha = 1
    }

    let tick = 0
    const render = () => {
      tick += 1
      const delta = targetScrollY - scrollY
      scrollVelocity = delta * 0.18
      scrollY += delta * 0.12
      drawScene(tick)
      if (motion === 'full') {
        animationFrameId = window.requestAnimationFrame(render)
      }
    }

    const onScroll = () => {
      targetScrollY = window.scrollY
      if (motion !== 'full') {
        scrollY = targetScrollY
        scrollVelocity = 0
        drawScene(0)
      }
    }

    const onPointerMove = (event: MouseEvent) => {
      if (motion !== 'full') return
      pointerX = event.clientX / width - 0.5
      pointerY = event.clientY / height - 0.5
    }

    const onResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      drawScene(tick)
    }

    drawScene(0)
    if (motion === 'full') {
      animationFrameId = window.requestAnimationFrame(render)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onPointerMove, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('resize', onResize)
    }
  }, [motion])

  return (
    <div
      className={`cosmic-backdrop cosmic-backdrop--${activeRealm.id}`}
      aria-hidden="true"
      style={
        {
          '--realm-primary': activeRealm.primaryHue,
          '--realm-secondary': activeRealm.secondaryHue,
          '--realm-glow': activeRealm.coreGlow,
        } as React.CSSProperties
      }
    >
      <canvas ref={canvasRef} className="cosmic-canvas" />
      <div className="realm-ambient-aura" />
      <div className="realm-telemetry-pill">
        <span className="realm-telemetry-dot" />
        <span className="realm-telemetry-code">{activeRealm.code}</span>
        <span className="realm-telemetry-sep">·</span>
        <span className="realm-telemetry-name">{activeRealm.name}</span>
      </div>
    </div>
  )
}
