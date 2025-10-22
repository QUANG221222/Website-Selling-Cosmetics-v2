import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { services } from '~/services/index'
import ApiError from '~/utils/ApiError'

// ===== INTERFACES & TYPES =====
interface CreateCartRequest {}

interface CreateCartResponse {
  message: string
  data: any
}

interface AddToCartRequest {
  cosmeticId: string
  quantity: number
}

interface AddToCartResponse {
  message: string
  data: any
}

interface UpdateQuantityRequest {
  cosmeticId: string
  quantity: number
}

interface UpdateQuantityResponse {
  message: string
  data: any
}

interface GetCartResponse {
  message: string
  data: any
}

const createNew = async (
  req: Request<{}, {}, CreateCartRequest, {}>,
  res: Response<CreateCartResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const newCart = await services.cartService.createNew(req)
    res.status(StatusCodes.CREATED).json({
      message: 'Cart created successfully',
      data: newCart
    })
  } catch (error: any) {
    // forward ApiError or convert unknown errors to internal server error
    if (error instanceof ApiError) return next(error)
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const getCart = async (
  req: Request,
  res: Response<GetCartResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.session.user!
    const cart = await services.cartService.getByUserId(userId)
    res.status(StatusCodes.OK).json({
      message: 'Cart retrieved successfully',
      data: cart
    })
  } catch (error: any) {
    if (error instanceof ApiError) return next(error)
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const addToCart = async (
  req: Request<{}, {}, AddToCartRequest, {}>,
  res: Response<AddToCartResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.session.user!
    const { cosmeticId, quantity } = req.body

    const updatedCart = await services.cartService.addToCart(
      userId,
      cosmeticId,
      quantity
    )

    res.status(StatusCodes.OK).json({
      message: 'Item added to cart successfully',
      data: updatedCart
    })
  } catch (error: any) {
    if (error instanceof ApiError) return next(error)
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const removeFromCart = async (
  req: Request<{ cosmeticId: string }, {}, {}, {}>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.session.user! // Non-null assertion
    const { cosmeticId } = req.params

    const updatedCart = await services.cartService.removeFromCart(
      userId,
      cosmeticId
    )

    res.status(StatusCodes.OK).json({
      message: 'Item removed from cart successfully',
      data: updatedCart
    })
  } catch (error: any) {
    if (error instanceof ApiError) return next(error)
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const updateQuantity = async (
  req: Request<{}, {}, UpdateQuantityRequest, {}>,
  res: Response<UpdateQuantityResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.session.user!
    const { cosmeticId, quantity } = req.body

    const updatedCart = await services.cartService.updateQuantity(
      userId,
      cosmeticId,
      quantity
    )

    res.status(StatusCodes.OK).json({
      message: 'Cart quantity updated successfully',
      data: updatedCart
    })
  } catch (error: any) {
    if (error instanceof ApiError) return next(error)
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const clearCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.session.user!
    await services.cartService.clearCart(userId)

    res.status(StatusCodes.OK).json({
      message: 'Cart cleared successfully'
    })
  } catch (error: any) {
    if (error instanceof ApiError) return next(error)
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

// ===== EXPORTS =====
export type {
  CreateCartRequest,
  CreateCartResponse,
  AddToCartRequest,
  AddToCartResponse,
  UpdateQuantityRequest,
  UpdateQuantityResponse,
  GetCartResponse
}

export const cartController = {
  createNew,
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart
}
