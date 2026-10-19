#!/usr/bin/env node
/**
 * Runner for `pnpm migrate` and `pnpm hola:<name>` (contracts §9):
 *   node --env-file=<env file> --import tsx scripts/hola/<name>.ts …args
 * The env file is .env.local, or .env.hostinger.local with --env=hostinger. Arguments pass through unchanged.
 */
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const [name, ...rest] = process.argv.slice(2)
if (!name || !/^[a-z-]+$/.test(name)) {
  process.stderr.write('usage: run.mjs <script> [args…] [--env=hostinger]\n')
  process.exit(2)
}
const envArg = rest.find((a) => a.startsWith('--env='))
const env = envArg ? envArg.slice('--env='.length) : 'local'
if (env !== 'local' && env !== 'hostinger') {
  process.stderr.write(`unknown --env=${env} (use local or hostinger)\n`)
  process.exit(2)
}
const envFile = path.join(root, env === 'hostinger' ? '.env.hostinger.local' : '.env.local')
if (!existsSync(envFile)) {
  process.stderr.write(`${path.basename(envFile)} not found\n`)
  process.exit(2)
}
const script = path.join(root, 'scripts/hola', `${name}.ts`)
if (!existsSync(script)) {
  process.stderr.write(`scripts/hola/${name}.ts not found\n`)
  process.exit(2)
}
const args = rest.filter((a) => a !== envArg && a !== '--')
const res = spawnSync(process.execPath, [`--env-file=${envFile}`, '--import', 'tsx', script, ...args], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, HOLA_ENV: env },
})
process.exit(res.status ?? 1)
