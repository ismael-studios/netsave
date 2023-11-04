import { ShowAlert } from '../components'
import { Metrics } from '../common'
import {
  check as CHECK_PERMISSION,
  request as REQUEST_PERMISSION,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions'
import { GOOGLE_MAPS_API_KEY } from '../constants/constants'
import GetLocation from 'react-native-get-location'
import { pathOr } from 'ramda'

const { ifIOS } = Metrics
const DEFAULT_LOCATION = {
  latitude: 34.026990488886035,
  longitude: -118.26481820907723,
}
const DEF_LOC = {
  lat: DEFAULT_LOCATION.latitude,
  lng: DEFAULT_LOCATION.longitude,
}

// for location based tracking simple things
let tempVarialbe: any = null
export const setTempVariable = (value: any) => (tempVarialbe = value)
export const getTempVariable = (fallback: any) => tempVarialbe || fallback

type HasPermissionCallBack = (param: {
  success: boolean
  hasPermission: boolean
  location?: { latitude: number; longitude: number }
}) => void

type CheckPermissionCallBack = (success: boolean, message: string) => void

type LocationCallback = (location: {
  success: boolean
  error?: string
  message?: string
  city?: string
  region?: string
  zipCode?: number | string
  latitude?: number
  longitude?: number
  address?: string
}) => void

export const requestLocationPermission = (
  callback: HasPermissionCallBack,
  showAlerts = true
) => {
  REQUEST_PERMISSION(
    ifIOS(
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    )
  )
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)'
          )
          showAlerts &&
            ShowAlert({
              message: 'We are unable to fetch your location.',
            })
          callback({ success: false, hasPermission: false })
          break
        case RESULTS.DENIED:
          console.log(
            'LOCATION permission has not been requested / is denied but requestable'
          )
          showAlerts &&
            ShowAlert({
              message:
                'Netsave does not have permission to access your location.',
            })
          callback({ success: false, hasPermission: false })
          break
        case RESULTS.GRANTED:
          console.log('LOCATION permission is granted')
          GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
          })
            .then((location) => {
              console.log('LOCATION', location)
              callback({ success: true, hasPermission: true, location })
            })
            .catch((error) => {
              const { code, message } = error
              console.warn(code, message)
              showAlerts &&
                code === 'UNAVAILABLE' &&
                ShowAlert({
                  message:
                    'Turn on your location setting on your phone to use location sharing.',
                })
              callback({ success: false, hasPermission: false })
            })
          break
        case RESULTS.BLOCKED:
          showAlerts &&
            ShowAlert({
              message:
                'Turn on your location setting on your phone to use location sharing.',
            })
          callback({ success: false, hasPermission: false })
          break
        default:
          showAlerts &&
            ShowAlert({
              message:
                'Turn on your location setting on your phone to use location sharing.',
            })
          callback({ success: false, hasPermission: false })
          break
      }
    })
    .catch((error) => {
      showAlerts && ShowAlert({ message: `Error: ${error}` })
      callback({ success: false, hasPermission: false })
    })
}

export const checkLocationPermission = (callback: CheckPermissionCallBack) => {
  CHECK_PERMISSION(
    ifIOS(
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    )
  )
    .then((result) => {
      callback(RESULTS.GRANTED === result, result)
    })
    .catch((error) => {
      callback(false, error)
    })
}

export const reverseAddress = async (
  location: string,
  callback: LocationCallback,
  showAlerts = false
) => {
  // fetch
  if (location) {
    const geocode = 'https://maps.google.com/maps/api/geocode/json'
    fetch(
      `${geocode}?key=${GOOGLE_MAPS_API_KEY}&address=${encodeURI(location)}`
    )
      .then((res) => res.json())
      .then((data) => {
        const locationResult = pathOr(
          DEF_LOC,
          ['results', '0', 'geometry', 'location'],
          data
        )
        const address = pathOr(
          'Riverside, CA 92501, USA',
          ['results', '0', 'formatted_address'],
          data
        )
        const [country, region, city] = address.split(/, /g).reverse()
        callback &&
          callback({
            success: true,
            city: city,
            region: region.replace(/( [0-9]+)/g, ''),
            zipCode: region.replace(/([^0-9])/g, ''),
            latitude: locationResult.lat,
            longitude: locationResult.lng,
            address: address,
          })
      })
      .catch((error) => {
        console.log('REVERSE ADDRESS ERROR', error, error?.message)
        callback &&
          callback({
            success: false,
            error: error,
            message: error?.message,
          })
        showAlerts &&
          ShowAlert({
            message: 'We are unable to fetch your location. Try again',
          })
      })
  }
}
