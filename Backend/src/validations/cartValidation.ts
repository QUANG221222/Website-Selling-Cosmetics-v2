import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'
import { StatusCodes } from 'http-status-codes'

const addToCart = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    cosmeticId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    quantity: Joi.number().integer().min(1).max(99).required().messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': 'Quantity must be at least 1',
      'number.max': 'Quantity must be at most 99',
      'any.required': 'Quantity is required'
    })
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updateQuantity = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const correctCondition = Joi.object({
    cosmeticId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    quantity: Joi.number().integer().min(0).max(99).required().messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': 'Quantity must be at least 0',
      'number.max': 'Quantity must be at most 99',
      'any.required': 'Quantity is required'
    })
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const removeFromCart = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const correctCondition = Joi.object({
    cosmeticId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
  })
  try {
    await correctCondition.validateAsync(req.params, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const cartValidation = {
  addToCart,
  updateQuantity,
  removeFromCart
}
