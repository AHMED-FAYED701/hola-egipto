import { makeInquiryToken } from '../../src/lib/secrets'
import { done, out } from './_lib'

// A valid inquiry token whose timestamp is 10 s in the past (contracts §9).
out(makeInquiryToken(Math.floor(Date.now() / 1000) - 10))
done()
