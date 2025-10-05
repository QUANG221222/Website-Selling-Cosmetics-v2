import { env } from './enviroment'
import { redisClient } from './redis'
import session from 'express-session'
// Need add v5.x.x version of connect-redis to run session store
const RedisStore = require('connect-redis')(session)

//Config session
export const sessionConfig = {
  store: new RedisStore({ client: redisClient }),
  secret: env.SECRET_SESSION_KEY as string, // secret key to sign the session ID cookie
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't save new session even if not set data
  cookie: {
    maxAge: 1000 * 60 * 30, // 30 minutes
    httpOnly: true, // security: only server can access cookie
    secure: env.BUILD_MODE === 'production', // true: only send cookie over HTTPS
    sameSite: (env.BUILD_MODE === 'production' ? 'none' : 'lax') as
      | 'none'
      | 'lax' // CSRF protection
  }
}
