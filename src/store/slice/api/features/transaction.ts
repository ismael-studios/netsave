import api from '..'
import {
  LOCAL_CASH,
  LOCAL_ONLINE,
  SHIPPING,
} from '../../../../constants/constants'
import { Response, TransactionType } from '../../../../types'

interface GetTransactionArg {
  userId: string
  productId: string
  transactionId: string
}

interface GetTransactionByIdArg {
  transactionId: string
  params?: {
    expand: string[]
  }
}

interface PostPaymentRequestArg {
  userId: string
  productId: string
  transactionId: string
  data: {
    type: typeof SHIPPING | typeof LOCAL_ONLINE | typeof LOCAL_CASH
    toAddressId?: string
    points?: number
  }
}

interface PostPaymentRequestResponseData {
  clientSecret: string
}

interface GetPickupCodeArg {
  userId: string
  productId: string
  transactionId: string
}

interface GetPickupCodeResponseData {
  code: string
}

interface VerifyPickupCodeArg {
  userId: string
  productId: string
  transactionId: string
  data: {
    code: number
  }
}

interface PutTransactionArg {
  userId: string
  productId: string
  transactionId: string
  data: {
    transactionStatusId: number
    info?: string
  }
}

interface DisputeTransactionArg {
  userId: string
  productId: string
  transactionId: string
  data: {
    description: string
  }
}

const transactionApi = api
  .enhanceEndpoints({
    addTagTypes: ['Transaction'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getTransaction: build.query<TransactionType, GetTransactionArg>({
        query: ({ userId, productId, transactionId }) => ({
          url: `users/${userId}/products/${productId}/transactions/${transactionId}`,
          method: 'GET',
        }),
        transformResponse: (response: Response<TransactionType>, meta, arg) =>
          response.data,
        providesTags: (result, error, arg) =>
          result
            ? [{ type: 'Transaction', id: arg.transactionId }]
            : ['Transaction'],
      }),
      getTransactionById: build.query<TransactionType, GetTransactionByIdArg>({
        query: ({ transactionId, params }) => ({
          url: `transactions/${transactionId}`,
          method: 'GET',
          params,
        }),
        transformResponse: (response: Response<TransactionType>, meta, arg) =>
          response.data,
        providesTags: (result, error, arg) =>
          result
            ? [{ type: 'Transaction', id: arg.transactionId }]
            : ['Transaction'],
      }),
      postPaymentRequest: build.mutation<
        PostPaymentRequestResponseData,
        PostPaymentRequestArg
      >({
        query({ userId, productId, transactionId, data }) {
          return {
            url: `users/${userId}/products/${productId}/transactions/${transactionId}/payments`,
            method: 'POST',
            data,
          }
        },
        transformResponse: (
          response: Response<PostPaymentRequestResponseData>,
          meta,
          arg
        ) => response.data,
        invalidatesTags: (result, error, arg) =>
          result ? [{ type: 'Transaction', id: arg.transactionId }] : [],
      }),
      getPickupCode: build.query<GetPickupCodeResponseData, GetPickupCodeArg>({
        query: ({ userId, productId, transactionId }) => ({
          url: `users/${userId}/products/${productId}/transactions/${transactionId}/pickups`,
          method: 'GET',
        }),
        transformResponse: (
          response: Response<GetPickupCodeResponseData>,
          meta,
          arg
        ) => response.data,
      }),
      verifyPickupCode: build.mutation<TransactionType, VerifyPickupCodeArg>({
        query: ({ userId, productId, transactionId, data }) => ({
          url: `users/${userId}/products/${productId}/transactions/${transactionId}/pickups`,
          method: 'PUT',
          data,
        }),
        transformResponse: (response: Response<TransactionType>, meta, arg) =>
          response.data,
        invalidatesTags: (result, error, arg) =>
          result ? [{ type: 'Transaction', id: arg.transactionId }] : [],
      }),
      putTransaction: build.mutation<TransactionType, PutTransactionArg>({
        query: ({ userId, productId, transactionId, data }) => ({
          url: `users/${userId}/products/${productId}/transactions/${transactionId}`,
          method: 'PUT',
          data,
        }),
        transformResponse: (response: Response<TransactionType>, meta, arg) =>
          response.data,
        invalidatesTags: (result, error, arg) =>
          result ? [{ type: 'Transaction', id: arg.transactionId }] : [],
      }),
      disputeTransaction: build.mutation<
        Response<undefined>,
        DisputeTransactionArg
      >({
        query: ({ userId, productId, transactionId, data }) => ({
          url: `users/${userId}/products/${productId}/transactions/${transactionId}/disputes`,
          method: 'POST',
          data,
        }),
      }),
    }),
  })

export const {
  useGetTransactionQuery,
  useGetTransactionByIdQuery,
  usePostPaymentRequestMutation,
  useGetPickupCodeQuery,
  useVerifyPickupCodeMutation,
  usePutTransactionMutation,
  useDisputeTransactionMutation,
} = transactionApi
