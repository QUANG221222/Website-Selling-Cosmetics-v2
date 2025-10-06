import { adminModel } from './adminModel'
import { userModel } from './userModel'
import { cosmeticModel } from './cosmeticModel'
export type { ICreateUserData, IUser } from './userModel'
export type { IAdmin, ICreateAdminData } from './adminModel'
export type { ICosmetic, ICosmeticCreateData } from './cosmeticModel'

export const models = {
  userModel,
  adminModel,
  cosmeticModel
}
