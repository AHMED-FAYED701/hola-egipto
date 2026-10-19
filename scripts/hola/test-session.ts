/**
 * `pnpm -s hola:test-session create | delete` (contracts §9): a temporary admin `acceptance-<random>@hola.test`
 * with a random password, printed as {"token":"<hola_session JWT>","id":n}; `delete` removes every @hola.test user.
 */
import { randomBytes } from 'node:crypto'

import { createUser, deleteTestUsers, getUser } from '../../src/lib/content/users'
import { signSession } from '../../src/lib/session'
import { args, log, main, out } from './_cli'

const [cmd] = args()
await main(async () => {
  if (cmd === 'create') {
    const id = await createUser(`acceptance-${randomBytes(6).toString('hex')}@hola.test`, randomBytes(24).toString('base64url'), 'admin')
    const user = await getUser(id)
    out({ token: await signSession(id, user?.session_version ?? 1), id })
  } else if (cmd === 'delete') {
    out({ deleted: await deleteTestUsers() })
  } else {
    log('usage: hola:test-session create | delete')
    throw Object.assign(new Error('usage'), { code: 'USAGE' })
  }
})
