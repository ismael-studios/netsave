import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from './axios'

const api = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
})

export default api
