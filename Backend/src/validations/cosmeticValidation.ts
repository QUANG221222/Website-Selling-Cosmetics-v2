import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    nameCosmetic: Joi.string().trim().min(2).max(100).required().messages({
      'string.empty': 'Name cosmetic is required',
      'string.min': 'Name cosmetic must be at least 2 characters',
      'string.max': 'Name cosmetic must be at most 100 characters'
    }),
    brand: Joi.string().trim().required().messages({
      'string.empty': 'Brand is required'
    }),
    classify: Joi.string().trim().min(2).max(100).required().messages({
      'string.empty': 'Classify is required',
      'string.min': 'Classify must be at least 2 characters',
      'string.max': 'Classify must be at most 100 characters'
    }),
    quantity: Joi.number().integer().min(0).required().messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': 'Quantity must be at least 0',
      'any.required': 'Quantity is required'
    }),
    description: Joi.string().trim().min(10).max(1000).required().messages({
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 10 characters',
      'string.max': 'Description must be at most 1000 characters'
    }),
    originalPrice: Joi.number().min(1000).required().messages({
      'number.base': 'Original price must be a number',
      'number.min': 'Original price must be at least 1000',
      'any.required': 'Original price is required'
    }),
    discountPrice: Joi.number().min(0).required().messages({
      'number.base': 'Discount price must be a number',
      'number.min': 'Discount price must be at least 0',
      'any.required': 'Discount price is required'
    }),
    rating: Joi.number().min(0).max(5).required().messages({
      'number.base': 'Rating must be a number',
      'number.min': 'Rating must be at least 0',
      'number.max': 'Rating must be at most 5',
      'any.required': 'Rating is required'
    }),
    isNew: Joi.boolean().optional(),
    isSaleOff: Joi.boolean().optional()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updateItem = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    id: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    nameCosmetic: Joi.string().trim().min(2).max(100).optional().messages({
      'string.empty': 'Name cosmetic is required',
      'string.min': 'Name cosmetic must be at least 2 characters',
      'string.max': 'Name cosmetic must be at most 100 characters'
    }),
    brand: Joi.string().trim().optional().messages({
      'string.empty': 'Brand is required'
    }),
    classify: Joi.string().trim().min(2).max(100).optional().messages({
      'string.empty': 'Classify is required',
      'string.min': 'Classify must be at least 2 characters',
      'string.max': 'Classify must be at most 100 characters'
    }),
    quantity: Joi.number().integer().min(0).optional().messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': 'Quantity must be at least 0'
    }),
    description: Joi.string().trim().min(10).max(1000).optional().messages({
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 10 characters',
      'string.max': 'Description must be at most 1000 characters'
    }),
    originalPrice: Joi.number().min(1000).optional().messages({
      'number.base': 'Original price must be a number',
      'number.min': 'Original price must be at least 1000'
    }),
    discountPrice: Joi.number().min(0).optional().messages({
      'number.base': 'Discount price must be a number',
      'number.min': 'Discount price must be at least 0'
    }),
    rating: Joi.number().min(0).max(5).optional().messages({
      'number.base': 'Rating must be a number',
      'number.min': 'Rating must be at least 0',
      'number.max': 'Rating must be at most 5'
    }),
    isNew: Joi.boolean().optional(),
    isSaleOff: Joi.boolean().optional()
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

const deleteItem = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    id: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
  })
  try {
    await correctCondition.validateAsync(req.params)

    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}
export const cosmeticValidation = {
  createNew,
  deleteItem,
  updateItem
}
