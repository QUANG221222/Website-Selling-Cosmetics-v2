import express from 'express'
import { middlewares } from '~/middlewares'
import { validations } from '~/validations'
import { controllers } from '~/controllers'
import { upload } from '~/configs/cloudinary'

const Router = express.Router()

Router.route('/').post(
  middlewares.authHandlingMiddleware.isAdmin,
  upload.single('image'),
  validations.cosmeticValidation.createNew,
  controllers.cosmeticController.createNew
)

Router.route('/').get(controllers.cosmeticController.getAll)

Router.route('/id/:id')
  .get(controllers.cosmeticController.getById)
  .delete(
    middlewares.authHandlingMiddleware.isAdmin,
    validations.cosmeticValidation.deleteItem,
    controllers.cosmeticController.deleteItem
  )

Router.route('/slug/:slug').get(controllers.cosmeticController.getBySlug)

Router.route('/single').post(
  upload.single('image'),
  controllers.cosmeticController.uploadSingleImage
)

Router.route('/multiple').post(
  upload.array('images', 5),
  controllers.cosmeticController.uploadMultipleImages
)

export const cosmeticRouter = Router
