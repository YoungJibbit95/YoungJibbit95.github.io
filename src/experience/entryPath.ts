import type { AvailableWorldId } from './worldTypes'

/** Keep native links on the static experience entry without changing old root URLs. */
export function experienceEntryPath(
  pathname = typeof window === 'undefined' ? '/' : window.location.pathname,
  world: AvailableWorldId = 'origin',
): '/' | '/atlas/' | '/atlas/observatory/' {
  if (pathname !== '/atlas' && !pathname.startsWith('/atlas/')) return '/'
  return world === 'observatory' ? '/atlas/observatory/' : '/atlas/'
}

export function experienceEntryWorld(pathname: string): AvailableWorldId {
  return pathname.startsWith('/atlas/observatory') ? 'observatory' : 'origin'
}
