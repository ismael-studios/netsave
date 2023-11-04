import React, { useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { Header, SafeAreaView } from '../../components'
import { Colors } from '../../common'
import styles from './styles'
import WebView from 'react-native-webview'
import Metrics from '../../common/Metrics'
import { MainStackScreenProps } from '../../navigation/types'

const WebViewScreen = ({ route }: MainStackScreenProps<'WebScreen'>) => {
  const { uri } = route.params
  const [loading, setLoading] = useState(true)

  const onWebViewLoad = () => setLoading(true)
  const onWebViewLoadEnd = () => setLoading(false)

  return (
    <SafeAreaView style={styles.container}>
      <Header tight showLogo showBack />
      <WebView
        source={{ uri }}
        style={styles.webview}
        onLoad={onWebViewLoad}
        onLoadEnd={onWebViewLoadEnd}
      />
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator color={Colors.orange} />
        </View>
      )}
    </SafeAreaView>
  )
}

export default WebViewScreen
