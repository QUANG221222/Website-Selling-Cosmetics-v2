import { userController } from './userController'
import { adminController } from './adminController'
import { cosmeticController } from './cosmeticController'
import { cartController } from './cartController'
import { addressController } from './addressController'
import { orderController } from './orderController'

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
export type { GetCartResponse } from './cartController'
export type {
  CreateAddressRequest,
  CreateAddressResponse,
  UpdateAddressRequest,
  UpdateAddressResponse,
  GetAddressResponse,
  GetAddressesResponse
} from './addressController'
export type {
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrderByIdResponse,
  GetAllOrdersResponse
} from './orderController'

export const controllers = {
  userController,
  adminController,
  cosmeticController,
  cartController,
  addressController,
  orderController
}
