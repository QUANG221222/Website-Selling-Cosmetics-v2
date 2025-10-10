import { Request } from 'express'
import { models, ICartCreateData, ICartUpdateData } from '~/models'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { pickCart } from '~/utils/fomatter'

// ===== INTERFACES =====
interface ICartResponse {
  _id: string
  userId: string
  items: Array<{
    cosmeticId: string
    quantity: number
    price: number
    subtotal: number
    cosmetic?: any
  }>
  totalAmount: number
  totalItems: number
  createdAt: Date
  updatedAt: Date | null
}

const createNew = async (req: Request): Promise<ICartResponse> => {
  try {
    const { userId } = req.session.user!

    // Check if user already has a cart
    const existingCart = await models.cartModel.findOneByUserId(userId)
    if (existingCart) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        'Cart already exists for this user'
      )
    }

    const newCartData: ICartCreateData = {
      userId,
      items: [],
      totalAmount: 0,
      totalItems: 0
    }

    const createdCart = await models.cartModel.createNew(newCartData)
    const getNewCart = await models.cartModel.findOneById(
      createdCart.insertedId.toString()
    )

    if (!getNewCart) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to retrieve newly created cart'
      )
    }

    return pickCart(getNewCart)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const getByUserId = async (userId: string): Promise<ICartResponse> => {
  try {
    const cart = await models.cartModel.findOneByUserId(userId)
    if (!cart) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Cart not found')
    }

    // Populate cosmetic details for each item
    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const cosmetic = await models.cosmeticModel.findOneById(
          item.cosmeticId.toString()
        )
        return {
          ...item,
          cosmeticId: item.cosmeticId.toString(),
          cosmetic
        }
      })
    )

    return {
      ...pickCart(cart),
      items: populatedItems
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const addToCart = async (
  userId: string,
  cosmeticId: string,
  quantity: number
): Promise<ICartResponse> => {
  try {
    // Get cosmetic details
    const cosmetic = await models.cosmeticModel.findOneById(cosmeticId)
    if (!cosmetic) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Cosmetic not found')
    }

    if (cosmetic.quantity < quantity) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Insufficient stock')
    }

    // Get or create cart
    let cart = await models.cartModel.findOneByUserId(userId)

    if (!cart) {
      // Create new cart if doesn't exist
      const newCartData: ICartCreateData = {
        userId,
        items: [
          {
            cosmeticId: cosmeticId as any,
            quantity,
            price: cosmetic.discountPrice,
            subtotal: cosmetic.discountPrice * quantity
          }
        ],
        totalAmount: cosmetic.discountPrice * quantity,
        totalItems: quantity
      }

      const createdCart = await models.cartModel.createNew(newCartData)
      cart = await models.cartModel.findOneById(
        createdCart.insertedId.toString()
      )
    } else {
      // Update existing cart
      const existingItemIndex = cart.items.findIndex(
        (item) => item.cosmeticId.toString() === cosmeticId
      )

      if (existingItemIndex >= 0) {
        // Update existing item
        cart.items[existingItemIndex].quantity += quantity
        cart.items[existingItemIndex].subtotal =
          cart.items[existingItemIndex].price *
          cart.items[existingItemIndex].quantity
      } else {
        // Add new item
        cart.items.push({
          cosmeticId: cosmeticId as any,
          quantity,
          price: cosmetic.discountPrice,
          subtotal: cosmetic.discountPrice * quantity
        })
      }

      // Recalculate totals
      const totalAmount = cart.items.reduce(
        (sum, item) => sum + item.subtotal,
        0
      )
      const totalItems = cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      )

      const updateData: ICartUpdateData = {
        items: cart.items,
        totalAmount,
        totalItems
      }

      cart = await models.cartModel.updateById(cart._id!.toString(), updateData)
    }

    return pickCart(cart!)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const removeFromCart = async (
  userId: string,
  cosmeticId: string
): Promise<ICartResponse> => {
  try {
    const cart = await models.cartModel.findOneByUserId(userId)
    if (!cart) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Cart not found')
    }

    // Remove item from cart
    cart.items = cart.items.filter(
      (item) => item.cosmeticId.toString() !== cosmeticId
    )

    // Recalculate totals
    const totalAmount = cart.items.reduce((sum, item) => sum + item.subtotal, 0)
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0)

    const updateData: ICartUpdateData = {
      items: cart.items,
      totalAmount,
      totalItems
    }

    const updatedCart = await models.cartModel.updateById(
      cart._id!.toString(),
      updateData
    )

    return pickCart(updatedCart)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const updateQuantity = async (
  userId: string,
  cosmeticId: string,
  quantity: number
): Promise<ICartResponse> => {
  try {
    if (quantity <= 0) {
      return removeFromCart(userId, cosmeticId)
    }

    const cart = await models.cartModel.findOneByUserId(userId)
    if (!cart) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Cart not found')
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.cosmeticId.toString() === cosmeticId
    )

    if (itemIndex === -1) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Item not found in cart')
    }

    // Check stock
    const cosmetic = await models.cosmeticModel.findOneById(cosmeticId)
    if (!cosmetic || cosmetic.quantity < quantity) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Insufficient stock')
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity
    cart.items[itemIndex].subtotal = cart.items[itemIndex].price * quantity

    // Recalculate totals
    const totalAmount = cart.items.reduce((sum, item) => sum + item.subtotal, 0)
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0)

    const updateData: ICartUpdateData = {
      items: cart.items,
      totalAmount,
      totalItems
    }

    const updatedCart = await models.cartModel.updateById(
      cart._id!.toString(),
      updateData
    )

    return pickCart(updatedCart)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const clearCart = async (userId: string): Promise<void> => {
  try {
    const cart = await models.cartModel.findOneByUserId(userId)
    if (!cart) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Cart not found')
    }

    const updateData: ICartUpdateData = {
      items: [],
      totalAmount: 0,
      totalItems: 0
    }

    await models.cartModel.updateById(cart._id!.toString(), updateData)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

// ===== EXPORTS =====
export type { ICartResponse }

export const cartService = {
  createNew,
  getByUserId,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart
}
