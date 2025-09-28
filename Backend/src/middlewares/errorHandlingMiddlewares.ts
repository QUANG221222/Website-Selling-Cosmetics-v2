import { StatusCodes } from 'http-status-codes'
import { env } from '../configs/enviroment'

export const errorHandlingMiddlewares = (
  err: any,
  _req: any,
  res: any,
  _next: any
) => {
  //// If the developer forgets to set statusCode, default to 500 INTERNAL_SERVER_ERROR

  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  // Create a variable responseError to control the response
  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode],
    stack: err.stack
  }

  // If Build Mode is not 'dev', remove the stack trace from the response
  if (env.BUILD_MODE !== 'dev') delete responseError.stack

  res.status(responseError.statusCode).json(responseError)
}
