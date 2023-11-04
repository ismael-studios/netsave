import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProductType } from '../../types'
import { productApi } from './api/features/product'
import { logout } from './sessionSlice'

interface ProductsState {
  allProducts: ProductType[]
  productDetails: {}
  categories: []
  sellers: [] // top sellers for now,
  sellerProducts: {}
  productLikes: {}
  allLikes: []
  conditions: []
  drafts: []
  productPackages: []
}

const initialState: ProductsState = {
  allProducts: [],
  productDetails: {},
  categories: [],
  sellers: [], // top sellers for now,
  sellerProducts: {},
  productLikes: {},
  allLikes: [],
  conditions: [],
  drafts: [],
  productPackages: [],
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProducts: () => {
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, () => {
      return initialState
    })
    builder.addMatcher(
      productApi.endpoints.getAllProducts.matchFulfilled,
      (state, { payload }) => {
        const { products, append } = payload
        state.allProducts = append
          ? [...state.allProducts, ...products]
          : products
      }
    )
  },
})

export const { resetProducts } = productsSlice.actions

export default productsSlice.reducer
