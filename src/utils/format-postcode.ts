const POSTCODE_RE = /^([A-Z]{1,2}\d[A-Z\d]?) ?(\d[A-Z]{2})$/
const INWARD_LENGTH = 3

function addSpace(s: string): string {
  if (s.includes(' ')) return s
  if (s.length >= INWARD_LENGTH + 2) {
    return `${s.slice(0, -INWARD_LENGTH)} ${s.slice(-INWARD_LENGTH)}`
  }
  return s
}

export function formatPostcode(raw: string): string | undefined {
  const normalised = raw.trim().toUpperCase().replaceAll(/\s+/gu, ' ')
  const spaced = addSpace(normalised)
  const match = POSTCODE_RE.exec(spaced)
  if (!match) return undefined
  return `${match[1]} ${match[2]}`
}
