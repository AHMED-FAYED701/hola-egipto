/** Absolute base URL without trailing slash, read at request time from SITE_URL (contracts §2, §19). */
export const siteUrl = () => (process.env.SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')
