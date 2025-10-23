import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { services } from '~/services/index'
import ApiError from '~/utils/ApiError'

// ===== INTERFACES & TYPES =====
interface CreateAddressRequest {
  name: string
  phone: string
  addressDetail: string
  isDefault?: boolean
}

interface CreateAddressResponse {
  message: string
  data: any
}

interface UpdateAddressRequest {
  name?: string
  phone?: string
  addressDetail?: string
  isDefault?: boolean
}

interface UpdateAddressResponse {
  message: string
  data: any
}

interface GetAddressResponse {
  message: string
  data: any
}

interface GetAddressesResponse {
  message: string
  data: any[]
}

const createNew = async (
  req: Request<{}, {}, CreateAddressRequest, {}>,
  res: Response<CreateAddressResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const newAddress = await services.addressService.createNew(req)
    res.status(StatusCodes.CREATED).json({
      message: 'Địa chỉ mới đã được tạo thành công',
      data: newAddress
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const getAddresses = async (
  req: Request,
  res: Response<GetAddressesResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.session.user!
    const addresses = await services.addressService.getByUserId(userId)
    res.status(StatusCodes.OK).json({
      message: 'Các địa chỉ đã được lấy thành công',
      data: addresses
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const getAddressById = async (
  req: Request<{ index: string }, {}, {}, {}>,
  res: Response<GetAddressResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.session.user!
    const { index } = req.params

    const addressIndex = parseInt(index, 10)
    if (isNaN(addressIndex)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid address index')
    }

    const address = await services.addressService.getById(addressIndex, userId)
    res.status(StatusCodes.OK).json({
      message: 'Địa chỉ đã được lấy thành công',
      data: address
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const updateAddress = async (
  req: Request<{ index: string }, {}, UpdateAddressRequest, {}>,
  res: Response<UpdateAddressResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.session.user!
    const { index } = req.params

    const addressIndex = parseInt(index, 10)
    if (isNaN(addressIndex)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid address index')
    }

    const updatedAddress = await services.addressService.updateById(
      addressIndex,
      userId,
      req.body
    )

    res.status(StatusCodes.OK).json({
      message: 'Địa chỉ đã được cập nhật thành công',
      data: updatedAddress
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const deleteAddress = async (
  req: Request<{ index: string }, {}, {}, {}>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.session.user!
    const { index } = req.params

    const addressIndex = parseInt(index, 10)
    if (isNaN(addressIndex)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid address index')
    }

    await services.addressService.deleteById(addressIndex, userId)

    res.status(StatusCodes.OK).json({
      message: 'Địa chỉ đã được xóa thành công'
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const setDefaultAddress = async (
  req: Request<{ index: string }, {}, {}, {}>,
  res: Response<UpdateAddressResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.session.user!
    const { index } = req.params

    const addressIndex = parseInt(index, 10)
    if (isNaN(addressIndex)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid address index')
    }

    const updatedAddress = await services.addressService.setDefault(
      addressIndex,
      userId
    )

    res.status(StatusCodes.OK).json({
      message: 'Địa chỉ mặc định đã được thiết lập thành công',
      data: updatedAddress
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const getDefaultAddress = async (
  req: Request,
  res: Response<GetAddressResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.session.user!
    const defaultAddress = await services.addressService.getDefault(userId)

    if (!defaultAddress) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'No default address found')
    }

    res.status(StatusCodes.OK).json({
      message: 'Địa chỉ mặc định đã được lấy thành công',
      data: defaultAddress
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

// ===== EXPORTS =====
export type {
  CreateAddressRequest,
  CreateAddressResponse,
  UpdateAddressRequest,
  UpdateAddressResponse,
  GetAddressResponse,
  GetAddressesResponse
}

export const addressController = {
  createNew,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDefaultAddress
}
