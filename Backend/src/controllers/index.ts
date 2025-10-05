import { userController } from './userController'
export type {
  CreateUserRequest,
  CreateUserResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  LoginRequest,
  LoginResponse
} from './userController'

export const controllers = {
  userController
}
