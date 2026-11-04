import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { Product } from '../../types'

type Status = 'idle' | 'loading' | 'succeeded' | 'failed'

interface ProductsState {
  items: Product[]
  status: Status
  error: string | null
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
}

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const res = await fetch('https://fakestoreapi.com/products')
    if (!res.ok) {
      return rejectWithValue(`Lỗi tải dữ liệu (HTTP ${res.status})`)
    }
    const data = (await res.json()) as Product[]
    return data
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : 'Không thể kết nối tới máy chủ',
    )
  }
})

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error.message ?? 'Đã có lỗi xảy ra'
      })
  },
})

export const selectProducts = (state: RootState) => state.products.items
export const selectProductsStatus = (state: RootState) => state.products.status
export const selectProductsError = (state: RootState) => state.products.error
export const selectProductById = (state: RootState, id: number) =>
  state.products.items.find((p) => p.id === id)

export default productsSlice.reducer
