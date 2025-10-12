import { ApiResponse, Cart } from "../types"
import axiosInstance from "./axios"

// ===== INTERFACES =====
// export interface CartItem {
//   cosmeticId: string
//   quantity: number
//   price: number
//   subtotal: number
//   cosmetic?: {
//     _id: string
//     nameCosmetic: string
//     image?: string
//     brand?: string
//   }
// }

// export interface Cart {
//   _id: string
//   userId: string
//   items: CartItem[]
//   totalAmount: number
//   totalItems: number
//   createdAt: Date
//   updatedAt: Date | null
// }

export interface AddToCartData {
  cosmeticId: string
  quantity: number
  variant?: string
}

export interface UpdateQuantityData {
  quantity: number
}

// API METHOD 
export const cartApi = {
    // get user cart
    getCart: async (): Promise<ApiResponse<Cart>> => {
        const response = await axiosInstance.get('/carts')
        return response.data;
    },

    //Add to Cart 
    addToCart: async(data: AddToCartData): Promise<ApiResponse<Cart>> => {
        const response = await axiosInstance.post('/carts', data)
        return response.data;
    },
     // Update item quantity
    updateQuantity: async (
        cosmeticId: string,
        data: UpdateQuantityData
    ): Promise<ApiResponse<Cart>> => {
        const response = await axiosInstance.put('/carts', data)
        return response.data
    },

    // Remove item from cart
    removeItem: async (itemId: string): Promise<ApiResponse<Cart>> => {
        const response = await axiosInstance.delete(`/carts/${itemId}`)
        return response.data
    },

    // Clear entire cart
    clearCart: async (): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.delete('/carts/clear')
        return response.data
    }

}