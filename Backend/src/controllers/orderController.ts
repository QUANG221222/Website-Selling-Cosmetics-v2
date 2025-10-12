import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { services } from '~/services/index'
import ApiError from '~/utils/ApiError'

// ===== INTERFACES & TYPES =====
interface CreateOrderRequest {
  receiverName: string
  receiverPhone: string
  receiverAddress: string
  items: {
    cosmeticId: string
    quantity: number
    price: number
  }[]
  paymentMethod?: string
}

interface CreateOrderResponse {
  message: string
  data: any
}

interface UpdateOrderRequest {
  receiverName?: string
  receiverPhone?: string
  receiverAddress?: string
  status?: 'pending' | 'processing' | 'completed' | 'cancelled'
  payment?: {
    status?: 'unpaid' | 'paid' | 'failed'
    method?: string
    paidAt?: Date
  }
}

interface UpdateOrderResponse {
  message: string
  data: any
}

interface GetOrderResponse {
  message: string
  data: any
}

interface GetOrdersResponse {
  message: string
  data: any[]
}

const createNew = async (
  req: Request<{}, {}, CreateOrderRequest, {}>,
  res: Response<CreateOrderResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const newOrder = await services.orderService.createNew(req)
    res.status(StatusCodes.CREATED).json({
      message: 'Order created successfully',
      data: newOrder
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const getUserOrders = async (
  req: Request,
  res: Response<GetOrdersResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.session.user!
    const orders = await services.orderService.getByUserId(userId)
    res.status(StatusCodes.OK).json({
      message: 'Orders retrieved successfully',
      data: orders
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const getOrderById = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response<GetOrderResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const order = await services.orderService.getById(id)
    res.status(StatusCodes.OK).json({
      message: 'Order retrieved successfully',
      data: order
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const getAllOrders = async (
  _req: Request,
  res: Response<GetOrdersResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await services.orderService.getAll()
    res.status(StatusCodes.OK).json({
      message: 'All orders retrieved successfully',
      data: orders
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const updateOrder = async (
  req: Request<{ id: string }, {}, UpdateOrderRequest, {}>,
  res: Response<UpdateOrderResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const updatedOrder = await services.orderService.updateById(id, {
      ...req.body,
      updatedAt: new Date()
    })
    res.status(StatusCodes.OK).json({
      message: 'Order updated successfully',
      data: updatedOrder
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const deleteOrder = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    await services.orderService.deleteById(id)
    res.status(StatusCodes.OK).json({
      message: 'Order deleted successfully'
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const deleteOrderWhenOrderIsProcessing = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const order = await services.orderService.getById(id)
    if (order.status !== 'processing') {
      return next(
        new ApiError(StatusCodes.BAD_REQUEST, 'Order is not processing')
      )
    }
    await services.orderService.deleteById(id)
    res.status(StatusCodes.OK).json({
      message: 'Order deleted successfully'
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

// ===== EXPORTS =====
export type {
  CreateOrderRequest,
  CreateOrderResponse,
  UpdateOrderRequest,
  UpdateOrderResponse,
  GetOrderResponse,
  GetOrdersResponse
}

export const orderController = {
  createNew,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrder,
  deleteOrder,
  deleteOrderWhenOrderIsProcessing
}
