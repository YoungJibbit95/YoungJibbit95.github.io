/** A bounded art-review variant; world IDs, camera snapshots and history stay unchanged. */
export function cosmicPreviewEnabled(search?: string): boolean {
  const query = search ?? (typeof window === 'undefined' ? '' : window.location.search)
  return new URLSearchParams(query).get('cosmos') === 'preview'
}

export function preserveCosmicPreview(query: URLSearchParams, search?: string): void {
  if (cosmicPreviewEnabled(search)) query.set('cosmos', 'preview')
}
