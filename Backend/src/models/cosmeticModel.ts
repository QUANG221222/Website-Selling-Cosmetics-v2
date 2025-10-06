import { GET_DB } from '~/configs/mongodb'
import Joi from 'joi'
import { ObjectId } from 'mongodb'

const COLLECTION_NAME: string = 'cosmetics'
// ===== INTERFACES =====
interface ICosmetic {
  _id?: ObjectId
  nameCosmetic: string
  slug: string
  brand: string
  classify: string
  quantity: number
  description: string
  originalPrice: number
  discountPrice: number
  rating: number
  isNew: boolean
  isSaleOff: boolean
  image: string
  createdAt: Date
  updatedAt: Date | null
  _destroy: boolean
}

interface ICosmeticCreateData {
  nameCosmetic: string
  slug: string
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
}

// ===== VALIDATION SCHEMA =====
const COSMETIC_COLLECTION_SCHEMA: Joi.ObjectSchema = Joi.object({
  nameCosmetic: Joi.string().trim().min(2).max(100).required(),
  slug: Joi.string().trim().min(2).max(100).required(),
  brand: Joi.string().trim().required(),
  classify: Joi.string().trim().min(2).max(100).required(),
  quantity: Joi.number().integer().min(0).required(),
  description: Joi.string().trim().min(10).max(1000).required(),
  originalPrice: Joi.number().min(1000).required(),
  discountPrice: Joi.number().min(0).required(),
  rating: Joi.number().min(0).max(5).required(),
  isNew: Joi.boolean().default(true),
  isSaleOff: Joi.boolean().default(false),
  image: Joi.string().uri().required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const createNew = async (data: ICosmeticCreateData): Promise<any> => {
  try {
    const validData = await COSMETIC_COLLECTION_SCHEMA.validateAsync(data, {
      abortEarly: false
    })
    const createdCosmetic = await GET_DB()
      .collection(COLLECTION_NAME)
      .insertOne(validData)

    return createdCosmetic
  } catch (error: any) {
    throw new Error(error)
  }
}

const findOneBySlug = async (slug: string): Promise<ICosmetic | null> => {
  try {
    const cosmetic = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ slug: slug, _destroy: false })
    return cosmetic as ICosmetic | null
  } catch (error: any) {
    throw new Error(error)
  }
}

const findOneById = async (id: string): Promise<ICosmetic | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id), _destroy: false })
    return result as ICosmetic | null
  } catch (error: any) {
    throw new Error(error)
  }
}

// ===== EXPORTS =====
export type { ICosmetic, ICosmeticCreateData }
export const cosmeticModel = {
  createNew,
  findOneById,
  findOneBySlug
}
