export type QueryValue = string | number | boolean | null | undefined

export function buildQueryString<T extends object>(params: T): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value))
    }
  }

  return searchParams.toString()
}
