import { Request, Response, NextFunction } from 'express'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { services } from '~/services'

interface GetTotalProductsResponse {
  message: string
  total: number
}

interface GetTotalUsersResponse {
  message: string
  total: number
}

interface GetTotalOrdersResponse {
  message: string
  total: number
}

interface GetRevenueResponse {
  message: string
  revenue: number
}

const getTotalProducts = async (
  _req: Request,
  res: Response<GetTotalProductsResponse>,
  next: NextFunction
) => {
  try {
    const result = await services.dashboardService.getTotalCosmetics()
    res
      .status(StatusCodes.OK)
      .json({ message: 'Tổng sản phẩm được lấy thành công', total: result })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const getTotalUsers = async (
  _req: Request,
  res: Response<GetTotalUsersResponse>,
  next: NextFunction
) => {
  try {
    const result = await services.dashboardService.getTotalUsers()
    res
      .status(StatusCodes.OK)
      .json({ message: 'Tổng người dùng được lấy thành công', total: result })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const getTotalOrders = async (
  _req: Request,
  res: Response<GetTotalOrdersResponse>,
  next: NextFunction
) => {
  try {
    const result = await services.dashboardService.getTotalOrders()
    res
      .status(StatusCodes.OK)
      .json({ message: 'Tổng đơn hàng được lấy thành công', total: result })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const getTotalOrdersByMonth = async (
  req: Request,
  res: Response<GetTotalOrdersResponse>,
  next: NextFunction
) => {
  try {
    const year = parseInt(req.params.year)
    const month = parseInt(req.params.month)
    const result = await services.dashboardService.getTotalOrdersByMonth(
      year,
      month
    )
    res.status(StatusCodes.OK).json({
      message: `Tổng đơn hàng theo tháng ${month} năm ${year} được lấy thành công`,
      total: result
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const getTotalOrdersSuccess = async (
  _req: Request,
  res: Response<GetTotalOrdersResponse>,
  next: NextFunction
) => {
  try {
    const result = await services.dashboardService.getTotalOrdersSuccess()
    res.status(StatusCodes.OK).json({
      message: 'Tổng đơn hàng thành công được lấy thành công',
      total: result
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const getTotalOrdersPending = async (
  _req: Request,
  res: Response<GetTotalOrdersResponse>,
  next: NextFunction
) => {
  try {
    const result = await services.dashboardService.getTotalOrdersPending()
    res.status(StatusCodes.OK).json({
      message: 'Tổng đơn hàng đang chờ được lấy thành công',
      total: result
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const getTotalOrdersCancelled = async (
  _req: Request,
  res: Response<GetTotalOrdersResponse>,
  next: NextFunction
) => {
  try {
    const result = await services.dashboardService.getTotalOrdersCancelled()
    res.status(StatusCodes.OK).json({
      message: 'Tổng đơn hàng đã hủy được lấy thành công',
      total: result
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const getTotalOrdersProcessing = async (
  _req: Request,
  res: Response<GetTotalOrdersResponse>,
  next: NextFunction
) => {
  try {
    const result = await services.dashboardService.getTotalOrdersProcessing()
    res.status(StatusCodes.OK).json({
      message: 'Tổng đơn hàng đang xử lý được lấy thành công',
      total: result
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const getRevenueByYear = async (
  req: Request,
  res: Response<GetRevenueResponse>,
  next: NextFunction
) => {
  try {
    const year = parseInt(req.params.year)
    const result = await services.dashboardService.getRevenueByYear(year)
    res.status(StatusCodes.OK).json({
      message: `Doanh thu theo năm ${year} được lấy thành công`,
      revenue: result
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const getRevenueByMonth = async (
  req: Request,
  res: Response<GetRevenueResponse>,
  next: NextFunction
) => {
  try {
    const year = parseInt(req.params.year)
    const month = parseInt(req.params.month)
    const result = await services.dashboardService.getRevenueByMonth(
      year,
      month
    )
    res.status(StatusCodes.OK).json({
      message: `Doanh thu theo tháng ${month} năm ${year} được lấy thành công`,
      revenue: result
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

// ===== EXPORTS =====

export type {
  GetTotalProductsResponse,
  GetTotalUsersResponse,
  GetTotalOrdersResponse,
  GetRevenueResponse
}
export const dashboardController = {
  getTotalProducts,
  getTotalUsers,
  getTotalOrders,
  getTotalOrdersByMonth,
  getTotalOrdersSuccess,
  getTotalOrdersPending,
  getTotalOrdersCancelled,
  getTotalOrdersProcessing,
  getRevenueByYear,
  getRevenueByMonth
}
