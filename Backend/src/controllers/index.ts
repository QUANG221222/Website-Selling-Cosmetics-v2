import { userController } from './userController'
import { adminController } from './adminController'
import { cosmeticController } from './cosmeticController'
export type {
  CreateUserRequest,
  CreateUserResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  LoginRequest,
  LoginResponse
} from './userController'
export type { CreateAdminRequest, CreateAdminResponse } from './adminController'
export type {
  CreateCosmeticRequest,
  CreateCosmeticResponse,
  GetCosmeticByIdResponse,
  GetAllCosmeticsResponse,
  GetCosmeticBySlugResponse
} from './cosmeticController'

export const controllers = {
  userController,
  adminController,
  cosmeticController
}
