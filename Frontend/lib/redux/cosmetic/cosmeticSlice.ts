import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { cosmeticApi, CreateCosmeticData, UpdateCosmeticData } from '@/lib/api/cosmetic'
import { Cosmetic } from '@/lib/types'
import { toast } from 'sonner'
import { PaginationParams } from '@/lib/api/order'
import { RootState } from '../store'

interface CosmeticState {
  cosmetics: {
    items: Cosmetic[],
    totalCount: number,       // Tổng số users
    currentPage: number,      // Trang hiện tại
    pageSize: number,        // Số items/trang
    filters: {},         // Bộ lọc (role, status, etc.)
    sortBy: 'createdAt', // Sắp xếp theo
    sortOrder: 'desc'
  }
  selectedCosmetic: Cosmetic | null
  loading: boolean
  error: string | null
}

const initialState: CosmeticState = {
  cosmetics: {
    items: [],
    totalCount: 0,       // Tổng số users
    currentPage: 1,      // Trang hiện tại
    pageSize: 20,        // Số items/trang
    filters: {},         // Bộ lọc (role, status, etc.)
    sortBy: 'createdAt', // Sắp xếp theo
    sortOrder: 'desc'
  },
  selectedCosmetic: null,
  loading: false,
  error: null
}

// Async thunks
export const fetchAllCosmetics = createAsyncThunk(
  'cosmetic/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cosmeticApi.getAll()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message)
    }
  }
)

export const fetchCosmeticById = createAsyncThunk(
  'cosmetic/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await cosmeticApi.getById(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch cosmetic')
    }
  }
)

export const createCosmetic = createAsyncThunk(
  'cosmetic/create',
  async ({ data, imageFile }: { data: CreateCosmeticData; imageFile: File }, { rejectWithValue }) => {
    try {
      const response = await cosmeticApi.create(data, imageFile)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to create cosmetic')
    }
  }
)

export const updateCosmetic = createAsyncThunk(
  'cosmetic/update',
  async (
    { id, data, imageFile }: { id: string; data: UpdateCosmeticData; imageFile?: File },
    { rejectWithValue }
  ) => {
    try {
      const response = await cosmeticApi.update(id, data, imageFile)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to update cosmetic')
    }
  }
)

export const deleteCosmetic = createAsyncThunk(
  'cosmetic/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await cosmeticApi.delete(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete cosmetic')
    }
  }
)

export const getPagination = createAsyncThunk(
    'cosmetic/pagination',
    async (params: PaginationParams, { rejectWithValue }) => {
      try {
        const response = await cosmeticApi.getPagination(params)
        return response.data
      } catch (error: any) {
        return rejectWithValue(error?.response?.data?.message)
      }
    }
)

// Slice
export const cosmeticSlice = createSlice({
  name: 'cosmetic',
  initialState,
  reducers: {
    setSelectedCosmetic: (state, action: PayloadAction<Cosmetic | null>) => {
      state.selectedCosmetic = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
     setPaginationPage: (state, action) => {
      state.cosmetics.currentPage = action.payload;
    },
    setPaginationLimit: (state, action) => {
      state.cosmetics.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all cosmetics
      .addCase(fetchAllCosmetics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllCosmetics.fulfilled, (state, action) => {
        state.loading = false
        state.cosmetics.items = action.payload
      })
      .addCase(fetchAllCosmetics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch cosmetic by ID
      .addCase(fetchCosmeticById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCosmeticById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedCosmetic = action.payload
      })
      .addCase(fetchCosmeticById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Create cosmetic
      .addCase(createCosmetic.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCosmetic.fulfilled, (state, action) => {
        state.loading = false
        state.cosmetics.items.push(action.payload)
      })
      .addCase(createCosmetic.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Update cosmetic
      .addCase(updateCosmetic.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCosmetic.fulfilled, (state, action) => {
        state.loading = false
        const index = state.cosmetics.items.findIndex(c => c._id === action.payload._id)
        if (index !== -1) {
          state.cosmetics.items[index] = action.payload
        }
        if (state.selectedCosmetic?._id === action.payload._id) {
          state.selectedCosmetic = action.payload
        }
      })
      .addCase(updateCosmetic.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Delete cosmetic
      .addCase(deleteCosmetic.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteCosmetic.fulfilled, (state, action) => {
        state.loading = false
        state.cosmetics.items = state.cosmetics.items.filter(c => c._id !== action.payload)
        if (state.selectedCosmetic?._id === action.payload) {
          state.selectedCosmetic = null
        }
      })
      .addCase(deleteCosmetic.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(getPagination.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPagination.fulfilled, (state, action) => {
        state.loading = false;
          // ✅ Handle cả 2 trường hợp response
        if (Array.isArray(action.payload)) {
            // Response trả về array trực tiếp (như hiện tại)
            state.cosmetics.items = action.payload;
            state.cosmetics.totalCount = action.payload.length;
            state.cosmetics.currentPage = 1;
            state.cosmetics.pageSize = 20;
        } else if (action.payload.data) {
            // Response có structure đúng
            state.cosmetics.items = Array.isArray(action.payload.data) 
            ? action.payload.data 
            : [];
            
            if (action.payload.pagination) {
            state.cosmetics.totalCount = action.payload.pagination.totalItems || 0;
            state.cosmetics.currentPage = action.payload.pagination.currentPage || 1;
            state.cosmetics.pageSize = action.payload.pagination.itemsPerPage || 20;
            }
        } else {
            // Fallback
            state.cosmetics.items = [];
            state.cosmetics.totalCount = 0;
        }
      })
      .addCase(getPagination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  }
})

// Actions
export const { setSelectedCosmetic, clearError, setPaginationPage, setPaginationLimit  } = cosmeticSlice.actions

// Selectors
export const selectAllCosmetics = (state: { cosmetic: CosmeticState }) => state.cosmetic.cosmetics.items ?? []
export const selectSelectedCosmetic = (state: { cosmetic: CosmeticState }) => state.cosmetic.selectedCosmetic
export const selectCosmeticLoading = (state: { cosmetic: CosmeticState }) => state.cosmetic.loading
export const selectCosmeticError = (state: { cosmetic: CosmeticState }) => state.cosmetic.error

// Input selectors
const selectCurrentPage = (state: CosmeticState) => state.cosmetics.currentPage
const selectPageSize = (state: CosmeticState) => state.cosmetics.pageSize
const selectTotalCount = (state: CosmeticState) => state.cosmetics.totalCount

// ✅ Memoized selector
export const selectCosmeticPagination = createSelector(
  [selectCurrentPage, selectPageSize, selectTotalCount],
  (currentPage, pageSize, totalCount) => ({
    currentPage,
    pageSize,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize)
  })
)

// export const selectCosmeticPagination = (state: { cosmetic: CosmeticState }) => {
//     const currentPage = state.cosmetic?.cosmetics.currentPage || 1;
//     const pageSize = state.cosmetic?.cosmetics.pageSize || 20;
//     const totalCount = state.cosmetic?.cosmetics.totalCount || 0;
//     const totalPages = Math.ceil(totalCount / pageSize);
//     return { currentPage, pageSize, totalCount, totalPages };
// }

// Reducer
export const cosmeticReducer = cosmeticSlice.reducer