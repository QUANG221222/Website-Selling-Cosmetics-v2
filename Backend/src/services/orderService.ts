import { Request } from 'express'
import { models, ICreateOrderData, IUpdateOrderData } from '~/models'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { pickOrder } from '~/utils/fomatter'

// ===== INTERFACES =====
interface IOrderResponse {
  _id: string
  userId: string
  receiverName: string
  receiverPhone: string
  receiverAddress: string
  items: Array<{
    cosmeticId: string
    quantity: number
    price: number
    subtotal: number
    cosmeticName?: string
    cosmeticImage?: string
  }>
  totalAmount: number
  totalItems: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  payment: {
    status: 'unpaid' | 'paid' | 'failed'
    method?: string
    amount: number
    paidAt?: Date
  }
  createdAt: Date
  updatedAt: Date | null
}

const createNew = async (req: Request): Promise<IOrderResponse> => {
  try {
    const { userId } = req.session.user!
    const {
      receiverName,
      receiverPhone,
      receiverAddress,
      items,
      paymentMethod
    } = req.body

    // Calculate totals
    let totalAmount = 0
    let totalItems = 0
    const orderItems = []

    for (const item of items) {
      // Verify cosmetic exists and has enough stock
      const cosmetic = await models.cosmeticModel.findOneById(item.cosmeticId)
      if (!cosmetic) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          `Cosmetic with ID ${item.cosmeticId} not found`
        )
      }

      if (cosmetic.quantity < item.quantity) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Insufficient stock for ${cosmetic.nameCosmetic}`
        )
      }

      const subtotal = item.price * item.quantity
      totalAmount += subtotal
      totalItems += item.quantity

      orderItems.push({
        cosmeticId: item.cosmeticId,
        quantity: item.quantity,
        price: item.price,
        subtotal: subtotal,
        cosmeticName: cosmetic.nameCosmetic,
        cosmeticImage: cosmetic.image
      })
    }

    const newOrderData: ICreateOrderData = {
      userId,
      receiverName,
      receiverPhone,
      receiverAddress,
      items: orderItems,
      totalAmount,
      totalItems,
      status: 'pending',
      payment: {
        status: 'unpaid',
        method: paymentMethod || 'COD',
        amount: totalAmount
      }
    }

    const createdOrder = await models.orderModel.createNew(newOrderData)
    const newOrder = await models.orderModel.findOneById(
      createdOrder.insertedId.toString()
    )

    if (!newOrder) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to retrieve newly created order'
      )
    }

    // Update cosmetic quantities
    for (const item of items) {
      const cosmetic = await models.cosmeticModel.findOneById(item.cosmeticId)
      await models.cosmeticModel.updateById(item.cosmeticId, {
        quantity: cosmetic!.quantity - item.quantity
      })
    }

    // Clear user's cart
    const userCart = await models.cartModel.findOneByUserId(userId)
    if (userCart) {
      await models.cartModel.updateById(userCart._id!.toString(), {
        items: [],
        totalAmount: 0,
        totalItems: 0
      })
    }

    return pickOrder(newOrder)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const getByUserId = async (userId: string): Promise<IOrderResponse[]> => {
  try {
    const orders = await models.orderModel.findByUserId(userId)
    return orders.map((order) => pickOrder(order))
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const getById = async (id: string): Promise<IOrderResponse> => {
  try {
    const order = await models.orderModel.findOneById(id)
    if (!order) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
    }
    return pickOrder(order)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const getAll = async (): Promise<IOrderResponse[]> => {
  try {
    const orders = await models.orderModel.findAll()
    return orders.map((order) => pickOrder(order))
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const updateById = async (
  id: string,
  updateData: IUpdateOrderData
): Promise<IOrderResponse> => {
  try {
    const existingOrder = await models.orderModel.findOneById(id)
    if (!existingOrder) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
    }

    if (updateData.status && updateData.status === 'completed') {
      // If order is marked as completed, set payment status to 'paid' and paidAt to current date
      updateData.payment = {
        status: 'paid',
        paidAt: new Date()
      }
    } else if (updateData.status && updateData.status === 'cancelled') {
      // If order is cancelled, restock the items
      for (const item of existingOrder.items) {
        const cosmetic = await models.cosmeticModel.findOneById(
          item.cosmeticId.toString()
        )
        if (cosmetic) {
          await models.cosmeticModel.updateById(item.cosmeticId.toString(), {
            quantity: cosmetic.quantity + item.quantity
          })
        }
      }
      // Also, set payment status to 'failed' if it was not already 'failed'
      if (existingOrder.payment.status !== 'failed') {
        updateData.payment = {
          status: 'failed'
        }
      }
    }
    const updatedOrder = await models.orderModel.updateById(id, updateData)
    return pickOrder(updatedOrder)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const deleteById = async (id: string): Promise<void> => {
  try {
    const existingOrder = await models.orderModel.findOneById(id)
    if (!existingOrder) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
    }
    await models.orderModel.deleteById(id)
    // Set order status to 'cancelled' if not already
    if (existingOrder.status !== 'cancelled') {
      await models.orderModel.updateById(id, {
        status: 'cancelled',
        updatedAt: new Date()
      })
    }
    // Set payment status to 'failed' if not already
    else if (existingOrder.payment.status !== 'failed') {
      await models.orderModel.updateById(id, {
        payment: { status: 'failed' },
        updatedAt: new Date()
      })
    }
    // Restock the items
    for (const item of existingOrder.items) {
      const cosmetic = await models.cosmeticModel.findOneById(
        item.cosmeticId.toString()
      )
      if (cosmetic) {
        await models.cosmeticModel.updateById(item.cosmeticId.toString(), {
          quantity: cosmetic.quantity + item.quantity
        })
      }
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

// ===== EXPORTS =====
export type { IOrderResponse }

export const orderService = {
  createNew,
  getByUserId,
  getById,
  getAll,
  updateById,
  deleteById
}
