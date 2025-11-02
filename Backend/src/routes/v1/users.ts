import express from 'express'
import { controllers } from '~/controllers/index'
import { middlewares } from '~/middlewares'
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

Router.route('/login').post(
  validations.userValidation.login,
  controllers.userController.login
)

Router.route('/logout').post(controllers.userController.logout)
// Thêm route mới
Router.route('/').post(
  validations.userValidation.createNew,
  controllers.userController.createNew
)

Router.route('/me').get(
    controllers.userController.getCurrentUser
)
Router.route('/').get(    
    controllers.userController.getAllUsers
)

Router.route('/:id').delete(
    validations.userValidation.validateUserId,
    controllers.userController.deleteUser
)
Router.route('/pagination/list').get(
    controllers.userController.getAllUsersWithPagination
)

export const userRouter = Router
