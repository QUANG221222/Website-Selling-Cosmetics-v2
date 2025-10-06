import { userService } from './userService'
import { adminService } from './adminService'

export type { IUserResponse } from './userService'
export type { IAdminResponse } from './adminService'

export const services = {
  userService,
  adminService
}
