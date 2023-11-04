import React, { useEffect, useState } from 'react'
import Text from '../Text'
import styles from './styles'
import * as Animatable from 'react-native-animatable'
import NetInfo from '@react-native-community/netinfo'

const OfflineBar = () => {
  const [initial, setInitial] = useState(true)
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(
      ({ isConnected, isInternetReachable }) => {
        const isOnline = isConnected && isInternetReachable
        if (isOnline) {
          setOffline(false)
        } else {
          setOffline(true)
        }
      }
    )

    return () => {
      unsubscribe()
    }
  }, [])

  return initial ? null : (
    <Animatable.View
      transition={['height', 'marginTop', 'paddingBottom']}
      easing="ease-out-expo"
      duration={1e3}
      style={[styles.container, !offline && styles.hidden]}
    >
      <Text style={styles.text}>
        You are {offline ? 'currently offline' : 'now online'}.
      </Text>
    </Animatable.View>
  )
}

export default OfflineBar
