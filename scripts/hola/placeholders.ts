/** `pnpm hola:placeholders [--force]`: generate the placeholder WebP files (content rules §4). No database. */
import fs from 'node:fs/promises'
import path from 'node:path'

import { args, log, main, out } from './_cli'
import { fileNameFor, renderPlaceholder, SAMPLES_DIR } from './_placeholders'
import { PLACEHOLDERS } from './data/media'

await main(async () => {
  const force = args().includes('--force')
  await fs.mkdir(SAMPLES_DIR, { recursive: true })
  let created = 0
  for (const ph of PLACEHOLDERS) {
    const file = path.join(SAMPLES_DIR, fileNameFor(ph.key))
    const exists = await fs.stat(file).then(
      () => true,
      () => false,
    )
    if (exists && !force) continue
    await fs.writeFile(file, await renderPlaceholder(ph))
    created++
    log(`placeholder ${fileNameFor(ph.key)}`)
  }
  let bytes = 0
  for (const f of await fs.readdir(SAMPLES_DIR)) bytes += (await fs.stat(path.join(SAMPLES_DIR, f))).size
  out({ placeholders: PLACEHOLDERS.length, created, mb: Math.round((bytes / 1048576) * 10) / 10 })
})
