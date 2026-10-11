/** Keep native links on the static experience entry without changing old root URLs. */
export function experienceEntryPath(
  pathname = typeof window === 'undefined' ? '/' : window.location.pathname,
): '/' | '/atlas/' {
  return pathname === '/atlas' || pathname.startsWith('/atlas/') ? '/atlas/' : '/'
}
