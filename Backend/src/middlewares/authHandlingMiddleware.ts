import { NextFunction, Request, Response } from 'express'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const isAuthorized = (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (!req.session.user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized access')
    }
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized access'))
  }
}

const isAdmin = (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (!req.session.admin) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Please login to access this resource'
      )
    }
    next()
  } catch (error) {
    next(error)
  }
}

export const authHandlingMiddleware = { isAuthorized, isAdmin }
