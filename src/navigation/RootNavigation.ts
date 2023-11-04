import { createNavigationContainerRef } from '@react-navigation/native'

export const navigationRef = createNavigationContainerRef()

export function navigate(arg, params?) {
  if (navigationRef.isReady()) {
    if (params) {
      navigationRef.navigate(arg, params)
    } else {
      navigationRef.navigate(arg)
    }
  } else {
    setTimeout(() => {
      navigate(arg, params)
    }, 300)
  }
}
