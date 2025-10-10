import express from 'express'
import { userRouter } from './users'
import { adminRouter } from './admin'
import { cosmeticRouter } from './cosmetics'
import { cartRouter } from './carts'

const Router = express.Router()

Router.use('/users', userRouter)

Router.use('/admin', adminRouter)

Router.use('/cosmetics', cosmeticRouter)

Router.use('/carts', cartRouter)

export const APIs_V1 = Router
