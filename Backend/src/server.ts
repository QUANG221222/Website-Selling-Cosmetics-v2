import express from 'express'
import http from 'http'
import session from 'express-session'
import { sessionConfig } from './configs/session'
import { middlewares } from '~/middlewares'
import { env } from '~/configs/enviroment'
import { CONNECT_DB } from '~/configs/mongodb'
import { APIs_V1 } from '~/routes/v1/index'
import cors from 'cors'
import { corsOptions } from '~/configs/cors'
import { limiter } from './configs/limiter'
import { initializeSocket } from '~/sockets'

const StartServer = () => {
  const app = express()
  const server = http.createServer(app)

  // Initialize Socket.IO
  initializeSocket(server)

  if (env.BUILD_MODE === 'production') {
    app.set('trust proxy', 1) // trust first proxy
  }

  // Config CORS
  app.use(cors(corsOptions))

  // Enable req.body json data
  app.use(express.json())

  // Config Rate Limiter
  app.use(limiter)

  // Enable session
  app.use(session(sessionConfig))

  // Import All Routes
  app.use('/v1', APIs_V1)

  // Error Handling Middlewares
  app.use(middlewares.errorHandlingMiddleware)

  if (env.BUILD_MODE === 'dev') {
    server.listen(
      Number(env.LOCAL_APP_PORT),
      String(env.LOCAL_APP_HOST),
      () => {
        console.log(
          `LOCAL DEV: Hello ${env.AUTHOR_NAME}, Server is running at http://${env.LOCAL_APP_HOST}:${env.LOCAL_APP_PORT}`
        )
      }
    )
  } else {
    server.listen(Number(process.env.PORT), () => {
      console.log(
        `PRODUCTION: Hello ${env.AUTHOR_NAME}, Backend Server is running successfully at Port: ${process.env.PORT}`
      )
    })
  }
}

// IIFE to start the server
;(async () => {
  try {
    console.log('1. Connecting to MongoDB...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB successfully!')

    // Start the server
    StartServer()
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(0) // Exit the process with failure
  }
})()
