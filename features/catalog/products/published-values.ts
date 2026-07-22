const UNPUBLISHED_VALUE = /^(?:not[\s_-]*published|unpublished)$/i

export function isUnpublishedValue(value: string | null | undefined): boolean {
  return Boolean(value && UNPUBLISHED_VALUE.test(value.trim()))
}

export function normalizePublishedValue(value: string | null | undefined): string | null {
  if (!value) return null
  const normalized = value.trim()
  return normalized && !isUnpublishedValue(normalized) ? normalized : null
}

export function normalizePublishedList(values: string[] | null | undefined): string[] {
  return (values ?? [])
    .map((value) => normalizePublishedValue(value))
    .filter((value): value is string => value !== null)
}
