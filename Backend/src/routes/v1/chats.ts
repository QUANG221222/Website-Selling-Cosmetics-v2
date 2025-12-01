import express from 'express'
import { middlewares } from '~/middlewares'
import { controllers } from '~/controllers'

const Router = express.Router()

// Get user's chat history
Router.route('/my-chat').get(
  middlewares.authHandlingMiddleware.isAuthorized,
  controllers.chatController.getChatHistory
)

// Admin: Get all chats
Router.route('/admin/all').get(
  middlewares.authHandlingMiddleware.isAdmin,
  controllers.chatController.getAllChats
)

export const chatRouter = Router
