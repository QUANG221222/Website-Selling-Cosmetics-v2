import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    nameCosmetic: Joi.string().trim().min(2).max(100).required().messages({
      'string.empty': 'Tên mỹ phẩm không được để trống',
      'string.min': 'Tên mỹ phẩm phải có ít nhất 2 ký tự',
      'string.max': 'Tên mỹ phẩm không được vượt quá 100 ký tự',
      'any.required': 'Tên mỹ phẩm là bắt buộc'
    }),
    brand: Joi.string().trim().required().messages({
      'string.empty': 'Thương hiệu không được để trống',
      'any.required': 'Thương hiệu là bắt buộc'
    }),
    classify: Joi.string().trim().min(2).max(100).required().messages({
      'string.empty': 'Phân loại không được để trống',
      'string.min': 'Phân loại phải có ít nhất 2 ký tự',
      'string.max': 'Phân loại không được vượt quá 100 ký tự',
      'any.required': 'Phân loại là bắt buộc'
    }),
    quantity: Joi.number().integer().min(0).required().messages({
      'number.base': 'Số lượng phải là một số',
      'number.integer': 'Số lượng phải là số nguyên',
      'number.min': 'Số lượng phải ít nhất là 0',
      'any.required': 'Số lượng là bắt buộc'
    }),
    description: Joi.string().trim().min(10).max(1000).required().messages({
      'string.empty': 'Mô tả không được để trống',
      'string.min': 'Mô tả phải có ít nhất 10 ký tự',
      'string.max': 'Mô tả không được vượt quá 1000 ký tự',
      'any.required': 'Mô tả là bắt buộc'
    }),
    originalPrice: Joi.number().min(1000).required().messages({
      'number.base': 'Giá gốc phải là một số',
      'number.min': 'Giá gốc phải ít nhất là 1000',
      'any.required': 'Giá gốc là bắt buộc'
    }),
    discountPrice: Joi.number().min(0).required().messages({
      'number.base': 'Giá khuyến mãi phải là một số',
      'number.min': 'Giá khuyến mãi phải ít nhất là 0',
      'any.required': 'Giá khuyến mãi là bắt buộc'
    }),
    rating: Joi.number().min(0).max(5).required().messages({
      'number.base': 'Đánh giá phải là một số',
      'number.min': 'Đánh giá phải ít nhất là 0',
      'number.max': 'Đánh giá không được vượt quá 5',
      'any.required': 'Đánh giá là bắt buộc'
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
      'string.empty': 'Tên mỹ phẩm không được để trống',
      'string.min': 'Tên mỹ phẩm phải có ít nhất 2 ký tự',
      'string.max': 'Tên mỹ phẩm không được vượt quá 100 ký tự'
    }),
    brand: Joi.string().trim().optional().messages({
      'string.empty': 'Thương hiệu không được để trống'
    }),
    classify: Joi.string().trim().min(2).max(100).optional().messages({
      'string.empty': 'Phân loại không được để trống',
      'string.min': 'Phân loại phải có ít nhất 2 ký tự',
      'string.max': 'Phân loại không được vượt quá 100 ký tự'
    }),
    quantity: Joi.number().integer().min(0).optional().messages({
      'number.base': 'Số lượng phải là một số',
      'number.integer': 'Số lượng phải là số nguyên',
      'number.min': 'Số lượng phải ít nhất là 0'
    }),
    description: Joi.string().trim().min(10).max(1000).optional().messages({
      'string.empty': 'Mô tả không được để trống',
      'string.min': 'Mô tả phải có ít nhất 10 ký tự',
      'string.max': 'Mô tả không được vượt quá 1000 ký tự'
    }),
    originalPrice: Joi.number().min(1000).optional().messages({
      'number.base': 'Giá gốc phải là một số',
      'number.min': 'Giá gốc phải ít nhất là 1000'
    }),
    discountPrice: Joi.number().min(0).optional().messages({
      'number.base': 'Giá khuyến mãi phải là một số',
      'number.min': 'Giá khuyến mãi phải ít nhất là 0'
    }),
    rating: Joi.number().min(0).max(5).optional().messages({
      'number.base': 'Đánh giá phải là một số',
      'number.min': 'Đánh giá phải ít nhất là 0',
      'number.max': 'Đánh giá không được vượt quá 5'
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
