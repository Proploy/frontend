export type QueryValue = string | number | boolean | null | undefined

export function buildQueryString<T extends object>(params: T): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)))
      } else {
        searchParams.set(key, String(value))
      }
    }
  }

  return searchParams.toString()
}
