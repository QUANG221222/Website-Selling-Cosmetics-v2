import { userController } from './userController'
import { adminController } from './adminController'
export type {
  CreateUserRequest,
  CreateUserResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  LoginRequest,
  LoginResponse
} from './userController'
export type { CreateAdminRequest, CreateAdminResponse } from './adminController'

export const controllers = {
  userController,
  adminController
}
