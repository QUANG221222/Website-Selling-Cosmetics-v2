import { pickUser } from '~/utils/fomatter'
import { Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { models, ICreateAdminData } from '~/models'
import ApiError from '~/utils/ApiError'
import bcrypt from 'bcryptjs'
import { v7 as uuidv7 } from 'uuid'
import { BrevoProvider } from '~/providers/BrevoProvider'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { env } from '~/configs/enviroment'

// ===== INTERFACES =====

interface IAdminResponse {
  _id: string
  email: string
  adminName: string
  fullName: string
  role: string
  isActive: boolean
  avatar?: string
  createdAt: Date
}

const createNew = async (req: Request): Promise<IAdminResponse> => {
  try {
    // Check secret key
    if (req.body.secretKey !== env.ADMIN_CREATION_SECRET_KEY) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Khóa bí mật không hợp lệ!')
    }

    // Check if email already exists
    const existUser: any = await models.userModel.findOneByEmail(
      req.body.email as string
    )
    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email đã tồn tại!')
    }

    const nameFromEmail: string = (req.body.email as string).split('@')[0]

    // Prepare new admin data
    const newUser: ICreateAdminData = {
      email: req.body.email,
      adminName: req.body.adminName,
      password: bcrypt.hashSync(req.body.password, 8),
      fullName: nameFromEmail,
      verifyToken: uuidv7(),
      role: 'admin'
    }
    const createdAdmin = await models.adminModel.createNew(newUser)
    const getNewAdmin = await models.adminModel.findOneById(
      createdAdmin.insertedId.toString()
    )
    if (!getNewAdmin) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Không thể lấy thông tin quản trị viên vừa tạo.'
      )
    }
    // Send a welcome email to the new admin
    const verificationLink = `${WEBSITE_DOMAIN}/admin/account/verification?email=${getNewAdmin.email}&token=${getNewAdmin.verifyToken}`
    const customSubject =
      'Beautify: Vui lòng xác thực email trước khi sử dụng dịch vụ!'
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px 0;">
      <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 32px;">
      <h2 style="color: #2d8cf0; margin-bottom: 16px;">Xác Thực Tài Khoản Quản Trị</h2>
      <p style="font-size: 16px; color: #333;">Chào mừng đến với Bảng Điều Khiển <b>Beautify</b>!</p>
      <p style="font-size: 15px; color: #444;">Để kích hoạt tài khoản quản trị của bạn, vui lòng xác thực địa chỉ email bằng cách nhấp vào nút bên dưới:</p>
      <a href="${verificationLink}" style="display: flex;
      justify-content: center; align-items: center; margin: 24px 0; padding: 12px 28px; background: #2d8cf0; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">Xác Thực Email Quản Trị</a>
      <p style="font-size: 13px; color: #888;">Nếu nút không hoạt động, hãy sao chép và dán liên kết này vào trình duyệt:</p>
      <div style="word-break: break-all; background: #f4f4f4; padding: 8px 12px; border-radius: 4px; font-size: 13px; color: #2d8cf0;">${verificationLink}</div>
      <hr style="margin: 32px 0 16px 0; border: none; border-top: 1px solid #eee;">
      <div style="font-size: 13px; color: #888;">
      Trân trọng,<br/>
      <b>Đội Ngũ Beautify</b>
      </div>
      </div>
      </div>
    `
    await BrevoProvider.sendEmail(getNewAdmin.email, customSubject, htmlContent)

    return pickUser(getNewAdmin)
  } catch (error) {
    throw error
  }
}

const verifyEmail = async (
  email: string,
  token: string
): Promise<IAdminResponse> => {
  try {
    const admin = await models.adminModel.findOneByEmail(email)
    if (!admin) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy quản trị viên')
    }
    if (admin.verifyToken !== token) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Mã xác thực không hợp lệ')
    }
    const updateAdmin = {
      isActive: true,
      verifyToken: ''
    }
    if (!admin._id) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Thiếu ID quản trị viên, không thể cập nhật.'
      )
    }
    const result = await models.adminModel.update(
      admin._id.toString(),
      updateAdmin
    )
    return pickUser(result)
  } catch (error) {
    throw error
  }
}

const login = async (req: Request): Promise<IAdminResponse> => {
  try {
    const admin = await models.adminModel.findOneByEmail(
      req.body.email as string
    )
    if (!admin) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy quản trị viên')
    }
    if (!admin.isActive) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'Quản trị viên chưa được xác thực'
      )
    }
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      admin.password as string
    )
    if (!passwordIsValid) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'Email hoặc Mật khẩu của bạn không chính xác!'
      )
    }
    return pickUser(admin)
  } catch (error) {
    throw error
  }
}

// ===== EXPORTS =====

export type { IAdminResponse }

export const adminService = {
  createNew,
  verifyEmail,
  login
}
