import api from '..'
import { Response, TrackData } from '../../../../types'

interface GetShipmentLabelArg {
  shipmentId: string
  email?: string
}

interface GetShipmentLabelData {
  labelUrl: string
}

interface PostShipmentLabelArg {
  shipmentId: string
  data: {
    userId: string
    productId: string
    transactionId: string
    fromAddressId: string
    declaredValue?: number
  }
}

interface PostShipmentLabelResponseData {
  labelUrl: string
}

const shipmentApi = api.injectEndpoints({
  endpoints: (build) => ({
    getShipmentLabel: build.query<GetShipmentLabelData, GetShipmentLabelArg>({
      query: ({ shipmentId, email }) => ({
        url: `shipments/${shipmentId}/labels`,
        method: 'GET',
        ...(email && {
          params: {
            email,
          },
        }),
      }),
      transformResponse: (
        response: Response<GetShipmentLabelData>,
        meta,
        arg
      ) => response.data,
    }),
    postShipmentLabel: build.mutation<
      PostShipmentLabelResponseData,
      PostShipmentLabelArg
    >({
      query: ({ shipmentId, data }) => ({
        url: `shipments/${shipmentId}/labels`,
        method: 'POST',
        data,
      }),
      transformResponse: (
        response: Response<PostShipmentLabelResponseData>,
        meta,
        arg
      ) => response.data,
    }),
    getTracks: build.query<TrackData, string>({
      query: (shipmentId) => ({
        url: `shipments/${shipmentId}/tracks`,
        method: 'GET',
      }),
      transformResponse: (response: Response<TrackData>, meta, arg) =>
        response.data,
    }),
  }),
})

export const {
  useGetShipmentLabelQuery,
  usePostShipmentLabelMutation,
  useGetTracksQuery,
} = shipmentApi
