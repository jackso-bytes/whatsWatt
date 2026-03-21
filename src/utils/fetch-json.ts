export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, options)
  } catch {
    throw new Error('Network error')
  }
  if (!response.ok) throw new Error(String(response.status))
  return response.json() as Promise<T>
}
