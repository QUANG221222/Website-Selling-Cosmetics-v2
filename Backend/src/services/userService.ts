import { pickUser } from '~/utils/fomatter'
import { Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { models, ICreateUserData } from '~/models'
import ApiError from '~/utils/ApiError'
import bcrypt from 'bcryptjs'
import { v7 as uuidv7 } from 'uuid'
import { BrevoProvider } from '~/providers/BrevoProvider'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { calculatePagination, PaginatedResponse } from '~/utils/pagination'

// ===== INTERFACES =====
interface IUserResponse {
  _id: string
  email: string
  username: string
  fullName: string
  role: string
  isActive: boolean
  phone?: string
  gender?: string
  dob?: Date
  avatar?: string
  createdAt: Date
}

const createNew = async (req: Request): Promise<IUserResponse> => {
  try {
    const existUser: any = await models.userModel.findOneByEmail(
      req.body.email as string
    )
    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email đã tồn tại!')
    }

    const nameFromEmail: string = (req.body.email as string).split('@')[0]

    const newUser: ICreateUserData = {
      email: req.body.email,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      fullName: nameFromEmail,
      verifyToken: uuidv7(),
      role: 'customer'
    }
    const createdUser = await models.userModel.createNew(newUser)
    const getNewUser = await models.userModel.findOneById(
      createdUser.insertedId.toString()
    )
    if (!getNewUser) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Không thể lấy thông tin người dùng mới tạo.'
      )
    }
    // Send a welcome email to the new user
    const verificationLink = `${WEBSITE_DOMAIN}/users/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const customSubject =
      'Beautify: Vui lòng xác thực email trước khi sử dụng dịch vụ của chúng tôi!'
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px 0;">
      <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 32px;">
        <h2 style="color: #2d8cf0; margin-bottom: 16px;">Xác thực Email của bạn</h2>
        <p style="font-size: 16px; color: #333;">Cảm ơn bạn đã đăng ký tài khoản <b>Beautify</b>!</p>
        <p style="font-size: 15px; color: #444;">Vui lòng nhấp vào nút bên dưới để xác thực địa chỉ email của bạn:</p>
        <a href="${verificationLink}" style="display: flex;
        justify-content: center; align-items: center; margin: 24px 0; padding: 12px 28px; background: #2d8cf0; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">Xác thực Email</a>
        <p style="font-size: 13px; color: #888;">Nếu nút không hoạt động, hãy sao chép và dán liên kết này vào trình duyệt của bạn:</p>
        <div style="word-break: break-all; background: #f4f4f4; padding: 8px 12px; border-radius: 4px; font-size: 13px; color: #2d8cf0;">${verificationLink}</div>
        <hr style="margin: 32px 0 16px 0; border: none; border-top: 1px solid #eee;">
        <div style="font-size: 13px; color: #888;">
        Trân trọng,<br/>
        <b>Beautify Team</b>
        </div>
      </div>
      </div>
    `
    await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent)

    return pickUser(getNewUser)
  } catch (error) {
    throw error
  }
}

const verifyEmail = async (req: Request): Promise<IUserResponse> => {
  try {
    const user = await models.userModel.findOneByEmail(req.body.email as string)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy người dùng')
    }
    if (user.isActive) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'Người dùng đã được xác thực'
      )
    }
    if (user.verifyToken !== req.body.token) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Token không hợp lệ')
    }
    const updateUser = {
      isActive: true,
      verifyToken: ''
    }
    if (!user._id) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'ID người dùng bị thiếu'
      )
    }
    const result = await models.userModel.update(
      user._id.toString(),
      updateUser
    )

    return pickUser(result)
  } catch (error) {
    throw error
  }
}

const login = async (req: Request): Promise<IUserResponse> => {
  try {
    const user = await models.userModel.findOneByEmail(req.body.email as string)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy người dùng')
    }
    if (!user.isActive) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Người dùng chưa được xác thực')
    }
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password as string
    )
    if (!passwordIsValid) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'Email hoặc mật khẩu của bạn không đúng!'
      )
    }
    return pickUser(user)
  } catch (error) {
    throw error
  }
}

const deleteUser = async (userId: string): Promise<void> => {
  try {
    const user = await models.userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy người dùng')
    }
    await models.userModel.deleteUser(userId)
  } catch (error) {
    throw error
  }
}

const getById = async (userId: string): Promise<IUserResponse | null> => {
  try {
    const user = await models.userModel.findOneById(userId)
    if (!user) return null
    return pickUser(user)
  } catch (error) {
    throw error
  }
}

const getAllUsers = async (): Promise<IUserResponse[]> => {
  try {
    const users = await models.userModel.findAll()
    return users.map((user) => pickUser(user))
  } catch (error) {
    throw error
  }
}

const getAllUsersWithPagination = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<IUserResponse>> => {
  try {
    const { users, total } = await models.userModel.findAllWithPagination(
      page,
      limit
    )

    const paginationInfo = calculatePagination(total, page, limit)

    return {
      data: users.map((user) => pickUser(user)),
      pagination: {
        currentPage: paginationInfo.currentPage,
        totalPages: paginationInfo.totalPages,
        totalItems: paginationInfo.totalItems,
        itemsPerPage: limit,
        hasNextPage: paginationInfo.hasNextPage,
        hasPrevPage: paginationInfo.hasPrevPage
      }
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

// ===== EXPORTS =====
export type { IUserResponse }

export const userService = {
  createNew,
  verifyEmail,
  login,
  getById,
  getAllUsers,
  deleteUser,
  getAllUsersWithPagination
}
