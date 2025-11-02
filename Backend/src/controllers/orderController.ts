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

interface GetOrdersWithPaginationResponse {
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
  req: Request<{}, {}, CreateOrderRequest, {}>,
  res: Response<CreateOrderResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const newOrder = await services.orderService.createNew(req)
    res.status(StatusCodes.CREATED).json({
      message: 'Đơn hàng đã được tạo thành công',
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
      message: 'Đơn hàng đã được lấy thành công',
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
      message: 'Đơn hàng đã được lấy thành công',
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
      message: 'Tất cả đơn hàng đã được lấy thành công',
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
      message: 'Đơn hàng đã được cập nhật thành công',
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
      message: 'Đơn hàng đã được xóa thành công'
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
      message: 'Đơn hàng đã được xóa thành công'
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const getAllOrdersWithPagination = async (
  req: Request,
  res: Response<GetOrdersWithPaginationResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 7

    if (page < 1) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Trang phải lớn hơn 0')
    }

    const result = await services.orderService.getAllWithPagination(page, limit)
    res.status(StatusCodes.OK).json({
      message: 'Đơn hàng đã được lấy thành công',
      data: result.data,
      pagination: result.pagination
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const getUserOrdersWithPagination = async (
  req: Request,
  res: Response<GetOrdersWithPaginationResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.session.user!
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 7

    if (page < 1) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Trang phải lớn hơn 0')
    }

    const result = await services.orderService.getByUserIdWithPagination(
      userId,
      page,
      limit
    )
    res.status(StatusCodes.OK).json({
      message: 'Đơn hàng đã được lấy thành công',
      data: result.data,
      pagination: result.pagination
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
  GetOrdersResponse,
  GetOrdersWithPaginationResponse 

}

export const orderController = {
  createNew,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrder,
  deleteOrder,
  deleteOrderWhenOrderIsProcessing,
  getAllOrdersWithPagination,
  getUserOrdersWithPagination
}
