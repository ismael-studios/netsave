import React from 'react'
import { Image, View } from 'react-native'
import { Text, Button, SafeAreaView } from '../../components'
import { Images } from '../../common'
import styles from './Styles'
import { TransactionStackScreenProps } from '../../navigation/types'

const { CHECK_CIRCLE } = Images

const ReportProblemSuccess = ({
  navigation,
}: TransactionStackScreenProps<'ReportProblemSuccess'>) => {
  const handleChat = () => {
    navigation.navigate('Main', {
      screen: 'Chat',
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
          <Image style={styles.thumbsUp} source={CHECK_CIRCLE} />
        </View>
        <View style={styles.congratsBody}>
          <Text center style={styles.congratsText}>
            Report Submitted!
          </Text>
          <Text center style={styles.successText}>
            We've received your report and will look into the issue as soon as
            possible and get back to you.
          </Text>
          <Text center style={styles.successText}>
            {' '}
          </Text>
          <Text center style={styles.successText}>
            Thank you for making Netsave a better place!
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Button tight style={styles.button} onPress={handleHome}>
          Continue Shopping
        </Button>
        <Button tight outlined onPress={handleChat}>
          Back To Chat
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default ReportProblemSuccess
