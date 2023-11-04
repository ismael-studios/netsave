import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { logout } from './sessionSlice'

interface OffersState {
  offers: []
  transactions: {}
  transStatuses: []
  reviews: {}
  localPickupCode: {}
  reviewCriterias: { buyer: []; seller: [] }
}

const initialState: OffersState = {
  offers: [],
  transactions: {},
  transStatuses: [],
  reviews: {},
  localPickupCode: {},
  reviewCriterias: { buyer: [], seller: [] },
}

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    resetOffers: () => {
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, () => {
      return initialState
    })
  },
})

export const { resetOffers } = offersSlice.actions

export default offersSlice.reducer
