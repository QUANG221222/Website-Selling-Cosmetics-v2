import express from 'express'
import { middlewares } from '~/middlewares'
import { validations } from '~/validations'
import { controllers } from '~/controllers'

const Router = express.Router()

// Create new order
Router.route('/')
  .post(
    middlewares.authHandlingMiddleware.isAuthorized,
    validations.orderValidation.createOrder,
    controllers.orderController.createNew
  )
  .get(
    middlewares.authHandlingMiddleware.isAuthorized,
    controllers.orderController.getUserOrders
  )

// Admin routes - get all orders
Router.route('/admin').get(
  middlewares.authHandlingMiddleware.isAdmin,
  controllers.orderController.getAllOrders
)

// Order by ID
Router.route('/:id')
  .get(
    middlewares.authHandlingMiddleware.isAuthorized,
    validations.orderValidation.validateOrderId,
    controllers.orderController.getOrderById
  )
  .put(
    middlewares.authHandlingMiddleware.isAdmin,
    validations.orderValidation.updateOrder,
    controllers.orderController.updateOrder
  )
  .delete(
    middlewares.authHandlingMiddleware.isAdmin,
    validations.orderValidation.validateOrderId,
    controllers.orderController.deleteOrder
  )

Router.route('/user/:id').delete(
  middlewares.authHandlingMiddleware.isAuthorized,
  validations.orderValidation.validateOrderId,
  controllers.orderController.deleteOrderWhenOrderIsProcessing
)

export const orderRouter = Router
