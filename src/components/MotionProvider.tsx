import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type MotionMode = 'auto' | 'full' | 'reduced' | 'off'
type EffectiveMotion = 'full' | 'reduced' | 'off'
const modes: MotionMode[] = ['auto', 'full', 'reduced', 'off']
const MotionContext = createContext({
  mode: 'auto' as MotionMode,
  motion: 'off' as EffectiveMotion,
  setMode: (_mode: MotionMode) => {},
})

export function MotionProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<MotionMode>('auto')
  const [systemReduced, setSystemReduced] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setSystemReduced(query.matches)
    try {
      const saved = localStorage.getItem('yj-motion') as MotionMode | null
      if (saved && modes.includes(saved)) setMode(saved)
    } catch {
      /* A blocked storage API does not affect navigation or motion controls. */
    }
    setReady(true)
    const update = () => setSystemReduced(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const motion: EffectiveMotion = !ready
    ? 'off'
    : mode === 'auto'
      ? systemReduced
        ? 'reduced'
        : 'full'
      : mode
  const chooseMode = (next: MotionMode) => {
    setMode(next)
    try {
      localStorage.setItem('yj-motion', next)
    } catch {
      /* Selection still works without storage. */
    }
  }

  return (
    <MotionContext.Provider value={{ mode, motion, setMode: chooseMode }}>
      <div className="portfolio" data-motion={motion}>
        {children}
      </div>
    </MotionContext.Provider>
  )
}

export const useMotion = () => useContext(MotionContext)
