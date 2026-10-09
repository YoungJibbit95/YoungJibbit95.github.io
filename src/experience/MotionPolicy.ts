import type { MotionMode } from './worldTypes'

export function effectiveMotion(systemReduced: boolean, forceReduced: boolean): MotionMode {
  return systemReduced || forceReduced ? 'reduced' : 'full'
}

/** Only called from a client effect, never during prerender. */
export function webGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2')
    return context !== null
  } catch {
    return false
  }
}
