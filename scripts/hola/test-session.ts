import { randomBytes } from 'node:crypto'

import config from '@payload-config'
import { getPayload } from 'payload'

import { args, done, log, out } from './_lib'

const [cmd] = args()
const payload = await getPayload({ config })

if (cmd === 'create') {
  const email = `acceptance-${randomBytes(6).toString('hex')}@hola.test`
  const password = randomBytes(24).toString('hex')
  const user = await payload.create({
    collection: 'users',
    data: { email, password, role: 'admin' },
    overrideAccess: true,
  })
  const res = await payload.login({ collection: 'users', data: { email, password }, overrideAccess: true })
  out({ token: res.token, id: user.id })
  done()
} else if (cmd === 'delete') {
  const res = await payload.delete({
    collection: 'users',
    where: { email: { like: '@hola.test' } },
    overrideAccess: true,
  })
  const deleted = res.docs.filter((d) => String(d.email).endsWith('@hola.test')).length
  out({ deleted })
  done()
} else {
  log('usage: hola:test-session create|delete')
  done(2)
}
