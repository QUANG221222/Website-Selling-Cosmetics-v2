import express from 'express'
import { middlewares } from '~/middlewares'
import { validations } from '~/validations'
import { controllers } from '~/controllers'

const Router = express.Router()

// // Create new cart
// Router.route('/').post(
//   middlewares.authHandlingMiddleware.isAuthorized,
//   controllers.cartController.createNew
// )

// Get user's cart
Router.route('/')
  .get(
    middlewares.authHandlingMiddleware.isAuthorized,
    controllers.cartController.getCart
  )
  .post(
    middlewares.authHandlingMiddleware.isAuthorized,
    validations.cartValidation.addToCart,
    controllers.cartController.addToCart
  )
  .put(
    middlewares.authHandlingMiddleware.isAuthorized,
    validations.cartValidation.updateQuantity,
    controllers.cartController.updateQuantity
  )

// Remove item from cart
Router.route('/:cosmeticId').delete(
  middlewares.authHandlingMiddleware.isAuthorized,
  validations.cartValidation.removeFromCart,
  controllers.cartController.removeFromCart
)

// Clear cart
Router.route('/clear').delete(
  middlewares.authHandlingMiddleware.isAuthorized,
  controllers.cartController.clearCart
)

export const cartRouter = Router
