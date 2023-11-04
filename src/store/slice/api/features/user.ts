import RNFetchBlob from 'rn-fetch-blob'
import api from '..'
import { RootState } from '../../..'
import {
  Balance,
  BalanceTransaction,
  ExternalAccount,
  Follower,
  ProductLike,
  Response,
  ShippingAddressType,
  UserType,
} from '../../../../types'

interface PostUserArg {
  email: string
  password: string
}

interface VerifyUserArg {
  email: string
  code: number
}

interface VerifyEmailArg {
  email: string
}

interface VerifyPhoneArg {
  code: number
}

interface UploadProfileImageArg {
  image: string
}
interface PutFirebaseTokenArg {
  fcmToken: string
  deviceId: string
}

interface PostAddressArg {
  name: string
  line1: string
  line2?: string
  city: string
  region: string
  postalCode: string
  country: string
  isPrimary: boolean
}

interface FollowUserArg {
  userId: string
  data: {
    followerId: string
  }
}

interface UnfollowUserArg {
  userId: string
  followerId: string
}

interface GetProductLikesArg {
  userId: string
  page?: number
}

interface LikeProductArg {
  userId: string
  productId: string
}

interface UnlikeProductArg {
  userId: string
  productId: string
}

interface PostBalanceTransactionArg {
  userId: string
  data: {
    amount: number
  }
}

interface PostExternalAccountArg {
  userId: string
  data: {
    firstName: string
    lastName: string
    dob: {
      day: number
      month: number
      year: number
    }
    ssnLast4: string
    routingNumber: string
    accountNumber: string
  }
}

interface DeleteUserArg {
  userId: string
}

export const userApi = api
  .enhanceEndpoints({
    addTagTypes: [
      'Follower',
      'ProductLike',
      'ExternalAccount',
      'BalanceTransaction',
    ],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getUser: build.query<UserType, string>({
        query: (id) => ({ url: `/users/${id}`, method: 'GET' }),
        transformResponse: (response: Response<UserType>, meta, arg) =>
          response.data,
        // providesTags: ['User'],
      }),
      postUser: build.mutation<UserType, PostUserArg>({
        query(data) {
          return {
            url: '/users',
            method: 'POST',
            data,
          }
        },
        transformResponse: (response: Response<UserType>, meta, arg) =>
          response.data,
      }),
      updateUser: build.mutation<
        UserType,
        {
          id: string
        } & Partial<UserType>
      >({
        query({ id, ...data }) {
          return {
            url: `/users/${id}`,
            method: 'PATCH',
            data,
          }
        },
        transformResponse: (response: Response<UserType>, meta, arg) =>
          response.data,
        async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled
            dispatch(
              userApi.util.updateQueryData('getUser', id, (draft) => {
                Object.assign(draft, data)
              })
            )
          } catch {}
        },
      }),
      verifyEmail: build.mutation<Response<undefined>, VerifyUserArg>({
        query(data) {
          return {
            url: '/users/verify',
            method: 'PUT',
            data,
          }
        },
      }),
      verifyEmailRequest: build.mutation<Response<undefined>, VerifyEmailArg>({
        query(data) {
          return {
            url: '/users/verify',
            method: 'POST',
            data,
          }
        },
      }),
      verifyPhone: build.mutation<Response<undefined>, VerifyPhoneArg>({
        query(data) {
          return {
            url: '/users/verify-phone',
            method: 'PUT',
            data,
          }
        },
      }),
      verifyPhoneRequest: build.mutation<Response<undefined>, void>({
        query(data) {
          return {
            url: '/users/verify-phone',
            method: 'POST',
            data,
          }
        },
      }),
      uploadProfileImage: build.mutation<
        { profileImageId: string },
        UploadProfileImageArg
      >({
        async queryFn(
          { image },
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
          const id = state.session.user.id
          const uploadUrlsResult = await fetchWithBQ({
            url: `/users/${id}/images/upload-urls`,
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
              url: string
              id: string
            }
          }

          try {
            await RNFetchBlob.fetch(
              'PUT',
              uploadUrl.data.url,
              { 'Content-Type': 'image/jpeg' },
              RNFetchBlob.wrap(image)
            )
            await dispatch(
              userApi.endpoints.updateUser.initiate({
                id,
                profileImageId: uploadUrl.data.id,
              })
            ).unwrap()
            return {
              data: {
                profileImageId: uploadUrl.data.id,
              },
            }
          } catch (err) {
            console.warn(err)
            return {
              error: {
                message: 'Error',
              },
            }
          }
        },
      }),
      getChatToken: build.query<string, string>({
        query: (id) => ({ url: `/users/${id}/chat-token`, method: 'GET' }),
        transformResponse: (response: Response<string>, meta, arg) =>
          response.data,
      }),
      putFirebaseToken: build.mutation<Response<{}>, PutFirebaseTokenArg>({
        query(data) {
          return {
            url: '/fcm-token',
            method: 'PUT',
            data,
          }
        },
      }),
      getAddresses: build.query<ShippingAddressType[], string>({
        query: (id) => ({ url: `users/${id}/addresses`, method: 'GET' }),
        transformResponse: (
          response: Response<ShippingAddressType[]>,
          meta,
          arg
        ) => response.data,
      }),
      postAddress: build.mutation<
        Response<ShippingAddressType>,
        PostAddressArg
      >({
        query(data) {
          return {
            url: '/addresses',
            method: 'POST',
            data,
          }
        },
      }),
      getFollowers: build.query<Follower[], string>({
        query: (id) => ({ url: `users/${id}/followers`, method: 'GET' }),
        transformResponse: (response: Response<Follower[]>, meta, arg) =>
          response.data,
        providesTags: (result, error, arg) =>
          result
            ? [
                {
                  type: 'Follower',
                  id: arg,
                },
              ]
            : ['Follower'],
      }),
      getFollowing: build.query<Follower[], string>({
        query: (id) => ({ url: `users/${id}/following`, method: 'GET' }),
        transformResponse: (response: Response<Follower[]>, meta, arg) =>
          response.data,
      }),
      followUser: build.mutation<Response<Follower>, FollowUserArg>({
        query({ userId, data }) {
          return {
            url: `users/${userId}/followers`,
            method: 'POST',
            data,
          }
        },
        invalidatesTags: (result, error, arg) =>
          result ? [{ type: 'Follower', id: arg.userId }] : [],
      }),
      unfollowUser: build.mutation<Response<number>, UnfollowUserArg>({
        query({ userId, followerId }) {
          return {
            url: `users/${userId}/followers/${followerId}`,
            method: 'DELETE',
          }
        },
        invalidatesTags: (result, error, arg) =>
          result ? [{ type: 'Follower', id: arg.userId }] : [],
      }),
      getProductLikes: build.query<ProductLike[], GetProductLikesArg>({
        query: ({ userId, page }) => ({
          url: `users/${userId}/product-likes`,
          method: 'GET',
          params: {
            ...(page && {
              page,
            }),
          },
        }),
        transformResponse: (response: Response<ProductLike[]>, meta, arg) =>
          response.data,
        providesTags: ['ProductLike'],
      }),
      likeProduct: build.mutation<Response<ProductLike>, LikeProductArg>({
        query({ userId, productId }) {
          return {
            url: `users/${userId}/products/${productId}/likes`,
            method: 'POST',
          }
        },
        invalidatesTags: (result, error, arg) =>
          result ? ['ProductLike'] : [],
      }),
      unlikeProduct: build.mutation<Response<number>, UnlikeProductArg>({
        query({ userId, productId }) {
          return {
            url: `users/${userId}/products/${productId}/likes`,
            method: 'DELETE',
          }
        },
        invalidatesTags: (result, error, arg) =>
          result ? ['ProductLike'] : [],
      }),
      getBalance: build.query<Balance, string>({
        query: (id) => ({ url: `users/${id}/balance`, method: 'GET' }),
        transformResponse: (response: Response<Balance>, meta, arg) =>
          response.data,
      }),
      getBalanceTransactions: build.query<BalanceTransaction[], string>({
        query: (id) => ({
          url: `users/${id}/balance-transactions`,
          method: 'GET',
        }),
        transformResponse: (
          response: Response<BalanceTransaction[]>,
          meta,
          arg
        ) => response.data,
        providesTags: (result, error, arg) =>
          result
            ? [
                {
                  type: 'BalanceTransaction',
                  id: arg,
                },
              ]
            : ['BalanceTransaction'],
      }),
      postBalanceTransactions: build.mutation<{}, PostBalanceTransactionArg>({
        query: ({ userId, data }) => ({
          url: `users/${userId}/balance-transactions`,
          method: 'POST',
          data,
        }),
        transformResponse: (response: Response<{}>, meta, arg) => response.data,
        invalidatesTags: (result, error, arg) =>
          result ? ['BalanceTransaction'] : [],
      }),
      getExternalAccounts: build.query<ExternalAccount[], string>({
        query: (id) => ({
          url: `users/${id}/external-accounts`,
          method: 'GET',
        }),
        transformResponse: (response: Response<ExternalAccount[]>, meta, arg) =>
          response.data,
        providesTags: (result, error, arg) =>
          result
            ? [
                {
                  type: 'ExternalAccount',
                  id: arg,
                },
              ]
            : ['ExternalAccount'],
      }),
      postExternalAccounts: build.mutation<void, PostExternalAccountArg>({
        query: ({ userId, data }) => ({
          url: `users/${userId}/external-accounts`,
          method: 'POST',
          data,
        }),
        transformResponse: (response: Response<void>, meta, arg) =>
          response.data,
        invalidatesTags: (result, error, arg) =>
          result ? ['ExternalAccount'] : [],
      }),
      deleteUser: build.mutation<Response<undefined>, DeleteUserArg>({
        query({ userId }) {
          return {
            url: `users/${userId}`,
            method: 'DELETE',
          }
        },
      }),
    }),
  })

export const {
  useGetUserQuery,
  usePostUserMutation,
  useUpdateUserMutation,
  useVerifyEmailMutation,
  useVerifyEmailRequestMutation,
  useVerifyPhoneMutation,
  useVerifyPhoneRequestMutation,
  useUploadProfileImageMutation,
  usePutFirebaseTokenMutation,
  useGetAddressesQuery,
  usePostAddressMutation,
  useGetFollowersQuery,
  useGetFollowingQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetProductLikesQuery,
  useLikeProductMutation,
  useUnlikeProductMutation,
  useGetBalanceQuery,
  useGetBalanceTransactionsQuery,
  usePostBalanceTransactionsMutation,
  useGetExternalAccountsQuery,
  usePostExternalAccountsMutation,
  useDeleteUserMutation,
} = userApi
