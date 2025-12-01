import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { chatModel } from '~/models/chatModel'
import ApiError from '~/utils/ApiError'

const getChatHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.session.user!
    const chatRoom = await chatModel.findChatByUserId(userId)

    if (!chatRoom) {
      res.status(StatusCodes.OK).json({
        message: 'No chat history found',
        data: null
      })
      return
    }

    res.status(StatusCodes.OK).json({
      message: 'Chat history retrieved successfully',
      data: chatRoom
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const getAllChats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const chats = await chatModel.getAllActiveChats()

    res.status(StatusCodes.OK).json({
      message: 'All chats retrieved successfully',
      data: chats
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

export const chatController = {
  getChatHistory,
  getAllChats
}
