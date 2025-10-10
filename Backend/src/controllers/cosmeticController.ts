import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { services } from '~/services/index'
import ApiError from '~/utils/ApiError'

// ===== INTERFACES & TYPES =====
interface CreateCosmeticRequest {
  nameCosmetic: string
  brand: string
  classify: string
  quantity: number
  description: string
  originalPrice: number
  discountPrice: number
  rating: number
  isNew?: boolean
  isSaleOff?: boolean
  image: string
  publicId: string
}

interface CreateCosmeticResponse {
  message: string
  data: any
}

interface GetAllCosmeticsResponse {
  message: string
  data: any
}

interface GetCosmeticByIdResponse {
  message: string
  data: any
}

interface GetCosmeticBySlugResponse {
  message: string
  data: any
}

const createNew = async (
  req: Request<{}, {}, CreateCosmeticRequest, {}>,
  res: Response<CreateCosmeticResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Image is required')
    }
    const reqBodyWithImage: CreateCosmeticRequest = {
      ...req.body,
      image: req.file.path,
      publicId: req.file.filename
    }
    req.body = reqBodyWithImage as CreateCosmeticRequest
    const result = await services.cosmeticService.createNew(req)
    res
      .status(StatusCodes.CREATED)
      .json({ message: 'Cosmetic created successfully', data: result })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const getAll = async (
  _req: Request,
  res: Response<GetAllCosmeticsResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await services.cosmeticService.getAll()
    res
      .status(StatusCodes.OK)
      .json({ message: 'Cosmetics retrieved successfully', data: result })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const getById = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response<GetCosmeticByIdResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const result = await services.cosmeticService.getById(id)
    res
      .status(StatusCodes.OK)
      .json({ message: 'Cosmetic retrieved successfully', data: result })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const getBySlug = async (
  req: Request<{ slug: string }, {}, {}, {}>,
  res: Response<GetCosmeticBySlugResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params
    const result = await services.cosmeticService.getBySlug(slug)
    res
      .status(StatusCodes.OK)
      .json({ message: 'Cosmetic retrieved successfully', data: result })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const deleteItem = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response<{ message: string }>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    await services.cosmeticService.deleteById(id)
    res
      .status(StatusCodes.OK)
      .json({ message: 'Cosmetic deleted successfully' })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const uploadSingleImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'No file uploaded')
    }

    res.status(StatusCodes.OK).json({
      message: 'Image uploaded successfully',
      data: {
        url: req.file.path,
        publicId: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        format: req.file.mimetype
      }
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const uploadMultipleImages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'No files uploaded')
    }

    const uploadedFiles = req.files.map((file: any) => ({
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname,
      size: file.size,
      format: file.mimetype
    }))

    res.status(StatusCodes.OK).json({
      message: `${req.files.length} images uploaded successfully`,
      data: uploadedFiles
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}
// ===== EXPORTS =====

export type {
  CreateCosmeticRequest,
  CreateCosmeticResponse,
  GetCosmeticByIdResponse,
  GetAllCosmeticsResponse,
  GetCosmeticBySlugResponse
}
export const cosmeticController = {
  createNew,
  uploadSingleImage,
  uploadMultipleImages,
  getAll,
  getById,
  getBySlug,
  deleteItem
}
