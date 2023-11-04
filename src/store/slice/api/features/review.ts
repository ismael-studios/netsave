import api from '..'
import {
  ProductTransactionReviewCriteria,
  ProductTransactionReviewCriteriaType,
  Response,
  ReviewType,
} from '../../../../types'

interface GetReviewsArg {
  userId: string
  type: ProductTransactionReviewCriteriaType
}

interface PostReviewArg {
  userId: string
  productId: string
  transactionId: string
  data: {
    details: { id: number; rating: number }[]
    description?: string
  }
}

interface ReportReviewArg {
  userId: string
  productId: string
  transactionId: string
  reviewId: string
  data: {
    description: string
  }
}

const reviewApi = api.injectEndpoints({
  endpoints: (build) => ({
    getReviewCriterias: build.query<
      ProductTransactionReviewCriteria[],
      ProductTransactionReviewCriteriaType
    >({
      query: (type) => ({
        url: 'product-transaction-review-criterias',
        method: 'GET',
        params: {
          type,
        },
      }),
      transformResponse: (
        response: Response<ProductTransactionReviewCriteria[]>,
        meta,
        arg
      ) => response.data,
    }),
    getReviews: build.query<ReviewType[], GetReviewsArg>({
      query: ({ userId, type }) => ({
        url: `users/${userId}/products/transactions/reviews`,
        method: 'GET',
        params: {
          type,
        },
      }),
      transformResponse: (response: Response<ReviewType[]>, meta, arg) =>
        response.data,
    }),
    postReview: build.mutation<ReviewType, PostReviewArg>({
      query: ({ userId, productId, transactionId, data }) => ({
        url: `users/${userId}/products/${productId}/transactions/${transactionId}/reviews`,
        method: 'POST',
        data,
      }),
      transformResponse: (response: Response<ReviewType>, meta, arg) =>
        response.data,
    }),
    reportReview: build.mutation<Response<undefined>, ReportReviewArg>({
      query: ({ userId, productId, transactionId, reviewId, data }) => ({
        url: `users/${userId}/products/${productId}/transactions/${transactionId}/reviews/${reviewId}/reports`,
        method: 'POST',
        data,
      }),
    }),
  }),
})

export const {
  useGetReviewCriteriasQuery,
  useGetReviewsQuery,
  usePostReviewMutation,
  useReportReviewMutation,
} = reviewApi
