import React from 'react'
import { Image, View } from 'react-native'
import { Text, Button, SafeAreaView } from '../../components'
import { Images } from '../../common'
import styles from './Styles'
import { TransactionStackScreenProps } from '../../navigation/types'

const { CHECK_CIRCLE } = Images

const DisputeSuccess = ({
  navigation,
  route,
}: TransactionStackScreenProps<'DisputeSuccess'>) => {
  const { userId } = route.params

  const handleProfile = () => {
    navigation.navigate('UserProfile', { userId })
  }

  const handleHome = () => {
    navigation.navigate('Main', {
      screen: 'Shop',
    })
  }

  return (
    <SafeAreaView style={styles.base}>
      <View style={styles.congratsContainer}>
        <View style={styles.thumbsContainer}>
          <Image style={styles.thumbsUp} source={CHECK_CIRCLE} />
        </View>
        <View style={styles.congratsBody}>
          <Text center style={styles.congratsText}>
            Dispute Submitted!
          </Text>
          <Text center style={styles.successText}>
            We've received your dispute and will get back within 24 hours.
          </Text>
          <Text center style={styles.successText}>
            {' '}
          </Text>
          <Text center style={styles.successText}>
            Don't worry, we've got your back!
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Button tight style={styles.button} onPress={handleHome}>
          Continue Shopping
        </Button>
        <Button tight outlined onPress={handleProfile}>
          Go To Profile
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default DisputeSuccess
