import { authHandlingMiddleware } from './authHandlingMiddleware'
import { errorHandlingMiddleware } from './errorHandlingMiddleware'

export const middlewares = {
  errorHandlingMiddleware,
  authHandlingMiddleware
}
