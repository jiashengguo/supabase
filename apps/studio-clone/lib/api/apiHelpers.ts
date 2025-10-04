/**
 * Simple header construction utility
 */
export function constructHeaders(headersInit?: HeadersInit): HeadersInit {
  const headers: Record<string, string> = {}

  // Add any default headers if needed
  if (headersInit) {
    if (headersInit instanceof Headers) {
      headersInit.forEach((value, key) => {
        headers[key] = value
      })
    } else if (Array.isArray(headersInit)) {
      headersInit.forEach(([key, value]) => {
        headers[key] = value
      })
    } else {
      Object.assign(headers, headersInit)
    }
  }

  return headers
}
