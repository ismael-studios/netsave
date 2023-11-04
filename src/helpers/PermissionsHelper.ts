import { ShowAlert } from '../components'
import { Metrics } from '../common'
import {
  openLimitedPhotoLibraryPicker,
  request as REQUEST_PERMISSION,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions'

const { ifIOS } = Metrics

export const requestPhotoAccessPermission = (callback, showAlerts = true) => {
  const result = REQUEST_PERMISSION(
    ifIOS(PERMISSIONS.IOS.CAMERA, PERMISSIONS.ANDROID.CAMERA)
  )
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)'
          )
          ShowAlert({
            message:
              'Netsave does not have permission to access your camera / photos.',
          })
          callback(false)
          break
        case RESULTS.DENIED:
          console.log(
            'Netsave was denied permission to access your camera / photos'
          )
          showAlerts &&
            ShowAlert({
              message:
                'Netsave was denied permission to access your camera / photos.',
            })
          callback(false)
          break
        case RESULTS.GRANTED:
          console.log('PHOTO ACCESS permission is granted')
          callback(true)
          break
        case RESULTS.BLOCKED:
          showAlerts &&
            ShowAlert({
              message:
                'Requesting camera / photo access permission has been blocked by user.',
            })
          callback(false)
          break
      }
    })
    .catch((error) => {
      showAlerts && ShowAlert({ message: `Error: ${error}` })
      callback(false)
    })
}
