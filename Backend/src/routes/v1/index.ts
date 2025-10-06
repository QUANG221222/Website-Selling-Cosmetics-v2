import express from 'express'
import { userRouter } from './users'
import { adminRouter } from './admin'

const Router = express.Router()

Router.use('/users', userRouter)

Router.use('/admin', adminRouter)

export const APIs_V1 = Router
