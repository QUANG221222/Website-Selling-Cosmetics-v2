import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { services } from '~/services/index'
import ApiError from '~/utils/ApiError'

// ===== INTERFACES & TYPES =====
interface CreateUserRequest {
  username: string
  email: string
  password: string
}
interface CreateUserResponse {
  message: string
  data: any
}

interface VerifyEmailRequest {
  email: string
  token: string
}

interface VerifyEmailResponse {
  message: string
  data: any
}

// ===== CONTROLLERS =====

const createNew = async (
  req: Request<{}, {}, CreateUserRequest, {}>,
  res: Response<CreateUserResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const createUser = await services.userService.createNew(req)
    res.status(StatusCodes.CREATED).json({
      message: 'User created successfully',
      data: createUser
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const verifyEmail = async (
  req: Request<{}, {}, VerifyEmailRequest, {}>,
  res: Response<VerifyEmailResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await services.userService.verifyEmail(req)
    res.status(StatusCodes.OK).json({
      message: 'Email verified successfully',
      data: result
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

export type { CreateUserRequest, CreateUserResponse }
export const userController = {
  createNew,
  verifyEmail
}
