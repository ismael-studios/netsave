import { ifIOS } from '../common/Metrics'

export const GOOGLE_MAPS_API_KEY_IOS = 'AIzaSyAW9B4TyObxjVud0K21oU_wP3xvNEvwLLo'
export const GOOGLE_MAPS_API_KEY_ANDROID =
  'AIzaSyCi7d21MwOaxetIf8WKJG2TsyHFFYSreKo'
export const GOOGLE_MAPS_API_KEY = ifIOS(
  GOOGLE_MAPS_API_KEY_IOS,
  GOOGLE_MAPS_API_KEY_ANDROID
)
export const KEY_PN_TOKEN_DATA = 'KEY_PN_TOKEN_DATA'

export const SHIPPING = 'SHIPPING'
export const LOCAL_ONLINE = 'LOCAL_ONLINE'
export const LOCAL_CASH = 'LOCAL_CASH'
