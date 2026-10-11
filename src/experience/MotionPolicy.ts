import type { MotionMode } from './worldTypes'

export function effectiveMotion(systemReduced: boolean, forceReduced: boolean): MotionMode {
  return systemReduced || forceReduced ? 'reduced' : 'full'
}

/** Only called from a client effect, never during prerender. */
export function webGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2')
    if (!context) return false
    // A capability probe must not retain an extra GPU context for the page.
    context.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}
