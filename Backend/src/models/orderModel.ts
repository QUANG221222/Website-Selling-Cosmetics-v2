import { GET_DB } from '~/configs/mongodb'
import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'
import { ObjectId } from 'mongodb'

const COLLECTION_NAME: string = 'orders'
const INVALID_UPDATE_FIELDS: string[] = ['_id', 'createdAt']

// ===== INTERFACES =====
interface IOrder {
  _id?: ObjectId
  userId: ObjectId
  receiverName: string
  receiverPhone: string
  receiverAddress: string
  items: IOrderItem[]
  totalAmount: number
  totalItems: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  payment: IOrderPayment
  createdAt: Date
  updatedAt: Date | null
  _destroy: boolean
}

interface IOrderItem {
  cosmeticId: ObjectId
  quantity: number
  price: number
  subtotal: number
  cosmeticName?: string
  cosmeticImage?: string
}

interface IOrderPayment {
  status: 'unpaid' | 'paid' | 'failed'
  method?: string // 'COD' | 'Credit Card' | 'Bank Transfer'
  amount: number
  paidAt?: Date
}

interface ICreateOrderData {
  userId: string
  receiverName: string
  receiverPhone: string
  receiverAddress: string
  items: {
    cosmeticId: string
    quantity: number
    price: number
    subtotal: number
    cosmeticName?: string
    cosmeticImage?: string
  }[]
  totalAmount: number
  totalItems: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  payment: {
    status: 'unpaid' | 'paid' | 'failed'
    method?: string
    amount: number
    paidAt?: Date
  }
  paymentMethod?: string
}

interface IUpdateOrderData {
  receiverName?: string
  receiverPhone?: string
  receiverAddress?: string
  status?: 'pending' | 'processing' | 'completed' | 'cancelled'
  payment?: Partial<IOrderPayment>
  updatedAt: Date
}

const ORDER_COLLECTION_SCHEMA: Joi.ObjectSchema = Joi.object({
  userId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  receiverName: Joi.string().trim().min(2).max(50).required(),
  receiverPhone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10,11}$/)
    .required(),
  receiverAddress: Joi.string().trim().min(10).max(200).required(),
  items: Joi.array()
    .items(
      Joi.object({
        cosmeticId: Joi.string()
          .required()
          .pattern(OBJECT_ID_RULE)
          .message(OBJECT_ID_RULE_MESSAGE),
        quantity: Joi.number().integer().min(1).max(99).required(),
        price: Joi.number().min(0).required(),
        subtotal: Joi.number().min(0).required(),
        cosmeticName: Joi.string().optional(),
        cosmeticImage: Joi.string().optional()
      })
    )
    .min(1)
    .required(),
  totalAmount: Joi.number().min(0).required(),
  totalItems: Joi.number().integer().min(1).required(),
  status: Joi.string()
    .valid('pending', 'processing', 'completed', 'cancelled')
    .default('pending'),
  payment: Joi.object({
    status: Joi.string().valid('unpaid', 'paid', 'failed').default('unpaid'),
    method: Joi.string().optional(),
    amount: Joi.number().min(0).required(),
    paidAt: Joi.date().optional()
  }).required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const createNew = async (data: ICreateOrderData): Promise<any> => {
  try {
    const validData = await ORDER_COLLECTION_SCHEMA.validateAsync(data, {
      abortEarly: false
    })

    const createdOrder = await GET_DB()
      .collection(COLLECTION_NAME)
      .insertOne({
        ...validData,
        userId: new ObjectId(validData.userId),
        items: validData.items.map((item: any) => ({
          ...item,
          cosmeticId: new ObjectId(item.cosmeticId)
        }))
      })

    return createdOrder
  } catch (error: any) {
    throw new Error(error)
  }
}

const findOneById = async (id: string): Promise<IOrder | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id), _destroy: false })
    return result as IOrder | null
  } catch (error: any) {
    throw new Error(error)
  }
}

const findByUserId = async (userId: string): Promise<IOrder[]> => {
  try {
    const results = await GET_DB()
      .collection(COLLECTION_NAME)
      .find({ userId: new ObjectId(userId), _destroy: false })
      .sort({ createdAt: -1 })
      .toArray()
    return results as IOrder[]
  } catch (error: any) {
    throw new Error(error)
  }
}

const findAll = async (): Promise<IOrder[]> => {
  try {
    const results = await GET_DB()
      .collection(COLLECTION_NAME)
      .find({ _destroy: false })
      .sort({ createdAt: -1 })
      .toArray()
    return results as IOrder[]
  } catch (error: any) {
    throw new Error(error)
  }
}

const updateById = async (
  id: string,
  updateData: IUpdateOrderData
): Promise<IOrder> => {
  try {
    // Prevent update invalid fields
    Object.keys(updateData).forEach((field) => {
      if (INVALID_UPDATE_FIELDS.includes(field)) {
        delete updateData[field as keyof IUpdateOrderData]
      }
    })

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
    return result as IOrder
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
            updatedAt: Date.now()
          }
        }
      )
  } catch (error: any) {
    throw new Error(error)
  }
}

// ===== EXPORTS =====
export type {
  IOrder,
  IOrderItem,
  IOrderPayment,
  ICreateOrderData,
  IUpdateOrderData
}

export const orderModel = {
  createNew,
  findOneById,
  findByUserId,
  findAll,
  updateById,
  deleteById
}
