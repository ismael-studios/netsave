import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import api from '..'
import jwt_decode from 'jwt-decode'
import { AuthTokenPayload, Response } from '../../../../types'

interface LoginArg {
  email: string
  password: string
  deviceId: string
}
interface LoginResponseData {
  token: string
  refreshToken: string
}

interface LoginData {
  token: string
  refreshToken: string
  sub: string
}

interface RequestResetPasswordArg {
  email: string
}

interface ResetPasswordArg {
  email: string
  code: number
  password: string
}

interface AppleLoginArg {
  firstName?: string
  lastName?: string
  idToken: string
  nonce: string
  deviceId: string
}

interface GoogleLoginArg {
  idToken: string
  deviceId: string
}

interface FacebookLoginArg {
  accessToken: string
  deviceId: string
}

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginData, LoginArg>({
      async queryFn(
        { email, deviceId, password },
        _queryApi,
        _extraOptions,
        fetchWithBQ
      ) {
        const loginSessionResult = await fetchWithBQ({
          url: '/users/login-sessions',
          method: 'POST',
          data: { email },
        })
        // console.log(loginSessionResult)
        if (loginSessionResult.error) {
          throw loginSessionResult.error
        }
        const session = loginSessionResult.data as {
          message: string
          data: {
            sessionId: string
          }
        }
        const loginResult = await fetchWithBQ({
          url: 'users/login',
          method: 'POST',
          data: { deviceId, sessionId: session.data.sessionId, password },
        })
        console.log('loginResult', loginResult)
        if (loginResult.data) {
          const result = loginResult.data as Response<LoginResponseData>
          const { sub, exp } = jwt_decode<AuthTokenPayload>(result.data?.token)
          return { data: { ...result.data, sub } }
        } else {
          return { error: loginResult.error as FetchBaseQueryError }
        }
      },
    }),
    requestResetPassword: build.mutation<
      Response<undefined>,
      RequestResetPasswordArg
    >({
      query: (data) => ({
        url: 'users/passwords',
        method: 'POST',
        data,
      }),
    }),
    resetPassword: build.mutation<Response<undefined>, ResetPasswordArg>({
      query: (data) => ({
        url: 'users/passwords',
        method: 'PUT',
        data,
      }),
    }),
    appleAuth: build.mutation<LoginData, AppleLoginArg>({
      query: (data) => ({
        url: 'users/apple',
        method: 'POST',
        data,
      }),
      transformResponse: (response: Response<LoginResponseData>, meta, arg) => {
        const { sub, exp } = jwt_decode<AuthTokenPayload>(response.data.token)
        return {
          ...response.data,
          sub,
        }
      },
    }),
    googleAuth: build.mutation<LoginData, GoogleLoginArg>({
      query: (data) => ({
        url: 'users/google',
        method: 'POST',
        data,
      }),
      transformResponse: (response: Response<LoginResponseData>, meta, arg) => {
        const { sub, exp } = jwt_decode<AuthTokenPayload>(response.data.token)
        return {
          ...response.data,
          sub,
        }
      },
    }),
    facebookAuth: build.mutation<LoginData, FacebookLoginArg>({
      query: (data) => ({
        url: 'users/facebook',
        method: 'POST',
        data,
      }),
      transformResponse: (response: Response<LoginResponseData>, meta, arg) => {
        const { sub, exp } = jwt_decode<AuthTokenPayload>(response.data.token)
        return {
          ...response.data,
          sub,
        }
      },
    }),
  }),
})

export const {
  useLoginMutation,
  useRequestResetPasswordMutation,
  useResetPasswordMutation,
  useAppleAuthMutation,
  useGoogleAuthMutation,
  useFacebookAuthMutation,
} = authApi
