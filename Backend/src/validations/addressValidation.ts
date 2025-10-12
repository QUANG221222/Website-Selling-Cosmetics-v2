import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'
import { StatusCodes } from 'http-status-codes'

const createAddress = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const correctCondition = Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must be at most 100 characters'
    }),
    phone: Joi.string()
      .trim()
      .pattern(/^(\+84|84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/)
      .required()
      .messages({
        'string.empty': 'Phone is required',
        'string.pattern.base': 'Invalid Vietnamese phone number format'
      }),
    addressDetail: Joi.string().trim().min(10).max(500).required().messages({
      'string.empty': 'Address detail is required',
      'string.min': 'Address detail must be at least 10 characters',
      'string.max': 'Address detail must be at most 500 characters'
    }),
    isDefault: Joi.boolean().optional()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updateAddress = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const correctCondition = Joi.object({
    name: Joi.string().trim().min(2).max(100).optional().messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must be at most 100 characters'
    }),
    phone: Joi.string()
      .trim()
      .pattern(/^(\+84|84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Invalid Vietnamese phone number format'
      }),
    addressDetail: Joi.string().trim().min(10).max(500).optional().messages({
      'string.min': 'Address detail must be at least 10 characters',
      'string.max': 'Address detail must be at most 500 characters'
    }),
    isDefault: Joi.boolean().optional(),
    index: Joi.string().required().pattern(/^\d+$/).messages({
      'string.pattern.base': 'Address index must be a valid number'
    })
  })

  try {
    await correctCondition.validateAsync(
      { ...req.body, ...req.params },
      { abortEarly: false }
    )
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const validateAddressIndex = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const correctCondition = Joi.object({
    index: Joi.string().required().pattern(/^\d+$/).messages({
      'string.pattern.base': 'Address index must be a valid number'
    })
  })

  try {
    await correctCondition.validateAsync(req.params, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const validateAddressId = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const correctCondition = Joi.object({
    id: Joi.string()
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

export const addressValidation = {
  createAddress,
  updateAddress,
  validateAddressId,
  validateAddressIndex
}
