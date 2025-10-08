import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { cosmeticApi, CreateCosmeticData, UpdateCosmeticData } from '@/lib/api/cosmetic'
import { Cosmetic } from '@/lib/types'
import { toast } from 'sonner'

interface CosmeticState {
  cosmetics: Cosmetic[]
  selectedCosmetic: Cosmetic | null
  loading: boolean
  error: string | null
}

const initialState: CosmeticState = {
  cosmetics: [],
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
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch cosmetics')
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
    }
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
        state.cosmetics = action.payload
      })
      .addCase(fetchAllCosmetics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        toast.error(action.payload as string)
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
        toast.error(action.payload as string)
      })

      // Create cosmetic
      .addCase(createCosmetic.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCosmetic.fulfilled, (state, action) => {
        state.loading = false
        state.cosmetics.push(action.payload)
      })
      .addCase(createCosmetic.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        toast.error(action.payload as string)
      })

      // Update cosmetic
      .addCase(updateCosmetic.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCosmetic.fulfilled, (state, action) => {
        state.loading = false
        const index = state.cosmetics.findIndex(c => c._id === action.payload._id)
        if (index !== -1) {
          state.cosmetics[index] = action.payload
        }
        if (state.selectedCosmetic?._id === action.payload._id) {
          state.selectedCosmetic = action.payload
        }
      })
      .addCase(updateCosmetic.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        toast.error(action.payload as string)
      })

      // Delete cosmetic
      .addCase(deleteCosmetic.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteCosmetic.fulfilled, (state, action) => {
        state.loading = false
        state.cosmetics = state.cosmetics.filter(c => c._id !== action.payload)
        if (state.selectedCosmetic?._id === action.payload) {
          state.selectedCosmetic = null
        }
      })
      .addCase(deleteCosmetic.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        toast.error(action.payload as string)
      })
  }
})

// Actions
export const { setSelectedCosmetic, clearError } = cosmeticSlice.actions

// Selectors
export const selectAllCosmetics = (state: { cosmetic: CosmeticState }) => state.cosmetic.cosmetics
export const selectSelectedCosmetic = (state: { cosmetic: CosmeticState }) => state.cosmetic.selectedCosmetic
export const selectCosmeticLoading = (state: { cosmetic: CosmeticState }) => state.cosmetic.loading
export const selectCosmeticError = (state: { cosmetic: CosmeticState }) => state.cosmetic.error

// Reducer
export const cosmeticReducer = cosmeticSlice.reducer