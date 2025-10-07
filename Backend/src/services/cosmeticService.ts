import { Request } from 'express'
import { slugify, pickCosmetic } from '~/utils/fomatter'
import { models, ICosmeticCreateData } from '~/models'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

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
  createdAt: Date
}

const createNew = async (data: Request): Promise<any> => {
  try {
    const slug: string = slugify(data.body.nameCosmetic)
    const exitCosmetic = await models.cosmeticModel.findOneBySlug(slug)
    if (exitCosmetic) {
      throw new ApiError(StatusCodes.CONFLICT, 'Cosmetic already exists')
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
        'Failed to retrieve newly created cosmetic'
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
      throw new ApiError(StatusCodes.NOT_FOUND, 'Cosmetic not found')
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
      throw new ApiError(StatusCodes.NOT_FOUND, 'Cosmetic not found')
    }
    return pickCosmetic(cosmetic)
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
  getBySlug
}
