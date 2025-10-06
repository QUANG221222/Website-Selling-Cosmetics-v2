import { userService } from './userService'
import { adminService } from './adminService'
import { cosmeticService } from './cosmeticService'

export type { IUserResponse } from './userService'
export type { IAdminResponse } from './adminService'
export type { ICosmeticResponse } from './cosmeticService'

export const services = {
  userService,
  adminService,
  cosmeticService
}
