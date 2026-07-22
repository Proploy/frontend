export function buildCompareUrl(productIds: string[]): string {
  return `/compare?products=${encodeURIComponent(productIds.join(','))}`
}
