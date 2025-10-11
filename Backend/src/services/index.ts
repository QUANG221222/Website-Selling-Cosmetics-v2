import { userService } from './userService'
import { adminService } from './adminService'
import { cosmeticService } from './cosmeticService'
import { cartService } from './cartService'
import { addressService } from './addressService'

export type { IUserResponse } from './userService'
export type { IAdminResponse } from './adminService'
export type { ICosmeticResponse } from './cosmeticService'
export type { ICartResponse } from './cartService'
export type { IAddressResponse } from './addressService'

export const services = {
  userService,
  adminService,
  cosmeticService,
  cartService,
  addressService
}
