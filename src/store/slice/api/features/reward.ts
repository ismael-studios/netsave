import api from '..'
import Rewards from '../../../../enums/Rewards'
import { Response, RewardTransaction } from '../../../../types'

const rewardApi = api.injectEndpoints({
  endpoints: (build) => ({
    redeemRewards: build.mutation<{ points: number }, Rewards>({
      query(data) {
        return {
          url: '/rewards/redeem',
          method: 'POST',
          data: {
            rewardId: data,
          },
        }
      },
      transformResponse: (
        response: Response<{
          points: number
        }>,
        meta,
        arg
      ) => response.data,
    }),
    getRewardTransactions: build.query<RewardTransaction[], void>({
      query: () => ({
        url: 'rewards/transactions',
        method: 'GET',
      }),
      transformResponse: (response: Response<RewardTransaction[]>, meta, arg) =>
        response.data,
    }),
  }),
})

export const { useRedeemRewardsMutation, useGetRewardTransactionsQuery } =
  rewardApi
