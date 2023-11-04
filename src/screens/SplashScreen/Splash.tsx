import React, { useEffect } from 'react'
import { View, Linking } from 'react-native'
import styles from './SplashStyles'
import { DeepLinkHelper } from '../../helpers'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { resetUsersCache } from '../../store/slice/sessionSlice'
import { setIsInitialized } from '../../store/slice/appSlice'

const SplashScreen = () => {
  const dispatch = useAppDispatch()
  const { user, signedIn, token, refreshToken } = useAppSelector(
    (state) => state.session
  )

  useEffect(() => {
    dispatch(resetUsersCache())
    // CUSTOM DEEP LINKING
    Linking.getInitialURL().then(DeepLinkHelper.openURL)
    Linking.addEventListener('url', DeepLinkHelper.openURL)
    // /CUSTOM DEEP LINKING
  }, [dispatch])

  useEffect(() => {
    if (user && user.id && signedIn) {
      // dispatch(initializeChat(user))
    }
    dispatch(setIsInitialized(true))
  }, [dispatch, user, signedIn, token, refreshToken])

  return <View style={styles.container} />
}

export default SplashScreen
