import React, { useEffect, useState } from 'react'
import { View, Image } from 'react-native'
import {
  Text,
  Button,
  ScrollView,
  ShellButton,
  PageTitle,
  ShowAlert,
  Header,
} from '../../components'
import styles from './Styles'
import moment from 'moment'
import PinCodeInput from './PinCodeInput'
import { Images } from '../../common'
import analytics from '@react-native-firebase/analytics'
import * as Sentry from '@sentry/react-native'
import {
  useVerifyEmailMutation,
  useVerifyEmailRequestMutation,
} from '../../store/slice/api/features/user'
import { useLoginMutation } from '../../store/slice/api/features/auth'
import DeviceInfo from 'react-native-device-info'
import { AuthStackScreenProps } from '../../navigation/types'
import LinearGradient from 'react-native-linear-gradient'

const deviceId = DeviceInfo.getUniqueId()
const { ENVELOPE } = Images

const VerifyCode = ({ route }: AuthStackScreenProps<'VerifyCode'>) => {
  const { email, password, isResend } = route.params
  const [pinCode, setPinCode] = useState('')
  const [lastResend, setLastResend] = useState<moment.Moment>()
  const [ticker, setTicker] = useState(0)

  const [verifyEmail, { isLoading, isSuccess, isError, error }] =
    useVerifyEmailMutation()
  const [verifyEmailRequest] = useVerifyEmailRequestMutation()
  const [login, loginResult] = useLoginMutation()
  const { isLoading: isLoggingIn } = loginResult

  useEffect(() => {
    analytics().logEvent('signup_verify_code_start')
    if (isResend) {
      handleResendCode()
    } else {
      setLastResend(moment().add(1, 'minutes'))
    }
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
      analytics().logEvent('signup_verify_code_complete')
      login({ email, password, deviceId })
    }
  }, [isSuccess, email, password, login])

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
    verifyEmail({ code: +pinCode, email })
  }

  const handleResendCode = async () => {
    analytics().logEvent('signup_verify_code_resend')
    try {
      await verifyEmailRequest({ email }).unwrap()
      setLastResend(moment().add(1, 'minutes'))
      ShowAlert({
        title: 'Success!',
        message: `We sent another verification email to "${email}".`,
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
            <View style={styles.iconCircle}>
              <Image source={ENVELOPE} style={styles.circleIcon} />
            </View>
            <PageTitle
              title={'Verify your email'}
              summary={`We've sent a confirmation email to ${email}. Please enter it below to validate you email.`}
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
          loading={isLoading || isLoggingIn}
          disabled={cantSend || isLoggingIn}
          style={[styles.button, styles.spaced]}
          onPress={handleVerifyCode}
        >
          Verify Code
        </Button>
      </LinearGradient>
    </View>
  )
}

export default VerifyCode
