import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import {
  Text,
  Button,
  ScrollView,
  ShellButton,
  PageTitle,
  ShowAlert,
  Header,
} from '../../../components'
import styles from './Styles'
import moment from 'moment'
import PinCodeInput from '../PinCodeInput'
import analytics from '@react-native-firebase/analytics'
import * as Sentry from '@sentry/react-native'
import {
  useGetUserQuery,
  useVerifyPhoneMutation,
  useVerifyPhoneRequestMutation,
} from '../../../store/slice/api/features/user'
import { ChangePhoneStackScreenProps } from '../../../navigation/types'
import { useAppSelector } from '../../../store/hooks'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import LinearGradient from 'react-native-linear-gradient'

const VerifyPhone = ({
  navigation,
  route,
}: ChangePhoneStackScreenProps<'VerifyPhone'>) => {
  const { isOnboard } = route.params
  const { sub } = useAppSelector((state) => state.session)
  const { data: user } = useGetUserQuery(sub ?? skipToken)

  const [pinCode, setPinCode] = useState('')
  const [lastResend, setLastResend] = useState<moment.Moment>()
  const [ticker, setTicker] = useState(0)

  const [verifyPhone, { isLoading, isSuccess, isError, error }] =
    useVerifyPhoneMutation()
  const [verifyPhoneRequest] = useVerifyPhoneRequestMutation()

  useEffect(() => {
    analytics().logEvent('verify_phone')
    setLastResend(moment().add(1, 'minutes'))
  }, [])

  useEffect(() => {
    if (lastResend && moment() < lastResend) {
      const timeout = setTimeout(() => {
        setTicker(ticker + 1)
      }, 1000)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [ticker, lastResend])

  useEffect(() => {
    if (isSuccess) {
      analytics().logEvent('verify_phone_complete')
      if (isOnboard) {
        navigation.navigate('LocationServices', { isOnboard: true })
      } else {
        navigation.navigate('Main')
      }
    }
  }, [isSuccess, navigation, isOnboard])

  useEffect(() => {
    if (isError) {
      const message = error.data.message
      ShowAlert({
        title: 'Hold On!',
        message: message,
        actions: [{ name: 'Try again', positive: true }],
      })
      if (message !== 'Invalid code') {
        Sentry.captureMessage(message, Sentry.Severity.Error)
      }
    }
  }, [isError, error])

  const handleVerifyCode = () => {
    verifyPhone({ code: +pinCode })
  }

  const handleResendCode = async () => {
    analytics().logEvent('signup_verify_code_resend')
    try {
      await verifyPhoneRequest().unwrap()
      setLastResend(moment().add(1, 'minutes'))
      ShowAlert({
        title: 'Success!',
        message: `We sent another verification".`,
        actions: [{ name: 'Okay', positive: true }],
      })
    } catch (err) {
      console.log(err)
      const message = err.data.message
      Sentry.captureMessage(message, Sentry.Severity.Error)
      ShowAlert({
        title: 'Sorry!',
        message: message,
        actions: [{ name: 'Okay', positive: true }],
      })
    }
  }

  const cantSend = isLoading || !pinCode
  let cantResend = false
  let timeLeft = 0
  if (lastResend) {
    // resent code
    cantResend = moment() < lastResend
    timeLeft = lastResend.diff(moment(), 'seconds')
  }
  const waitToResend = `Resend code (${timeLeft})`
  return (
    <View style={styles.container}>
      <Header
        avoidMode
        showBack
        title=""
        progress={1}
        rightElement={
          <ShellButton
            disabled={cantResend}
            style={styles.linkButton}
            onPress={handleResendCode}
          >
            <Text style={styles.resendText}>
              {timeLeft > 0 ? waitToResend : 'Resend Code'}
            </Text>
          </ShellButton>
        }
      />
      <ScrollView behavior="height" avoidKeyboard>
        <View style={styles.subContainer}>
          <View style={styles.form}>
            <PageTitle
              title={'Enter code sent to your phone'}
              summary={`We've sent a code to your phone number ending in ${user?.phone}.`}
            />
            <PinCodeInput flat pins={6} onChangeText={setPinCode} />
          </View>
        </View>
      </ScrollView>
      <LinearGradient
        colors={['#ffffff', '#ffffff', '#eff6fb', '#e2f0f8', '#e2f0f8']}
        style={styles.footerBase}
      >
        <Button
          loading={isLoading}
          disabled={cantSend}
          style={[styles.button, styles.spaced]}
          onPress={handleVerifyCode}
        >
          Verify
        </Button>
      </LinearGradient>
    </View>
  )
}

export default VerifyPhone
