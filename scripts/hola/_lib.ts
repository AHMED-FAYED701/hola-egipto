/** Shared helpers for the `pnpm hola:*` scripts (run with `payload run … --`). */
import type { Field } from 'payload'

/** Arguments after the script path; `payload run` passes them through after `--`. */
export function args(): string[] {
  const argv = process.argv.slice(2).map(String)
  const i = argv.findIndex((a) => /scripts\/hola\/[^/]+\.ts$/.test(a))
  const rest = i >= 0 ? argv.slice(i + 1) : argv
  return rest.filter((a) => a !== '--')
}

/** Print one line of JSON to stdout (the only stdout output of a script). */
export function out(value: unknown): void {
  process.stdout.write((typeof value === 'string' ? value : JSON.stringify(value)) + '\n')
}

export function log(...parts: unknown[]): void {
  process.stderr.write(parts.map(String).join(' ') + '\n')
}

/** Top-level data field names; group/array children as `parent.child`; tabs/rows/collapsibles flattened. */
export function fieldNames(fields: Field[], prefix = ''): string[] {
  const names: string[] = []
  for (const f of fields) {
    if (f.type === 'tabs') {
      for (const tab of f.tabs) {
        if ('name' in tab && tab.name) {
          names.push(prefix + tab.name, ...fieldNames(tab.fields, prefix + tab.name + '.'))
        } else names.push(...fieldNames(tab.fields, prefix))
      }
      continue
    }
    if (f.type === 'row' || f.type === 'collapsible') {
      names.push(...fieldNames(f.fields, prefix))
      continue
    }
    if (!('name' in f) || !f.name) continue
    names.push(prefix + f.name)
    if (!prefix && (f.type === 'group' || f.type === 'array')) {
      names.push(...fieldNames(f.fields, f.name + '.'))
    }
  }
  return names
}

/** Ask the running server to revalidate everything (contracts §9, §16); silent when it is down. */
export async function revalidateSite(): Promise<void> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')
  try {
    const ctrl = AbortSignal.timeout(5000)
    await fetch(base + '/api/hola/revalidate', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-hola-revalidate': process.env.HOLA_PREVIEW_KEY || '' },
      body: JSON.stringify({ all: true }),
      signal: ctrl,
    })
  } catch {
    // server not running: nothing to revalidate
  }
}

/** End the process (payload run keeps the DB pool open). */
export function done(code = 0): never {
  process.exit(code)
}
