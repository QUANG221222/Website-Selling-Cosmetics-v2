import 'dotenv/config'

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  LOCAL_APP_HOST: process.env.LOCAL_APP_HOST,
  LOCAL_APP_PORT: process.env.LOCAL_APP_PORT,
  AUTHOR_NAME: process.env.AUTHOR_NAME,
  BUILD_MODE: process.env.BUILD_MODE
}
