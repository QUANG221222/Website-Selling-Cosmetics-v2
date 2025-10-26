import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
  USERNAME_RULE,
  USERNAME_RULE_MESSAGE
} from '~/utils/validator'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    username: Joi.string()
      .required()
      .pattern(USERNAME_RULE)
      .message(USERNAME_RULE_MESSAGE),
    email: Joi.string()
      .required()
      .pattern(EMAIL_RULE)
      .message(EMAIL_RULE_MESSAGE),
    password: Joi.string()
      .required()
      .pattern(PASSWORD_RULE)
      .message(PASSWORD_RULE_MESSAGE)
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const verifyEmail = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const correctCondition = Joi.object({
    email: Joi.string()
      .required()
      .pattern(EMAIL_RULE)
      .message(EMAIL_RULE_MESSAGE),

    token: Joi.string().required()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const login = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    email: Joi.string()
      .required()
      .pattern(EMAIL_RULE)
      .message(EMAIL_RULE_MESSAGE),
    password: Joi.string()
      .required()
      .pattern(PASSWORD_RULE)
      .message(PASSWORD_RULE_MESSAGE)
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const validateUserId = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const correctCondition = Joi.object({
        id: Joi.string().hex().length(24).required()
    })
    try {
        await correctCondition.validateAsync(req.params, { abortEarly: false })
        next()
    } catch (error: any) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
    }
}

export const userValidation = {
  createNew,
  verifyEmail,
  login,
  validateUserId
}
