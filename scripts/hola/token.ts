/** `pnpm -s hola:token`: one valid inquiry token whose timestamp is 10 s in the past (contracts §9). */
import { makeInquiryToken } from '../../src/lib/secrets'
import { out } from './_cli'

out(makeInquiryToken(Math.floor(Date.now() / 1000) - 10))
