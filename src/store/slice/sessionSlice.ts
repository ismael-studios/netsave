import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '..'
import { UserType } from '../../types'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { LoginManager } from 'react-native-fbsdk-next'
import { deleteFCMToken } from '../../helpers/FCMHelper'
import ChatClient from '../../services/Chat'
import SiftReactNative from 'sift-react-native'
import { authApi } from './api/features/auth'
import { userApi } from './api/features/user'
import api from './api'

interface SessionState {
  user: UserType | null
  sub: string
  token: string
  refreshToken: string
  tokenTime: null
  fetchingToken: boolean
  useLocation: boolean
  signUpEmail: string
  signedIn: boolean
  credentials: { failed: boolean }
  confirmation: { failed: boolean }
  followers: {}
  following: {}
  productLikes: []
  likes: []
  users: {}
  addresses: []
  balance: {}
  balanceTransactions: []
  externalAccounts: []
  rewardsTransactions: []
}

const initialState: SessionState = {
  user: null,
  sub: '',
  token: '',
  refreshToken: '',
  tokenTime: null,
  fetchingToken: false,
  useLocation: true,
  signUpEmail: '',
  signedIn: false,
  credentials: { failed: false },
  confirmation: { failed: false },
  followers: {},
  following: {},
  productLikes: [],
  likes: [],
  users: {},
  addresses: [],
  balance: {},
  balanceTransactions: [],
  externalAccounts: [],
  rewardsTransactions: [],
}

export const logout = createAsyncThunk<
  {},
  undefined,
  {
    state: RootState
  }
>('session/logout', async (_, { dispatch }) => {
  GoogleSignin.signOut()
  LoginManager.logOut()
  await deleteFCMToken()
  await ChatClient.disconnectUser()
  SiftReactNative.unsetUserId()
  setTimeout(() => {
    dispatch(api.util.resetApiState())
  })
})

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setTokens: (
      state,
      action: PayloadAction<{
        sub: string
        token: string
        refreshToken: string
      }>
    ) => {
      state.sub = action.payload.sub
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
      state.signedIn = true
    },
    setUseLocation: (state, action: PayloadAction<boolean>) => {
      state.useLocation = action.payload
    },
    resetUsersCache: (state) => {
      state.fetchingToken = false
      state.followers = {}
      state.following = {}
      state.productLikes = []
      state.likes = []
      state.users = {}
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, () => {
      return initialState
    })
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.sub = payload.sub
        state.token = payload.token
        state.refreshToken = payload.refreshToken
        state.signedIn = true
      }
    )
    builder.addMatcher(
      authApi.endpoints.appleAuth.matchFulfilled,
      (state, { payload }) => {
        state.sub = payload.sub
        state.token = payload.token
        state.refreshToken = payload.refreshToken
        state.signedIn = true
      }
    )
    builder.addMatcher(
      authApi.endpoints.googleAuth.matchFulfilled,
      (state, { payload }) => {
        state.sub = payload.sub
        state.token = payload.token
        state.refreshToken = payload.refreshToken
        state.signedIn = true
      }
    )
    builder.addMatcher(
      authApi.endpoints.facebookAuth.matchFulfilled,
      (state, { payload }) => {
        state.sub = payload.sub
        state.token = payload.token
        state.refreshToken = payload.refreshToken
        state.signedIn = true
      }
    )
    builder.addMatcher(
      userApi.endpoints.getUser.matchFulfilled,
      (state, { payload }) => {
        if (state.sub === payload.id) {
          state.user = payload
        }
      }
    )
    builder.addMatcher(
      userApi.endpoints.updateUser.matchFulfilled,
      (state, { payload }) => {
        state.user = payload
      }
    )
  },
})

export const { resetUsersCache, setUseLocation, setTokens } =
  sessionSlice.actions

export default sessionSlice.reducer
