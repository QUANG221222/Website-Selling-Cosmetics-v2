import { adminModel } from './adminModel'
import { userModel } from './userModel'
export type { ICreateUserData, IUser } from './userModel'
export type { IAdmin, ICreateAdminData } from './adminModel'

export const models = {
  userModel,
  adminModel
}
