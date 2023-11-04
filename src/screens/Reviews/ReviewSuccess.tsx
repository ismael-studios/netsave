import React from 'react'
import { Image, View } from 'react-native'
import { Text, Button, SafeAreaView } from '../../components'
import { Images } from '../../common'
import styles from './Styles'
import { TransactionStackScreenProps } from '../../navigation/types'

const { THUMBS_UP } = Images

const ReviewSuccess = ({
  navigation,
  route,
}: TransactionStackScreenProps<'ReviewSuccess'>) => {
  const { product } = route.params

  const handleProfile = () => {
    navigation.navigate('UserProfile', {
      userId: product.userId,
    })
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
          <Image style={styles.thumbsUp} source={THUMBS_UP} />
        </View>
        <Text style={styles.congratsText}>Congratulations!</Text>
        <Text>You've successfully rated this transaction.</Text>
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

export default ReviewSuccess
