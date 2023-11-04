import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { logout } from './sessionSlice'

interface AppState {
  loading: boolean
  fetchingAllProducts: boolean
  showHeader: boolean // we may or may not use showHeader in the future
  showSearch: boolean
  showFooter: true
  mode: 'local' | 'nation'
  isInitialized: boolean
  isChatReady: boolean
}

const initialState: AppState = {
  loading: false,
  fetchingAllProducts: false,
  showHeader: true, // we may or may not use showHeader in the future
  showSearch: false,
  showFooter: true,
  mode: 'local', // 'nation',
  isInitialized: false,
  isChatReady: false,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload
    },
    setMode: (state, action: PayloadAction<'local' | 'nation'>) => {
      state.mode = action.payload
    },
    setIsChatReady: (state, action: PayloadAction<boolean>) => {
      state.isChatReady = action.payload
    },
    resetApp: () => {
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, () => {
      return initialState
    })
  },
})

export const { setIsInitialized, setMode, setIsChatReady, resetApp } =
  appSlice.actions

export default appSlice.reducer
