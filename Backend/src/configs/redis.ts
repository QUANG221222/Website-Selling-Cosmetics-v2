import { env } from './enviroment'
import { Redis } from 'ioredis'

export const redisClient = new Redis(env.REDIS_URL as string)
