import type { MouseEvent } from 'react'
import type { ObservatoryFilters, ProjectId } from '../contracts'
import { encodeFilters } from '../state/filters'
import { experienceEntryPath } from '../../entryPath'
import { preserveCosmicPreview } from '../../cosmicPreview'

/** Native links work before hydration, in a new tab, and with the middle mouse button. */
export function projectHref(id: ProjectId, filters: ObservatoryFilters, pathname?: string): string {
  const query = new URLSearchParams({ atlas: 'preview', world: 'observatory', focus: id })
  preserveCosmicPreview(query)
  for (const token of encodeFilters(filters)) {
    for (const [key, value] of new URLSearchParams(token)) query.set(key, value)
  }
  return experienceEntryPath(pathname, 'observatory') + '?' + query.toString()
}

export function followNormally(event: MouseEvent<HTMLAnchorElement>, navigate: () => void) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return
  event.preventDefault()
  navigate()
}
