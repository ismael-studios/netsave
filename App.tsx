import React, { useEffect, useState } from 'react'
import {
  AppState,
  View,
  LogBox,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Dimensions,
  StatusBar,
  Keyboard,
} from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { OfflineBar } from './src/components'
import AlertDialog from './src/components/AlertDialog'
import { Metrics } from './src/common'
import Orientation from 'react-native-orientation-locker'
import ForceUpdateScreen from './src/screens/ForceUpdateScreen'
import * as Sentry from '@sentry/react-native'
import CONFIG from 'react-native-config'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ErrorBoundary } from './src/components'
import SplashScreen from 'react-native-splash-screen'
import { StripeProvider } from '@stripe/stripe-react-native'
import Notifications from './src/components/Notifications'
import SiftReactNative from 'sift-react-native'
import { KEY_PN_TOKEN_DATA } from './src/constants/constants'
import AppNavigator from './src/navigation'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useStreamChatTheme } from './src/screens/ChatScreen/useStreamChatTheme'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { persistor, store } from './src/store'
import { infoApi } from './src/store/slice/api/features/info'
import { resetApp } from './src/store/slice/appSlice'
import { resetOffers } from './src/store/slice/offersSlice'
import { resetProducts } from './src/store/slice/productsSlice'

Sentry.init({
  dsn: CONFIG.SENTRY_DSN,
  environment: CONFIG.ENV,
})

SiftReactNative.setSiftConfig(
  CONFIG.SIFT_ACCOUNT_ID,
  CONFIG.SIFT_BEACON_KEY,
  true,
  '',
  false
)

GoogleSignin.configure({
  webClientId: CONFIG.GOOGLE_WEB_CLIENT_ID,
})

const { ifIOS } = Metrics

// yellowbox
LogBox.ignoreLogs([
  'Please instead use `remove()` on the subscription returned by `EventEmitter.addListener',
  "Seems like you're using an old API with gesture components, check out new Gestures system!",
])

function App() {
  const [forceUpdate, setForceUpdate] = useState(false)
  const { width, height } = Dimensions.get('window')
  const screenStyle = { width, height, flex: 1 }
  const handleAppError = () => {
    store.dispatch(resetProducts())
    store.dispatch(resetOffers())
    store.dispatch(resetApp())
  }
  Orientation.lockToPortrait()

  useEffect(() => {
    const cleanup = async () => {
      await AsyncStorage.removeItem(KEY_PN_TOKEN_DATA)
      await AsyncStorage.removeItem('ENV_REF')
    }
    cleanup()
    const checkAppVersion = async () => {
      try {
        const result = store.dispatch(
          infoApi.endpoints.checkAppVersion.initiate()
        )
        try {
          const res = await result.unwrap()
          setForceUpdate(res.force)
        } catch (err) {
          setForceUpdate(false)
        }
        result.unsubscribe()
      } catch (error) {
        console.log(error)
        setForceUpdate(false)
      }
    }

    checkAppVersion()

    const handleAppStateChange = async (nextAppState: string) => {
      if (nextAppState === 'active') {
        checkAppVersion()
      }
    }

    const sub = AppState.addEventListener('change', handleAppStateChange)

    // hide splash
    setTimeout(SplashScreen.hide, 300)

    return () => {
      sub.remove()
    }
  }, [])
  const theme = useStreamChatTheme()

  return (
    <StripeProvider
      publishableKey={CONFIG.STRIPE_PUBLISHABLE_KEY}
      urlScheme="netsave" // required for 3D Secure and bank redirects
      merchantIdentifier="merchant.com.netsave.netsave" // required for Apple Pay
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar barStyle={`${ifIOS('dark', 'light')}-content`} />
          {forceUpdate ? (
            <ForceUpdateScreen />
          ) : (
            <SafeAreaProvider
              style={{ backgroundColor: theme.colors?.white_snow || '#FCFCFC' }}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                  style={{
                    width: Metrics.screenWidth,
                    height: Metrics.screenHeight,
                  }}
                  behavior={ifIOS('padding', 'height')}
                >
                  <ErrorBoundary onError={handleAppError}>
                    <View style={screenStyle}>
                      <AppNavigator />
                      <AlertDialog />
                      <OfflineBar />
                      <Notifications />
                    </View>
                  </ErrorBoundary>
                </KeyboardAvoidingView>
              </TouchableWithoutFeedback>
            </SafeAreaProvider>
          )}
        </PersistGate>
      </Provider>
    </StripeProvider>
  )
}

export default App
