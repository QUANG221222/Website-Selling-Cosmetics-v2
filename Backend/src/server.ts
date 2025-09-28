import express from 'express'
import { errorHandlingMiddlewares } from './middlewares/errorHandlingMiddlewares'
import { env } from './configs/enviroment'
import { CONNECT_DB } from './configs/mongodb'

const StartServer = () => {
  const app = express()

  // Enable req.body json data
  app.use(express.json())

  // Error Handling Middlewares
  app.use(errorHandlingMiddlewares)

  if (env.BUILD_MODE === 'dev') {
    app.listen(Number(env.LOCAL_APP_PORT), String(env.LOCAL_APP_HOST), () => {
      console.log(
        `LOCAL DEV: Hello ${env.AUTHOR_NAME}, Server is running at http://${env.LOCAL_APP_HOST}:${env.LOCAL_APP_PORT}`
      )
    })
  } else {
    app.listen(Number(process.env.PORT), () => {
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
