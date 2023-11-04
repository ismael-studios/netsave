import React, { useEffect, useState } from 'react'
import { View, Keyboard } from 'react-native'
import {
  Text,
  Button,
  ScrollView,
  SafeAreaView,
  ShowAlert,
  Header,
  Input,
} from '../../components'
import styles from './Styles'
import PinCodeInput from './PinCodeInput'
import { ResetPasswordStackScreenProps } from '../../navigation/types'
import { useResetPasswordMutation } from '../../store/slice/api/features/auth'
import LinearGradient from 'react-native-linear-gradient'

const ChangePassword = ({
  navigation,
  route,
}: ResetPasswordStackScreenProps<'ChangePassword'>) => {
  const { email } = route.params
  const [code, setCode] = useState('')

  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const [resetPassword, { isLoading, isSuccess, isError, error }] =
    useResetPasswordMutation()

  useEffect(() => {
    if (isSuccess) {
      ShowAlert({
        title: 'Success!',
        message: 'Password successfully changed.',
        actions: [
          {
            name: 'Okay',
            positive: true,
            callback: () => {
              navigation.goBack()
            },
          },
        ],
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

  const handleUpdatePassword = async () => {
    Keyboard.dismiss()

    if (password !== passwordConfirmation) {
      ShowAlert({ message: 'Passwords do not match!' })
      return
    }

    resetPassword({
      email,
      code: +code,
      password,
    })
  }

  const canSend = code && password && passwordConfirmation

  return (
    <SafeAreaView style={styles.container}>
      <Header avoidMode showBack title="" />
      <ScrollView>
        <View style={styles.subContainer}>
          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.heroSummary}>
            {`Please enter the verification code sent to your email ${email} and your new password.`}
          </Text>
          <View style={styles.form}>
            <PinCodeInput flat pins={6} onChangeText={setCode} />
            <View style={styles.row}>
              <Input
                secureTextEntry
                selectTextOnFocus
                autoComplete="password"
                autoCapitalize="none"
                placeholder="New Password"
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <View style={styles.row}>
              <Input
                secureTextEntry
                selectTextOnFocus
                autoComplete="password"
                autoCapitalize="none"
                placeholder="Confirm New Password"
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <LinearGradient
        colors={['#ffffff', '#ffffff', '#eff6fb', '#e2f0f8', '#e2f0f8']}
        style={styles.subContainer}
      >
        <View style={styles.footer}>
          <Button
            blueGradient
            disabled={!canSend}
            loading={isLoading}
            style={[styles.button, styles.spaced]}
            onPress={handleUpdatePassword}
          >
            Update Password
          </Button>
        </View>
      </LinearGradient>
    </SafeAreaView>
  )
}

export default ChangePassword
