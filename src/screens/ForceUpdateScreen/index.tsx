import React from 'react'
import { View, Image, ImageBackground, Linking } from 'react-native'
import { Text, Button } from '../../components'
import styles from './styles'
import { Images, Metrics } from '../../common'

const { SPLASH, LOGO_ICON } = Images

const ForceUpdateScreen = () => {
  const handleUpdateNow = () => {
    let link = ''
    if (Metrics.IS_IOS) {
      link = 'itms-apps://apps.apple.com/id/app/netsave/id1546789511'
    } else {
      link = 'market://details?id=com.netsave'
    }

    Linking.canOpenURL(link).then(
      (supported) => {
        supported && Linking.openURL(link)
      },
      (err) => console.log(err)
    )
  }
  return (
    <View style={styles.container}>
      <ImageBackground source={SPLASH} style={styles.bg} resizeMode="cover">
        <View style={styles.cardView}>
          <Image source={LOGO_ICON} style={styles.logo} />
          <Text style={styles.cardTitle}>New Version Available</Text>
          <Text style={styles.cardDescription}>
            Looks like you have an older version of the app. Please update to
            get the latest features and best experience.
          </Text>
          <Button tight block onPress={handleUpdateNow}>
            Update Now
          </Button>
        </View>
      </ImageBackground>
    </View>
  )
}

export default ForceUpdateScreen
