import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'
import { StatusCodes } from 'http-status-codes'

const createOrder = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const correctCondition = Joi.object({
    receiverName: Joi.string().trim().min(2).max(50).required().messages({
      'string.empty': 'Receiver name is required',
      'string.min': 'Receiver name must be at least 2 characters',
      'string.max': 'Receiver name must be at most 50 characters'
    }),
    receiverPhone: Joi.string()
      .trim()
      .pattern(/^[0-9]{10,11}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid phone number format'
      }),
    receiverAddress: Joi.string().trim().min(10).max(200).required().messages({
      'string.empty': 'Receiver address is required',
      'string.min': 'Address must be at least 10 characters',
      'string.max': 'Address must be at most 200 characters'
    }),
    items: Joi.array()
      .items(
        Joi.object({
          cosmeticId: Joi.string()
            .required()
            .pattern(OBJECT_ID_RULE)
            .message(OBJECT_ID_RULE_MESSAGE),
          quantity: Joi.number().integer().min(1).max(99).required(),
          price: Joi.number().min(0).required()
        })
      )
      .min(1)
      .required(),
    paymentMethod: Joi.string().optional()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updateOrder = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const correctCondition = Joi.object({
    id: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    receiverName: Joi.string().trim().min(2).max(50).optional().messages({
      'string.min': 'Receiver name must be at least 2 characters',
      'string.max': 'Receiver name must be at most 50 characters'
    }),
    receiverPhone: Joi.string()
      .trim()
      .pattern(/^[0-9]{10,11}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Invalid phone number format'
      }),
    receiverAddress: Joi.string().trim().min(10).max(200).optional().messages({
      'string.empty': 'Receiver address is required',
      'string.min': 'Address must be at least 10 characters',
      'string.max': 'Address must be at most 200 characters'
    }),
    status: Joi.string()
      .valid('pending', 'processing', 'completed', 'cancelled')
      .optional(),
    payment: Joi.object({
      status: Joi.string().valid('unpaid', 'paid', 'failed').optional(),
      method: Joi.string().optional(),
      paidAt: Joi.date().optional()
    }).optional()
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

const validateOrderId = async (
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

export const orderValidation = {
  createOrder,
  updateOrder,
  validateOrderId
}
