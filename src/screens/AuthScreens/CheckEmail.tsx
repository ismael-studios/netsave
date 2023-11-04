import React from 'react'
import { View, Image } from 'react-native'
import {
  Text,
  Button,
  SafeAreaView,
  ScrollView,
  Header,
} from '../../components'
import styles from './Styles'
import { Images } from '../../common'
import { ResetPasswordStackScreenProps } from '../../navigation/types'

const { EMAIL } = Images

const CheckEmail = ({
  navigation,
  route,
}: ResetPasswordStackScreenProps<'CheckEmail'>) => {
  const { destination, email } = route.params
  const handleContinue = () => {
    navigation.navigate(destination, { email })
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header showLogo showBack />
      <ScrollView>
        <View style={styles.subContainer}>
          <View style={styles.form}>
            <View style={[styles.row, styles.center]}>
              <Image source={EMAIL} style={styles.email} />
            </View>
            <View style={[styles.row, styles.center]}>
              <Text
                paragraph
                fontStyle="bold"
                fontSize="h2"
                style={styles.title}
              >
                Check your email
              </Text>
            </View>
            <View style={styles.center}>
              <Text fontSize="h5">
                We have sent a verification to the email address provided.
              </Text>
            </View>
            <Button
              style={[styles.button, styles.spaced]}
              onPress={handleContinue}
            >
              Enter Verification Code
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CheckEmail
