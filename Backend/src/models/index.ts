import { adminModel } from './adminModel'
import { userModel } from './userModel'
import { cosmeticModel } from './cosmeticModel'
import { cartModel } from './cartModel'
import { addressModel } from './addressModel'
export type { ICreateUserData, IUser } from './userModel'
export type { IAdmin, ICreateAdminData } from './adminModel'
export type {
  ICosmetic,
  ICosmeticCreateData,
  ICosmeticUpdateData
} from './cosmeticModel'
export type {
  ICart,
  ICartItem,
  ICartCreateData,
  ICartUpdateData
} from './cartModel'
export type {
  IAddress,
  IAddressCreateData,
  IAddressUpdateData,
  IAddressItem,
  IAddressItemUpdateData
} from './addressModel'

export const models = {
  userModel,
  adminModel,
  cosmeticModel,
  cartModel,
  addressModel
}
