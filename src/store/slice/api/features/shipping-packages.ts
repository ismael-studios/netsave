import api from '..'
import { PackageSizeType, Response } from '../../../../types'

const shippingPackagesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getShippingPackages: build.query<PackageSizeType[], void>({
      query: () => ({ url: '/shipping-packages', method: 'GET' }),
      transformResponse: (response: Response<PackageSizeType[]>, meta, arg) =>
        response.data,
    }),
  }),
})

export const { useGetShippingPackagesQuery } = shippingPackagesApi
