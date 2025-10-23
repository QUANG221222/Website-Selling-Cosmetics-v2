import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { services } from '~/services/index'
import ApiError from '~/utils/ApiError'
import { env } from '~/configs/enviroment'

declare module 'express-session' {
  interface SessionData {
    admin?: {
      adminId: string
      adminName: string
      role: string
    }
  }
}
// ===== INTERFACES & TYPES =====
interface CreateAdminRequest {
  secretKey: string
  adminName: string
  email: string
  password: string
}

interface CreateAdminResponse {
  message: string
  data: any
}

interface VerifyAdminRequest {
  email: string
  token: string
}
interface VerifyAdminResponse {
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

const createNew = async (
  req: Request<{}, {}, CreateAdminRequest, {}>,
  res: Response<CreateAdminResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const newAdmin = await services.adminService.createNew(req)
    res.status(StatusCodes.CREATED).json({
      message: 'Tài khoản admin đã được tạo thành công',
      data: newAdmin
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const verifyEmail = async (
  req: Request<{}, {}, VerifyAdminRequest, {}>,
  res: Response<VerifyAdminResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, token } = req.body
    const verifiedAdmin = await services.adminService.verifyEmail(email, token)
    res.status(StatusCodes.OK).json({
      message: 'Admin đã được xác thực thành công',
      data: verifiedAdmin
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
    const result = await services.adminService.login(req)
    if (result) {
      req.session.admin = {
        adminId: result._id.toString(),
        adminName: result.adminName,
        role: result.role
      }
    }
    res.status(StatusCodes.OK).json({
      message: 'Đăng nhập thành công',
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
        message: 'Đăng xuất thành công'
      })
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

// ===== EXPORTS =====

export type {
  CreateAdminRequest,
  CreateAdminResponse,
  VerifyAdminRequest,
  VerifyAdminResponse,
  LoginRequest,
  LoginResponse
}

export const adminController = {
  createNew,
  verifyEmail,
  login,
  logout
}
