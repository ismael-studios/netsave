import { Platform } from 'react-native'
import VersionNumber from 'react-native-version-number'
import api from '..'
import { Response } from '../../../../types'

interface GetUserLocationResponseData {
  city: string
  region: string
  country: string
  lat: string
  lng: string
  postalCode: string
}

interface CheckAppVersionResponseData {
  force: boolean
  updateAvailable: boolean
}

export const infoApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUserLocation: build.query<GetUserLocationResponseData, void>({
      query: () => ({ url: '/info/location', method: 'GET' }),
      transformResponse: (
        response: Response<GetUserLocationResponseData>,
        meta,
        arg
      ) => response.data,
    }),
    checkAppVersion: build.query<CheckAppVersionResponseData, void>({
      query: () => ({
        url: '/info/mobile-app-versions',
        method: 'GET',
        params: {
          platform: Platform.OS,
          version: VersionNumber.appVersion.split('-')[0],
        },
      }),
      transformResponse: (
        response: Response<CheckAppVersionResponseData>,
        meta,
        arg
      ) => response.data,
    }),
  }),
})

export const { useGetUserLocationQuery } = infoApi
