import express from 'express'
import { controllers } from '~/controllers'

const Router = express.Router()

Router.get('/total-products', controllers.dashboardController.getTotalProducts)

Router.get('/total-users', controllers.dashboardController.getTotalUsers)

Router.get('/total-orders', controllers.dashboardController.getTotalOrders)

Router.get(
  '/total-orders-by-month/:year/:month',
  controllers.dashboardController.getTotalOrdersByMonth
)

Router.get(
  '/total-orders-success',
  controllers.dashboardController.getTotalOrdersSuccess
)

Router.get(
  '/total-orders-pending',
  controllers.dashboardController.getTotalOrdersPending
)

Router.get(
  '/total-orders-cancelled',
  controllers.dashboardController.getTotalOrdersCancelled
)

Router.get(
  '/total-orders-processing',
  controllers.dashboardController.getTotalOrdersProcessing
)

Router.get('/revenue/:year', controllers.dashboardController.getRevenueByYear)

Router.get(
  '/revenue/:year/:month',
  controllers.dashboardController.getRevenueByMonth
)

export const dashboardRouter = Router
