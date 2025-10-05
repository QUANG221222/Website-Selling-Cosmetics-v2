import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { env } from '~/configs/enviroment'
import { services } from '~/services/index'
import ApiError from '~/utils/ApiError'

declare module 'express-session' {
  interface SessionData {
    user?: {
      userId: string
      username: string
      role: string
    }
  }
}

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

interface LoginRequest {
  username: string
  password: string
}

interface LoginResponse {
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

const login = async (
  req: Request<{}, {}, LoginRequest, {}>,
  res: Response<LoginResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await services.userService.login(req)
    if (result) {
      req.session.user = {
        userId: result._id.toString(),
        username: result.username,
        role: result.role
      }
    }
    res.status(StatusCodes.OK).json({
      message: 'Login successful',
      data: result
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const logout = (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return next(
          new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err.message)
        )
      }

      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        secure: env.BUILD_MODE === 'production',
        sameSite: (env.BUILD_MODE === 'production' ? 'none' : 'lax') as
          | 'none'
          | 'lax'
      })

      res.status(StatusCodes.OK).json({
        message: 'Logout successful'
      })
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

export type {
  CreateUserRequest,
  CreateUserResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  LoginRequest,
  LoginResponse
}
export const userController = {
  createNew,
  verifyEmail,
  login,
  logout
}
