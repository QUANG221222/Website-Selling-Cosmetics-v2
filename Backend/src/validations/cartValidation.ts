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
      'number.base': 'Số lượng phải là một số',
      'number.integer': 'Số lượng phải là số nguyên',
      'number.min': 'Số lượng phải ít nhất là 1',
      'number.max': 'Số lượng không được vượt quá 99',
      'any.required': 'Số lượng là bắt buộc'
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
      'number.base': 'Số lượng phải là một số',
      'number.integer': 'Số lượng phải là số nguyên',
      'number.min': 'Số lượng phải ít nhất là 0',
      'number.max': 'Số lượng không được vượt quá 99',
      'any.required': 'Số lượng là bắt buộc'
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
