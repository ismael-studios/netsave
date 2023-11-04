import api from '..'
import algoliasearch from 'algoliasearch'
import { SearchResponse } from '@algolia/client-search'
import { ProductCondition, ProductType, Response } from '../../../../types'
import CONFIG from 'react-native-config'
import calculateDistance from '../../../../helpers/calculateDistance'
import { RootState } from '../../..'
import RNFetchBlob from 'rn-fetch-blob'

interface GetAllProductsResponseData {
  products: ProductType[]
  append: boolean
}

interface PostProductArg {
  userId: string
  product: {
    title?: string
    price?: number
    description?: string
    isNegotiable?: boolean
    categoryId?: number
    productConditionId?: number
  }
}

interface UpdateProductArg {
  userId: string
  product: Partial<ProductType>
}

interface UploadProductImageArg {
  productId: string
  images: { path: string }[]
  offset: number
  progressCallback: (image: { id: string; order: number; path: string }) => void
}

interface DeleteProductImageArg {
  userId: string
  productId: string
  imageId: string
}

const searchClient = algoliasearch(
  CONFIG.ALGOLIA_APP_ID || '',
  CONFIG.ALGOLIA_API_KEY || ''
)
const index = searchClient.initIndex('product')

export const productApi = api
  .enhanceEndpoints({
    addTagTypes: ['Product', 'UserProduct'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getAllProducts: build.query<
        GetAllProductsResponseData,
        {
          limit: number
          page: number
          qs?: string
          category?: string
          lat?: number | null
          lng?: number | null
          radius?: number | null
          priceRange?: string
        }
      >({
        async queryFn(params, _queryApi, _extraOptions, fetchWithBQ) {
          const numericFilters = []
          if (params.category) {
            numericFilters.push(`categoryId = ${params.category}`)
          }
          if (params.priceRange && params.priceRange !== 'null') {
            numericFilters.push(params.priceRange)
          }
          const results: SearchResponse<ProductType> =
            await index.search<ProductType>(params.qs || '', {
              hitsPerPage: params.limit,
              page: params.page,
              ...(numericFilters.length > 0 && {
                numericFilters,
              }),
              ...(params.lat &&
                params.lng &&
                params.radius && {
                  aroundLatLng: `${params.lat},${params.lng}`,
                  aroundRadius: Math.round(+params.radius * 1609.34),
                }),
            })
          return {
            data: {
              products: results.hits.map((hit) => ({
                ...hit,
                distance: `${calculateDistance(
                  params.lat || 0,
                  params.lng || 0,
                  hit._geoloc.lat,
                  hit._geoloc.lng
                ).toFixed(1)} miles`,
              })),
              append: params.page > 1,
            },
          }
        },
      }),
      getProductConditions: build.query<ProductCondition[], void>({
        query: () => ({ url: '/product-conditions', method: 'GET' }),
        transformResponse: (
          response: Response<ProductCondition[]>,
          meta,
          arg
        ) => response.data,
      }),
      postProduct: build.mutation<ProductType, PostProductArg>({
        query({ userId, product }) {
          return {
            url: `/users/${userId}/products`,
            method: 'POST',
            data: product,
          }
        },
        transformResponse: (response: Response<ProductType>, meta, arg) =>
          response.data,
      }),
      updateProduct: build.mutation<ProductType, UpdateProductArg>({
        query({ userId, product: { id: productId, ...product } }) {
          return {
            url: `users/${userId}/products/${productId}`,
            method: 'PUT',
            data: product,
          }
        },
        transformResponse: (response: Response<ProductType>, meta, arg) =>
          response.data,
        invalidatesTags: (result, error, arg) =>
          result
            ? [
                { type: 'Product', id: arg.product.id },
                { type: 'UserProduct', id: arg.userId },
              ]
            : [],
      }),
      deleteProductImage: build.mutation<number, DeleteProductImageArg>({
        query({ userId, productId, imageId }) {
          return {
            url: `/users/${userId}/products/${productId}/images/${imageId}`,
            method: 'DELETE',
          }
        },
        transformResponse: (response: Response<number>, meta, arg) =>
          response.data,
        invalidatesTags: (result, error, arg) =>
          result
            ? [
                { type: 'Product', id: arg.productId },
                { type: 'UserProduct', id: arg.userId },
              ]
            : [],
      }),
      uploadProductImages: build.mutation<
        { message: string },
        UploadProductImageArg
      >({
        async queryFn(
          { productId, images, offset, progressCallback },
          { getState, dispatch },
          _extraOptions,
          fetchWithBQ
        ) {
          const state = getState() as RootState
          if (!state.session.user) {
            return {
              error: {
                message: 'Error',
              },
            }
          }
          const userId = state.session.user.id
          const amount = images.length
          const uploadUrlsResult = await fetchWithBQ({
            url: `users/${userId}/products/${productId}/images/upload-urls?amount=${amount}`,
            method: 'GET',
          })
          if (uploadUrlsResult.error) {
            return {
              error: {
                message: 'Error',
              },
            }
          }
          const uploadUrl = uploadUrlsResult.data as {
            message: string
            data: {
              urls: {
                id: string
                url: string
              }[]
            }
          }
          const urls = uploadUrl.data.urls

          const completedImages = []
          for (let i = 0; i < amount; i++) {
            const imageId = urls[i].id
            const orderNumber = offset + i
            try {
              await RNFetchBlob.fetch(
                'PUT',
                urls[i].url,
                { 'Content-Type': 'image/jpeg' },
                RNFetchBlob.wrap(images[i].path)
              )

              completedImages.push({
                id: imageId,
                order: orderNumber,
              })
              // progressCallback({
              //   id: imageId,
              //   order: orderNumber,
              //   path: images[i].path,
              // })
            } catch (err) {
              console.warn(err)
              return {
                error: {
                  message: 'Error',
                },
              }
            }
          }

          await dispatch(
            productApi.endpoints.updateProduct.initiate({
              userId,
              product: {
                id: productId,
                images: completedImages,
              },
            })
          ).unwrap()

          return {
            data: {
              message: 'Success',
            },
          }
        },
      }),
      getUserProducts: build.query<
        ProductType[],
        {
          userId: string
          isPublished?: boolean
          isDraft?: boolean
          isSold?: boolean
          page?: number
        }
      >({
        query: ({ userId, ...params }) => ({
          url: `/users/${userId}/products`,
          method: 'GET',
          params,
        }),
        transformResponse: (response: Response<ProductType[]>, meta, arg) =>
          response.data,
        providesTags: (result, error, arg) =>
          result
            ? [
                {
                  type: 'UserProduct',
                  id: arg.userId,
                },
              ]
            : ['UserProduct'],
      }),
      getProductDetails: build.query<
        ProductType,
        { userId: string; productId: string }
      >({
        query: ({ userId, productId }) => ({
          url: `/users/${userId}/products/${productId}`,
          method: 'GET',
        }),
        transformResponse: (response: Response<ProductType>, meta, arg) =>
          response.data,
        providesTags: (result, error, arg) =>
          result ? [{ type: 'Product', id: arg.productId }] : ['Product'],
      }),
    }),
  })

export const {
  useGetAllProductsQuery,
  useGetProductConditionsQuery,
  useGetProductDetailsQuery,
  usePostProductMutation,
  useUpdateProductMutation,
  useUploadProductImagesMutation,
  useDeleteProductImageMutation,
  useGetUserProductsQuery,
} = productApi
