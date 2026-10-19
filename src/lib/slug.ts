/** Lowercase, hyphens, no accents ("ñ" → "n"). Used for slugs and heading anchors. */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
