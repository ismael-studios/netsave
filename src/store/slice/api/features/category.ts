import api from '..'
import { Category, Response } from '../../../../types'

const categoryApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query<Category[], void>({
      query: () => ({ url: '/categories', method: 'GET' }),
      transformResponse: (response: Response<Category[]>, meta, arg) =>
        response.data,
    }),
  }),
})

export const { useGetCategoriesQuery } = categoryApi
