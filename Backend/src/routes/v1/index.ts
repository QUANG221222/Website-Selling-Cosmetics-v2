import express from 'express'
import { userRouter } from './users'
import { adminRouter } from './admin'
import { cosmeticRouter } from './cosmetics'
import { cartRouter } from './carts'
import { addressRouter } from './addresses'
import { orderRouter } from './orders'
import { dashboardRouter } from './dashboard'

const Router = express.Router()

Router.use('/users', userRouter)

Router.use('/admin', adminRouter)

Router.use('/cosmetics', cosmeticRouter)

Router.use('/carts', cartRouter)

Router.use('/addresses', addressRouter)

Router.use('/orders', orderRouter)

Router.use('/dashboard', dashboardRouter)

export const APIs_V1 = Router
