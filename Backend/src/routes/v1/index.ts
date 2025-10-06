import express from 'express'
import { userRouter } from './users'
import { adminRouter } from './admin'
import { cosmeticRouter } from './cosmetics'

const Router = express.Router()

Router.use('/users', userRouter)

Router.use('/admin', adminRouter)

Router.use('/cosmetics', cosmeticRouter)

export const APIs_V1 = Router
