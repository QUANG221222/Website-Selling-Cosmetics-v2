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

interface UpdateCosmeticRequest {
  nameCosmetic?: string
  brand?: string
  classify?: string
  quantity?: number
  description?: string
  originalPrice?: number
  discountPrice?: number
  rating?: number
  isNew?: boolean
  isSaleOff?: boolean
  image?: string
  publicId?: string
}

interface UpdateCosmeticResponse {
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
interface GetCosmeticsWithPaginationResponse {
  message: string
  data: any[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
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
      .json({ message: 'Sản phẩm đã được tạo thành công', data: result })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const updateItem = async (
  req: Request<{ id: string }, {}, Partial<UpdateCosmeticRequest>, {}>,
  res: Response<UpdateCosmeticResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    if (req.file) {
      req.body.image = req.file.path
      req.body.publicId = req.file.filename
    }
    const result = await services.cosmeticService.updateItem(id, req.body)
    res
      .status(StatusCodes.OK)
      .json({ message: 'Sản phẩm đã được cập nhật thành công', data: result })
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
      .json({ message: 'Sản phẩm đã được lấy thành công', data: result })
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
      .json({ message: 'Sản phẩm đã được lấy thành công', data: result })
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
      .json({ message: 'Sản phẩm đã được lấy thành công', data: result })
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
      .json({ message: 'Sản phẩm đã được xóa thành công' })
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
      message: 'Hình ảnh đã được tải lên thành công',
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
      message: `${req.files.length} hình ảnh đã được tải lên thành công`,
      data: uploadedFiles
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}
const getCosmeticWithPagination = async (
    req: Request,
    res: Response<GetCosmeticsWithPaginationResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10

      if (page < 1) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Trang phải lớn hơn 0')
      }
        const result = await services.cosmeticService.getAllCosmeticsWithPagination(page, limit)
        res.status(StatusCodes.OK).json({
          message: 'Danh sách mỹ phẩm đã được lấy thành công',
          data: result.data,
          pagination: result.pagination
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
  GetCosmeticBySlugResponse,
  UpdateCosmeticRequest,
  UpdateCosmeticResponse,
GetCosmeticsWithPaginationResponse
}
export const cosmeticController = {
  createNew,
  uploadSingleImage,
  uploadMultipleImages,
  getAll,
  getById,
  getBySlug,
  deleteItem,
  updateItem,
  getCosmeticWithPagination
}
