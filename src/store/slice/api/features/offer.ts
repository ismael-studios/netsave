import api from '..'
import { Offer, Response } from '../../../../types'

interface PostOfferArg {
  userId: string
  productId: string
  data: {
    price?: number
    description?: string
  }
}

interface PutOfferArg {
  userId: string
  productId: string
  offerId: string
  data: {
    statusId: number
    response?: string
    counterPrice?: number
    counterDescription?: string
  }
}

const offerApi = api
  .enhanceEndpoints({
    addTagTypes: ['UserOffer'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getOffers: build.query<Offer[], string>({
        query: (userId) => ({
          url: `users/${userId}/products/offers`,
          method: 'GET',
        }),
        transformResponse: (response: Response<Offer[]>, meta, arg) =>
          response.data,
        providesTags: ['UserOffer'],
      }),
      postOffer: build.mutation<Offer, PostOfferArg>({
        query: ({ userId, productId, data }) => ({
          url: `users/${userId}/products/${productId}/offers`,
          method: 'POST',
          data,
        }),
        transformResponse: (response: Response<Offer>, meta, arg) =>
          response.data,
        invalidatesTags: (result, error, arg) => (result ? ['UserOffer'] : []),
      }),
      putOffer: build.mutation<Offer, PutOfferArg>({
        query: ({ userId, productId, offerId, data }) => ({
          url: `users/${userId}/products/${productId}/offers/${offerId}`,
          method: 'PUT',
          data,
        }),
        transformResponse: (response: Response<Offer>, meta, arg) =>
          response.data,
        invalidatesTags: (result, error, arg) => (result ? ['UserOffer'] : []),
      }),
    }),
  })

export const { useGetOffersQuery, usePostOfferMutation, usePutOfferMutation } =
  offerApi
