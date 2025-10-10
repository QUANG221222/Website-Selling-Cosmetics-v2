import { userController } from './userController'
import { adminController } from './adminController'
import { cosmeticController } from './cosmeticController'
import {cartController} from './cartController'
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
  GetCosmeticBySlugResponse,
  UpdateCosmeticRequest,
  UpdateCosmeticResponse
} from './cosmeticController'

export const controllers = {
  userController,
  adminController,
  cosmeticController,
  cartController
}
