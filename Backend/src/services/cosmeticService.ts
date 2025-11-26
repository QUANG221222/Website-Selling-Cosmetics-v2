import { Request } from 'express'
import { slugify, pickCosmetic } from '~/utils/fomatter'
import { models, ICosmeticCreateData, ICosmeticUpdateData } from '~/models'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { cloudinary } from '~/configs/cloudinary'
import { calculatePagination, PaginatedResponse } from '~/utils/pagination'

// ===== INTERFACES & TYPES =====
interface ICosmeticResponse {
  _id: string
  nameCosmetic: string
  slug: string
  brand: string
  classify: string
  quantity: number
  description: string
  originalPrice: number
  discountPrice: number
  image: string
  publicId: string
  rating: number
  isNew: boolean
  isSaleOff: boolean
  createdAt: Date
}

const createNew = async (data: Request): Promise<any> => {
  try {
    const slug: string = slugify(data.body.nameCosmetic)
    const exitCosmetic = await models.cosmeticModel.findOneBySlug(slug)
    if (exitCosmetic) {
      throw new ApiError(StatusCodes.CONFLICT, 'Sản phẩm mỹ phẩm đã tồn tại')
    }
    const createNewCosmetic: ICosmeticCreateData = {
      ...data.body,
      slug: slug
    }
    const newCosmetic = await models.cosmeticModel.createNew(createNewCosmetic)

    const getNewCosmetic = await models.cosmeticModel.findOneById(
      newCosmetic.insertedId.toString()
    )

    if (!getNewCosmetic) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Không thể lấy thông tin sản phẩm mỹ phẩm vừa tạo'
      )
    }

    return pickCosmetic(getNewCosmetic)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const getAll = async (): Promise<ICosmeticResponse[]> => {
  try {
    const result = await models.cosmeticModel.findAll()
    return result.map((item) => pickCosmetic(item))
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const getById = async (id: string): Promise<ICosmeticResponse> => {
  try {
    const cosmetic = await models.cosmeticModel.findOneById(id)
    if (!cosmetic) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Không tìm thấy sản phẩm mỹ phẩm'
      )
    }
    return pickCosmetic(cosmetic)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const getBySlug = async (slug: string): Promise<ICosmeticResponse> => {
  try {
    const cosmetic = await models.cosmeticModel.findOneBySlug(slug)
    if (!cosmetic) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Không tìm thấy sản phẩm mỹ phẩm'
      )
    }
    return pickCosmetic(cosmetic)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const deleteById = async (id: string): Promise<void> => {
  try {
    const cosmetic = await models.cosmeticModel.findOneById(id)
    if (!cosmetic) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Không tìm thấy sản phẩm mỹ phẩm'
      )
    }
    await cloudinary.uploader.destroy(cosmetic.publicId)
    await models.cosmeticModel.deleteById(id)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const updateItem = async (
  id: string,
  data: Partial<ICosmeticCreateData>
): Promise<ICosmeticResponse> => {
  try {
    const cosmetic = await models.cosmeticModel.findOneById(id)
    if (!cosmetic) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Không tìm thấy sản phẩm mỹ phẩm'
      )
    }
    if (data.nameCosmetic && data.nameCosmetic !== cosmetic.nameCosmetic) {
      data.slug = slugify(data.nameCosmetic)
    }
    if (data.image && data.image !== cosmetic.image) {
      await cloudinary.uploader.destroy(cosmetic.publicId)
    }

    const updateCosmetic: ICosmeticUpdateData = {
      ...data
    }

    const updatedCosmetic = await models.cosmeticModel.updateById(
      id,
      updateCosmetic
    )

    return pickCosmetic(updatedCosmetic)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const getAllCosmeticsWithPagination = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<ICosmeticResponse>> => {
  try {
    const { cosmetics, total } =
      await models.cosmeticModel.findAllWithPagination(page, limit)
    const paginationInfo = calculatePagination(total, page, limit)

    return {
      data: cosmetics.map((item) => pickCosmetic(item)),
      pagination: {
        currentPage: paginationInfo.currentPage,
        totalPages: paginationInfo.totalPages,
        totalItems: paginationInfo.totalItems,
        itemsPerPage: limit,
        hasNextPage: paginationInfo.hasNextPage,
        hasPrevPage: paginationInfo.hasPrevPage
      }
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

// ===== EXPORTS =====
export type { ICosmeticResponse }

export const cosmeticService = {
  createNew,
  getAll,
  getById,
  getBySlug,
  deleteById,
  updateItem,
  getAllCosmeticsWithPagination
}
