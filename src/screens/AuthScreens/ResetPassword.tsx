import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import {
  Text,
  Button,
  SafeAreaView,
  Header,
  Input,
  ShowAlert,
} from '../../components'
import styles from './Styles'
import { isValidEmail } from '../../helpers/Validations'
import { ResetPasswordStackScreenProps } from '../../navigation/types'
import { useRequestResetPasswordMutation } from '../../store/slice/api/features/auth'
import { Colors } from '../../common'
import LinearGradient from 'react-native-linear-gradient'

const ResetPassword = ({
  navigation,
  route,
}: ResetPasswordStackScreenProps<'ResetPasswordRequest'>) => {
  const { email: routeEmail } = route.params
  const [email, setEmail] = useState(routeEmail || '')

  const [requestResetPassword, { isLoading, isSuccess, isError, error }] =
    useRequestResetPasswordMutation()

  useEffect(() => {
    if (isSuccess) {
      navigation.navigate('ChangePassword', {
        email,
      })
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError) {
      ShowAlert({
        title: 'Hold on!',
        message: error.data.message,
        actions: [{ name: 'Okay', positive: true }],
      })
    }
  }, [isError, error])

  const handleContinue = () => {
    requestResetPassword({
      email,
    })
  }

  const canSend = isValidEmail(email)

  return (
    <SafeAreaView style={styles.container}>
      <Header avoidMode showBack title="" />
      <View style={styles.subContainer}>
        <View style={styles.form}>
          <Text style={styles.title}>Reset Password</Text>
          <View style={styles.row}>
            <Input
              color={Colors.blue}
              placeholderTextColor={Colors.blue}
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              style={styles.inputBordered}
            />
          </View>
        </View>
      </View>
      <LinearGradient
        colors={['#ffffff', '#ffffff', '#eff6fb', '#e2f0f8', '#e2f0f8']}
        style={styles.subContainer}
      >
        <View style={styles.footer}>
          <Button
            blueGradient
            disabled={!canSend}
            loading={isLoading}
            style={styles.button}
            onPress={handleContinue}
          >
            Continue to Netsave
          </Button>
        </View>
      </LinearGradient>
    </SafeAreaView>
  )
}

export default ResetPassword
