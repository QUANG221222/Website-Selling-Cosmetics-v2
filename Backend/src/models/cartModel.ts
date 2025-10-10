import { GET_DB } from '~/configs/mongodb'
import Joi from 'joi'
import { ObjectId } from 'mongodb'

const COLLECTION_NAME: string = 'carts'
const INVALID_UPDATE_FIELDS: string[] = ['_id', 'createdAt']

// ===== INTERFACES =====
interface ICart {
  _id?: ObjectId
  userId: ObjectId
  items: ICartItem[]
  totalAmount: number
  totalItems: number
  createdAt: Date
  updatedAt: Date | null
  _destroy: boolean
}

interface ICartItem {
  cosmeticId: ObjectId
  quantity: number
  price: number
  subtotal: number
}

interface ICartCreateData {
  userId: string
  items: ICartItem[]
  totalAmount: number
  totalItems: number
}

interface ICartUpdateData {
  items?: ICartItem[]
  totalAmount?: number
  totalItems?: number
  updatedAt?: Date
}

// ===== VALIDATION SCHEMA =====
const CART_COLLECTION_SCHEMA: Joi.ObjectSchema = Joi.object({
  userId: Joi.string().required(),
  items: Joi.array()
    .items(
      Joi.object({
        cosmeticId: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().min(0).required(),
        subtotal: Joi.number().min(0).required()
      })
    )
    .required(),
  totalAmount: Joi.number().min(0).required(),
  totalItems: Joi.number().integer().min(0).required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const createNew = async (data: ICartCreateData): Promise<any> => {
  try {
    const validData = await CART_COLLECTION_SCHEMA.validateAsync(data, {
      abortEarly: false
    })
    const createdCart = await GET_DB()
      .collection(COLLECTION_NAME)
      .insertOne({
        ...validData,
        userId: new ObjectId(validData.userId),
        items: validData.items.map((item: any) => ({
          ...item,
          cosmeticId: new ObjectId(item.cosmeticId)
        }))
      })

    return createdCart
  } catch (error: any) {
    throw new Error(error)
  }
}

const findOneByUserId = async (userId: string): Promise<ICart | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ userId: new ObjectId(userId), _destroy: false })

    return result as ICart | null
  } catch (error: any) {
    throw new Error(error)
  }
}

const findOneById = async (id: string): Promise<ICart | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id), _destroy: false })

    return result as ICart | null
  } catch (error: any) {
    throw new Error(error)
  }
}

const updateById = async (
  id: string,
  updateData: ICartUpdateData
): Promise<ICart> => {
  try {
    // Filter out invalid fields
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName as keyof ICartUpdateData]
      }
    })

    if (updateData.items) {
      updateData.items = updateData.items.map((item: any) => ({
        ...item,
        cosmeticId: new ObjectId(item.cosmeticId)
      }))
    }

    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            ...updateData,
            updatedAt: Date.now()
          }
        },
        { returnDocument: 'after' }
      )

    return result as ICart
  } catch (error: any) {
    throw new Error(error)
  }
}

const deleteById = async (id: string): Promise<void> => {
  try {
    await GET_DB()
      .collection(COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            _destroy: true,
            updatedAt: new Date()
          }
        }
      )
  } catch (error: any) {
    throw new Error(error)
  }
}

// ===== EXPORTS =====
export type { ICart, ICartItem, ICartCreateData, ICartUpdateData }

export const cartModel = {
  createNew,
  findOneByUserId,
  findOneById,
  updateById,
  deleteById
}
