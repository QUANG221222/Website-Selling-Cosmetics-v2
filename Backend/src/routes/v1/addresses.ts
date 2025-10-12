import express from 'express'
import { middlewares } from '~/middlewares'
import { validations } from '~/validations'
import { controllers } from '~/controllers'

const Router = express.Router()

Router.route('/')
  .post(
    middlewares.authHandlingMiddleware.isAuthorized,
    validations.addressValidation.createAddress,
    controllers.addressController.createNew
  )
  .get(
    middlewares.authHandlingMiddleware.isAuthorized,
    controllers.addressController.getAddresses
  )

Router.route('/default').get(
  middlewares.authHandlingMiddleware.isAuthorized,
  controllers.addressController.getDefaultAddress
)

Router.route('/:index')
  .get(
    middlewares.authHandlingMiddleware.isAuthorized,
    validations.addressValidation.validateAddressIndex,
    controllers.addressController.getAddressById
  )
  .put(
    middlewares.authHandlingMiddleware.isAuthorized,
    validations.addressValidation.updateAddress,
    controllers.addressController.updateAddress
  )
  .delete(
    middlewares.authHandlingMiddleware.isAuthorized,
    validations.addressValidation.validateAddressIndex,
    controllers.addressController.deleteAddress
  )

Router.route('/:index/default').put(
  middlewares.authHandlingMiddleware.isAuthorized,
  validations.addressValidation.validateAddressIndex,
  controllers.addressController.setDefaultAddress
)

export const addressRouter = Router
