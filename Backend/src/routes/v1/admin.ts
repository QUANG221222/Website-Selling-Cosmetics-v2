import express from 'express'
import { validations } from '~/validations'
import { controllers } from '~/controllers'

const Router = express.Router()

Router.route('/register').post(
  validations.adminValidation.createNew,
  controllers.adminController.createNew
)

Router.route('/verify').post(
  validations.adminValidation.verifyEmail,
  controllers.adminController.verifyEmail
)

Router.route('/login').post(
  validations.adminValidation.login,
  controllers.adminController.login
)

Router.route('/logout').post(controllers.adminController.logout)

export const adminRouter = Router
