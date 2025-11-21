import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { cartApi, AddToCartData, UpdateQuantityData } from "@/lib/api/cart";
import { createSelector } from 'reselect';
import { Cart } from "@/lib/types";
import { toast } from "sonner";

// ===== STATE INTERFACE =====
interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

// ===== ASYNC THUNKS =====

// Fetch user cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.getCart();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message
      );
    }
  }
);

// Add to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (data: AddToCartData, { rejectWithValue }) => {
    try {
      const response = await cartApi.addToCart(data);
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to add to cart";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Update quantity
export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async (
    { cosmeticId, data }: { cosmeticId: string; data: UpdateQuantityData },
    { rejectWithValue }
  ) => {
    try {
      const response = await cartApi.updateQuantity(cosmeticId, data);
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to update quantity";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Remove from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (cosmeticId: string, { rejectWithValue }) => {
    try {
      const response = await cartApi.removeItem(cosmeticId);
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to remove item";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      await cartApi.clearCart();
      toast.success("Đã xóa toàn bộ giỏ hàng");
      return null;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to clear cart";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Increment quantity (convenience thunk)
export const incrementQuantity = createAsyncThunk(
  "cart/incrementQuantity",
  async (cosmeticId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { cart: CartState };
      const item = state.cart.cart?.items.find(
        (i) => i.cosmetic?._id === cosmeticId
      );

      if (!item) {
        throw new Error("Item not found");
      }

      const response = await cartApi.updateQuantity(cosmeticId, {
        quantity: item.quantity + 1,
      });
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to increment quantity";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Decrement quantity (convenience thunk)
export const decrementQuantity = createAsyncThunk(
  "cart/decrementQuantity",
  async (cosmeticId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { cart: CartState };
      const item = state.cart.cart?.items.find(
        (i) => i.cosmetic?._id === cosmeticId
      );

      if (!item) {
        throw new Error("Item not found");
      }

      const newQuantity = item.quantity - 1;

      if (newQuantity <= 0) {
        // Remove item if quantity becomes 0
        const response = await cartApi.removeItem(cosmeticId);
        toast.info("Đã xóa sản phẩm khỏi giỏ hàng");
        return response.data;
      }

      const response = await cartApi.updateQuantity(cosmeticId, {
        quantity: newQuantity,
      });
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to decrement quantity";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
// ===== SLICE =====
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    toggleItemSelection: (state, action: PayloadAction<string>) => {
        const cosmeticId = action.payload;
        const item = state.cart?.items.find(i => i.cosmetic?._id === cosmeticId);
        if(item) {
            item.isSelected = !item.isSelected;
        }
    },
    fetchCartItemSelected: (state) => {
        if(state.cart) {
            const selectedItems = state.cart.items.filter(item => item.isSelected);
            state.cart.items = selectedItems;
            // Recalculate totalAmount and totalItems
            state.cart.totalItems = selectedItems.length;
            state.cart.totalAmount = selectedItems.reduce((total, item) => total + item.subtotal, 0);
        }
    },
},
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update quantity
      .addCase(updateQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.cart = {
          _id: state.cart?._id || "",
          userId: state.cart?.userId || "",
          items: [],
          totalAmount: 0,
          totalItems: 0,
          createdAt: state.cart?.createdAt || new Date(),
          updatedAt: new Date(),
        };
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Increment quantity
      .addCase(incrementQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(incrementQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(incrementQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Decrement quantity
      .addCase(decrementQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(decrementQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(decrementQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ===== ACTIONS =====
export const { clearError, toggleItemSelection, fetchCartItemSelected } = cartSlice.actions;

// ===== BASE SELECTORS =====
const selectCartState = (state: { cart: CartState }) => state.cart;

// ===== MEMOIZED SELECTORS =====
export const selectCart = createSelector(
  [selectCartState],
  (cartState) => cartState.cart
);

export const selectCartItems = createSelector(
  [selectCart],
  (cart) => cart?.items || []
);

export const selectCartItemsSelected = createSelector(
  [selectCart],
  (cart) => cart?.items.filter(item => item.isSelected) || []
);

export const selectCartTotalItems = createSelector(
  [selectCart],
  (cart) => cart?.totalItems || 0
);

export const selectCartTotalPrice = createSelector(
  [selectCart],
  (cart) => cart?.totalAmount || 0
);

export const selectCartSelectedTotalPrice = createSelector(
  [selectCartItemsSelected],
  (selectedItems) => 
    selectedItems.reduce((total, item) => total + item.subtotal, 0)
);

export const selectCartLoading = createSelector(
  [selectCartState],
  (cartState) => cartState.loading
);

export const selectCartError = createSelector(
  [selectCartState],
  (cartState) => cartState.error
);

// ===== REDUCER =====
export const cartReducer = cartSlice.reducer;
