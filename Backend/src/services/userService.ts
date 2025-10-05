import { pickUser } from '~/utils/fomatter'
import { Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { models } from '~/models'
import ApiError from '~/utils/ApiError'
import bcrypt from 'bcryptjs'
import { v7 as uuidv7 } from 'uuid'
import { BrevoProvider } from '~/providers/BrevoProvider'
import { WEBSITE_DOMAIN } from '~/utils/constants'

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

const createNew = async (reqBody: Request): Promise<IUserResponse> => {
  try {
    const existUser: any = await models.userModel.findOneByEmail(
      reqBody.body.email as string
    )
    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists!')
    }

    const nameFromEmail: string = (reqBody.body.email as string).split('@')[0]

    const newUser: any = {
      email: reqBody.body.email,
      username: reqBody.body.username,
      password: bcrypt.hashSync(reqBody.body.password, 8),
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
        'Failed to retrieve newly created user.'
      )
    }
    // Send a welcome email to the new user
    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const customSubject =
      'Skinsoothe: Please verify your email before using our services!'
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px 0;">
      <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 32px;">
        <h2 style="color: #2d8cf0; margin-bottom: 16px;">Verify Your Email</h2>
        <p style="font-size: 16px; color: #333;">Thank you for registering with <b>Skinsoothe</b>!</p>
        <p style="font-size: 15px; color: #444;">Please click the button below to verify your email address:</p>
        <a href="${verificationLink}" style="display: flex;
        justify-content: center; align-items: center; margin: 24px 0; padding: 12px 28px; background: #2d8cf0; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">Verify Email</a>
        <p style="font-size: 13px; color: #888;">If the button doesn't work, copy and paste this link into your browser:</p>
        <div style="word-break: break-all; background: #f4f4f4; padding: 8px 12px; border-radius: 4px; font-size: 13px; color: #2d8cf0;">${verificationLink}</div>
        <hr style="margin: 32px 0 16px 0; border: none; border-top: 1px solid #eee;">
        <div style="font-size: 13px; color: #888;">
        Sincerely,<br/>
        <b>WangCoder2k5</b>
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

export const userService = {
  createNew
}
