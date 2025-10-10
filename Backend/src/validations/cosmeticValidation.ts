import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    nameCosmetic: Joi.string().trim().min(2).max(100).required(),
    brand: Joi.string().trim().required(),
    classify: Joi.string().trim().min(2).max(100).required(),
    quantity: Joi.number().integer().min(0).required(),
    description: Joi.string().trim().min(10).max(1000).required(),
    originalPrice: Joi.number().min(1000).required(),
    discountPrice: Joi.number().min(0).required(),
    rating: Joi.number().min(0).max(5).required(),
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
  deleteItem
}
