import * as base from './base.js'
import * as db from './db.js'
import * as email from './email.js'
import * as googleSignIn from './googleSignIn.js'

export default Object.assign({}, base, db, email, googleSignIn)
