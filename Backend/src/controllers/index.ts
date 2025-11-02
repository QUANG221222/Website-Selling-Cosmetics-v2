import { userController } from './userController'
import { adminController } from './adminController'
import { cosmeticController } from './cosmeticController'
import { cartController } from './cartController'
import { addressController } from './addressController'
import { orderController } from './orderController'
import { dashboardController } from './dashboardController'

export type {
  CreateUserRequest,
  CreateUserResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  LoginRequest,
  LoginResponse,
  GetUsersWithPaginationResponse
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
  GetOrderResponse,
  GetOrdersResponse
} from './orderController'
export type {
  GetTotalProductsResponse,
  GetTotalUsersResponse,
  GetTotalOrdersResponse,
  GetRevenueResponse
} from './dashboardController'

export const controllers = {
  userController,
  adminController,
  cosmeticController,
  cartController,
  addressController,
  orderController,
  dashboardController
}
