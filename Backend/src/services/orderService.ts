import { Request } from 'express'
import { models, ICreateOrderData, IUpdateOrderData } from '~/models'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { pickOrder } from '~/utils/fomatter'
import { calculatePagination, PaginatedResponse } from '~/utils/pagination'

// ===== INTERFACES =====
interface IOrderResponse {
  _id: string
  userId: string
  receiverName: string
  receiverPhone: string
  receiverAddress: string
  orderNotes?: string
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
    method?: 'COD' | 'BANK' | string
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
      orderNotes,
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

    // Xác định trạng thái thanh toán
    let paymentStatus: 'unpaid' | 'paid' = 'unpaid'
    let paidAt: Date | undefined = undefined
    if (paymentMethod === 'BANK') {
      paymentStatus = 'paid'
      paidAt = new Date()
    }

    const newOrderData: ICreateOrderData = {
      userId,
      receiverName,
      receiverPhone,
      receiverAddress,
      orderNotes,
      items: orderItems,
      totalAmount,
      totalItems,
      status: 'pending',
      payment: {
        status: paymentStatus,
        method: paymentMethod || 'COD',
        amount: totalAmount,
        ...(paidAt ? { paidAt } : {})
      }
    }

    const createdOrder = await models.orderModel.createNew(newOrderData)
    const newOrder = await models.orderModel.findOneById(
      createdOrder.insertedId.toString()
    )

    if (!newOrder) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Lỗi khi tạo đơn hàng mới'
      )
    }

    // Update cosmetic quantities
    for (const item of items) {
      const cosmetic = await models.cosmeticModel.findOneById(item.cosmeticId)
      await models.cosmeticModel.updateById(item.cosmeticId, {
        quantity: cosmetic!.quantity - item.quantity
      })
    }

    // Remove only ordered items from cart instead of clearing entire cart
    const userCart = await models.cartModel.findOneByUserId(userId)
    if (userCart && userCart.items && userCart.items.length > 0) {
      // Get IDs of ordered items
      const orderedCosmeticIds = items.map((item: any) => item.cosmeticId)

      // Filter out ordered items from cart
      const remainingItems = userCart.items.filter(
        (cartItem: any) =>
          !orderedCosmeticIds.includes(cartItem.cosmeticId.toString())
      )

      // Recalculate cart totals
      let newTotalAmount = 0
      let newTotalItems = 0

      for (const cartItem of remainingItems) {
        newTotalAmount += cartItem.subtotal
        newTotalItems += cartItem.quantity
      }

      // Update cart with remaining items
      await models.cartModel.updateById(userCart._id!.toString(), {
        items: remainingItems,
        totalAmount: newTotalAmount,
        totalItems: newTotalItems
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
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy đơn hàng')
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
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy đơn hàng')
    }
    // If status is masked as pending, subtract cosmetic quantities
    if (updateData.status && existingOrder.status === 'pending') {
      for (const item of existingOrder.items) {
        const cosmetic = await models.cosmeticModel.findOneById(
          item.cosmeticId.toString()
        )
        if (cosmetic) {
          await models.cosmeticModel.updateById(item.cosmeticId.toString(), {
            quantity: cosmetic.quantity - item.quantity
          })
        }
      }
    } else if (updateData.status && updateData.status === 'completed') {
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
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy đơn hàng')
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

const getAllWithPagination = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<IOrderResponse>> => {
  try {
    const { orders, total } = await models.orderModel.findAllWithPagination(
      page,
      limit
    )

    const paginationInfo = calculatePagination(total, page, limit)

    return {
      data: orders.map((item) => pickOrder(item)),
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

const getByUserIdWithPagination = async (
  userId: string,
  page: number = 1,
  limit: number = 7
): Promise<PaginatedResponse<IOrderResponse>> => {
  try {
    const { orders, total } =
      await models.orderModel.findByUserIdWithPagination(userId, page, limit)

    const paginationInfo = calculatePagination(total, page, limit)

    return {
      data: orders.map((item) => pickOrder(item)),
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
export type { IOrderResponse }

export const orderService = {
  createNew,
  getByUserId,
  getById,
  getAll,
  updateById,
  deleteById,
  getAllWithPagination,
  getByUserIdWithPagination
}
