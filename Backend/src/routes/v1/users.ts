import express from 'express'
import { controllers } from '~/controllers/index'
import { validations } from '~/validations/index'

const Router = express.Router()

Router.route('/register').post(
  validations.userValidation.createNew,
  controllers.userController.createNew
)

Router.route('/verify').post(
  validations.userValidation.verifyEmail,
  controllers.userController.verifyEmail
)

export const userRouter = Router
