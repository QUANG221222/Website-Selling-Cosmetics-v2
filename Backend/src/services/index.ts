import { userService } from './userService'
import { adminService } from './adminService'
import { cosmeticService } from './cosmeticService'
import { cartService } from './cartService'
import { addressService } from './addressService'
import { orderService } from './orderService'
import { dashboardService } from './dashboardService'

export type { IUserResponse } from './userService'
export type { IAdminResponse } from './adminService'
export type { ICosmeticResponse } from './cosmeticService'
export type { ICartResponse } from './cartService'
export type { IAddressResponse } from './addressService'
export type { IOrderResponse } from './orderService'

export const services = {
  userService,
  adminService,
  cosmeticService,
  cartService,
  addressService,
  orderService,
  dashboardService
}
