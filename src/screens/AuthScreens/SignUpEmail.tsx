import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import {
  Text,
  Button,
  Header,
  Input,
  ModalBox,
  // SeeNotSee,
} from '../../components'
import styles from './Styles'
import TermsAndConditions from './TermsAndConditions'
import { isValidEmail } from '../../helpers/Validations'
import analytics from '@react-native-firebase/analytics'
import { AuthStackScreenProps } from '../../navigation/types'
import { usePostUserMutation } from '../../store/slice/api/features/user'
import LinearGradient from 'react-native-linear-gradient'
import { Colors } from '../../common'

const regex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/)

const SignUpEmail = ({ navigation }: AuthStackScreenProps<'SignUpEmail'>) => {
  const [email, setEmail] = useState('')
  // const [seePassword, setSeePassword] = useState(false)
  // const [seeConfirmPassword, setSeeConfirmPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [showSuspendedModal, setShowSuspendedModal] = useState(false)
  const [postUser, { isLoading, isSuccess }] = usePostUserMutation()

  useEffect(() => {
    analytics().logScreenView({
      screen_class: 'SignUpEmail',
      screen_name: 'SignUpEmail',
    })
  }, [])

  useEffect(() => {
    if (isSuccess) {
      navigation.navigate('VerifyCode', { email, password, isResend: false })
    }
  }, [isSuccess, navigation, email, password])

  const handleLogin = () => navigation.navigate('Login')

  const handleContinue = () => {
    postUser({
      password,
      email,
    })
  }

  const handleToggleSuspendedModal = () =>
    setShowSuspendedModal(!showSuspendedModal)

  const handleHelpSupport = () =>
    navigation.navigate('WebScreen', {
      uri: 'https://netsave.com/help-support-center?source=webview',
    })

  // const toggleSeePassword = () => {
  //   setSeePassword(!seePassword)
  // }
  //
  // const toggleSeeConfirmPassword = () => {
  //   setSeeConfirmPassword(!setSeeConfirmPassword)
  // }

  const passwordMatch = password === passwordConfirmation
  const validPassword = regex.test(password) && regex.test(passwordConfirmation)
  const canSend = isValidEmail(email) && passwordMatch && validPassword

  const InvalidPasswordText = (
    <View style={styles.passwordInstructions}>
      <Text style={styles.passwordErrorText}>
        Include at least one number and one letter.
      </Text>
      <Text style={styles.passwordErrorText}>
        Only the following symbols are allowed: @$!%*#?&#38;
      </Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <Header
        avoidMode
        showBack
        progress={0.28}
        title=""
        rightButton="Log up instead"
        onRightPress={handleLogin}
      />
      <View style={styles.subContainer}>
        <View style={styles.form}>
          <Text style={styles.title}>Sign up with email</Text>
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
              // style={styles.inputBordered}
            />
          </View>
          <View style={styles.row}>
            <Input
              secureTextEntry
              selectTextOnFocus
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter a secure password"
            />
            {/*
              <SeeNotSee
                style={styles.notSeeButton}
                seeing={seePassword}
                onPress={toggleSeePassword}
              />
            */}
          </View>
          {!!password && !regex.test(password) ? (
            InvalidPasswordText
          ) : (
            <Text style={styles.passwordInstructionsText}>
              Password must be at least 6 characters
            </Text>
          )}
          <View style={styles.row}>
            <Input
              secureTextEntry
              selectTextOnFocus
              autoCapitalize="none"
              placeholder="Confirm your password"
              value={passwordConfirmation}
              onChangeText={setPasswordConfirmation}
            />
            {/*
              <SeeNotSee
                style={styles.notSeeButton}
                seeing={seeConfirmPassword}
                onPress={toggleSeeConfirmPassword}
              />
            */}
          </View>
          {!!passwordConfirmation &&
            !regex.test(passwordConfirmation) &&
            InvalidPasswordText}
          {validPassword && !passwordMatch && (
            <View style={styles.passwordInstructions}>
              <Text style={styles.passwordErrorText}>
                Passwords do not match
              </Text>
            </View>
          )}
        </View>
      </View>
      <LinearGradient
        colors={['#ffffff', '#ffffff', '#eff6fb', '#e2f0f8', '#e2f0f8']}
        style={styles.footerBase}
      >
        <Button
          blueGradient
          loading={isLoading}
          disabled={!canSend || isLoading}
          style={styles.continueButton}
          onPress={handleContinue}
        >
          Continue
        </Button>
        <TermsAndConditions />
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

export default SignUpEmail
