import React, { useEffect, useState } from 'react'
import { View, Image } from 'react-native'
import { Text, Button, ScrollView, Header, ModalBox } from '../../components'
import styles from './Styles'
import SocialLogin from './SocialLogin'
import TermsAndConditions from './TermsAndConditions'
import analytics from '@react-native-firebase/analytics'
import { AuthStackScreenProps } from '../../navigation/types'
import LinearGradient from 'react-native-linear-gradient'
import { Images } from '../../common'

const { GIRL_ON_PHONE } = Images

const SignUp = ({ navigation }: AuthStackScreenProps<'SignUp'>) => {
  const [showSuspendedModal, setShowSuspendedModal] = useState(false)

  useEffect(() => {
    analytics().logScreenView({
      screen_class: 'SignUpScreen',
      screen_name: 'SignUpScreen',
    })
  }, [])

  const handleLogin = () => navigation.navigate('Login')

  const handleEmailSignUp = () => {
    navigation.navigate('SignUpEmail')
  }

  const handleToggleSuspendedModal = () =>
    setShowSuspendedModal(!showSuspendedModal)

  const handleHelpSupport = () =>
    navigation.navigate('WebScreen', {
      uri: 'https://netsave.com/help-support-center?source=webview',
    })

  return (
    <View style={styles.container}>
      <Header
        showBack
        showLogo
        avoidMode
        rightButton={'Log In Instead'}
        onRightPress={handleLogin}
      />
      <LinearGradient
        colors={['#ffffff', '#ffffff', '#eff6fb', '#e2f0f8']}
        style={styles.subContainer}
      >
        <View style={styles.introBody}>
          <View style={styles.heroContainer}>
            <Image source={GIRL_ON_PHONE} style={styles.heroImage} />
            <Text center style={styles.heroTitle}>
              Create an account
            </Text>
            <Text center style={styles.heroSummary}>
              Loremp ipsum dolor sit amet, consectetur adipiscing elitm sed do
            </Text>
          </View>
          <View style={styles.footer}>
            <ScrollView>
              <Button bold blueGradient onPress={handleEmailSignUp}>
                Sign up with email
              </Button>
              <View style={styles.orContainer}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.orLine} />
              </View>
              <SocialLogin
                handleToggleSuspendedModal={handleToggleSuspendedModal}
              />
            </ScrollView>
            <TermsAndConditions />
          </View>
        </View>
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
      </LinearGradient>
    </View>
  )
}

export default SignUp
