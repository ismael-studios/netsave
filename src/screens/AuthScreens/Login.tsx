import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import {
  Text,
  Button,
  ShellButton,
  ShowAlert,
  Header,
  Input,
  ModalBox,
} from '../../components'
import styles from './Styles'
import SocialLogin from './SocialLogin'
// import TermsAndConditions from './TermsAndConditions'
import { isValidEmail } from '../../helpers/Validations'
import analytics from '@react-native-firebase/analytics'
import { useLoginMutation } from '../../store/slice/api/features/auth'
import DeviceInfo from 'react-native-device-info'
import { AuthStackScreenProps } from '../../navigation/types'
import LinearGradient from 'react-native-linear-gradient'

const deviceId = DeviceInfo.getUniqueId()

const Login = ({ navigation }: AuthStackScreenProps<'Login'>) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showSuspendedModal, setShowSuspendedModal] = useState(false)
  const [showVerifyCode, setShowVerifyCode] = useState(false)

  const [login, result] = useLoginMutation()
  const { isLoading, isSuccess, isError, error } = result

  useEffect(() => {
    analytics().logScreenView({
      screen_class: 'LoginScreen',
      screen_name: 'LoginScreen',
    })
  }, [])

  useEffect(() => {
    if (isError && error) {
      const message = error.data.message
      if (String(message).match(/(email)(.)*(verified)/i)) {
        setShowVerifyCode(true)
      } else if (String(message).match(/(suspended)/i)) {
        setShowSuspendedModal(true)
      } else {
        ShowAlert({ message })
      }
    }
  }, [isError, error, navigation])

  useEffect(() => {
    if (showVerifyCode) {
      navigation.navigate('VerifyCode', { email, password, isResend: true })
    }
  }, [navigation, showVerifyCode, email, password])

  useEffect(() => {
    if (isSuccess) {
    }
  }, [isSuccess])

  const handleSignUp = () => navigation.navigate('SignUp')

  const handleForgetPassword = () => {
    navigation.navigate('ResetPassword', {
      screen: 'ResetPasswordRequest',
      params: {
        email,
      },
    })
  }

  const handleContinue = () => {
    login({ email, password, deviceId })
  }

  const handleToggleSuspendedModal = () =>
    setShowSuspendedModal(!showSuspendedModal)

  const handleHelpSupport = () =>
    navigation.navigate('WebScreen', {
      uri: 'https://netsave.com/help-support-center?source=webview',
    })

  const canSend = isValidEmail(email) && password
  return (
    <View style={styles.container}>
      <Header
        avoidMode
        showBack
        title=""
        rightButton="Sign up instead"
        onRightPress={handleSignUp}
      />
      <View style={styles.baseContainer}>
        <View style={styles.form}>
          <Text style={styles.title}>Log in with email & password</Text>
          <View style={styles.row}>
            <Input
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              autoCorrect={false}
              autoComplete="email"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.row}>
            <Input
              secureTextEntry
              selectTextOnFocus
              autoComplete="password"
              autoCapitalize="none"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <Button
            blueGradient
            disabled={!canSend}
            loading={isLoading}
            onPress={handleContinue}
          >
            Log in with email & password
          </Button>
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.orLine} />
          </View>
          <SocialLogin
            bordered
            handleToggleSuspendedModal={handleToggleSuspendedModal}
          />
        </View>
      </View>
      <LinearGradient
        colors={['#ffffff', '#ffffff', '#eff6fb', '#e2f0f8', '#e2f0f8']}
        style={styles.subContainer}
      >
        <ShellButton style={styles.forgetButton} onPress={handleForgetPassword}>
          <Text underlined style={styles.forgotPasswordText}>
            Forgot your password? Reset it here.
          </Text>
        </ShellButton>
      </LinearGradient>
      <ModalBox
        onHide={handleToggleSuspendedModal}
        visible={showSuspendedModal}
        title="Oops!"
      >
        <View style={{ marginBottom: 20 }}>
          <Text center paragraph fontSize="standard">
            To protect our users' privacy & safety, you are not allowed to
            access Netsave at this time.
          </Text>

          <Text center paragraph fontSize="standard">
            For further assistance, please contact us via the help & support
            center below
          </Text>
        </View>
        <Button tight block onPress={handleHelpSupport}>
          Help & Support Center
        </Button>
      </ModalBox>
    </View>
  )
}

export default Login
