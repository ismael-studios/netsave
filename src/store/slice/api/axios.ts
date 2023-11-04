import { BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { AxiosError, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { API_URL } from '../../../services/ApiConstants'
import createAuthRefreshInterceptor, {
  AxiosAuthRefreshRequestConfig,
} from 'axios-auth-refresh'
import { Platform } from 'react-native'
import { store } from '../../index'
import { AUTH } from '../../../services/ApiURIs'

import DeviceInfo from 'react-native-device-info'
import { logout, setTokens } from '../sessionSlice'
import jwt_decode from 'jwt-decode'
import { AuthTokenPayload } from '../../../types'

const deviceId = DeviceInfo.getUniqueId()

const Api = axios.create({
  // base URL is read from the "constructor"
  baseURL: API_URL,
  // here are some default headers
  headers: {
    'Cache-Control': 'no-cache',
  },
  // 25 second timeout...
  timeout: 25e3,
})

Api.interceptors.request.use((request) => {
  const token = store.getState().session.token
  // console.log(
  //   Platform.OS,
  //   request.url,
  //   request.method,
  //   (request.headers?.Authorization || '-------').slice(
  //     (request.headers?.Authorization || '-------').length - 5
  //   ),
  //   cachedToken.slice(cachedToken.length - 5)
  // )
  if (request.url !== 'users/login') {
    // don't overwrite refresh token
    if (token && request.headers) {
      request.headers.Authorization = `Bearer ${token}`
    }
  }
  return request
})

// Function that will be called to refresh authorization
const refreshAuthLogic = async ({ config }: any) => {
  console.log(Platform.OS, 'refreshAuthLogic', config.url)
  const { refreshToken: sessionRefreshToken } = store.getState().session

  try {
    const { data } = await Api.put<{
      message: string
      data: { token: string; refreshToken: string }
    }>(
      AUTH.LOGIN_REFRESH,
      {
        deviceId,
      },
      {
        headers: { Authorization: `Bearer ${sessionRefreshToken}` },
        skipAuthRefresh: true,
      } as AxiosAuthRefreshRequestConfig
    )
    const { token, refreshToken } = data.data
    const { sub } = jwt_decode<AuthTokenPayload>(token)
    store.dispatch(setTokens({ sub, token, refreshToken }))
  } catch (error) {
    console.log(error)
    console.log('dispatch logout')
    store.dispatch(logout())
    throw new Error('Unauthorized')
  }
  console.log(Platform.OS, 'promise resolved')
  return Promise.resolve()
}

createAuthRefreshInterceptor(Api, refreshAuthLogic)
Api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.warn(Platform.OS, error)
    const status = error.response ? error.response.status : null
    const data = error.response ? error.response.data : null
    console.warn(Platform.OS, status, data)
    return Promise.reject(error)
  }
)

export const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string
      method: AxiosRequestConfig['method']
      data?: AxiosRequestConfig['data']
      params?: AxiosRequestConfig['params']
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }, { getState }) => {
    try {
      const result = await Api({ url, method, data, params })
      return { data: result.data }
    } catch (axiosError) {
      let err = axiosError as AxiosError
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      }
    }
  }
