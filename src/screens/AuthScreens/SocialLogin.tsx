import React, { useEffect } from 'react'
import { View, Image } from 'react-native'
import { Text, ShowAlert, ShellButton } from '../../components'
import styles from './SocialLoginStyles'
import { Images } from '../../common'
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import CONFIG from 'react-native-config'
import { AccessToken, LoginManager } from 'react-native-fbsdk-next'
import {
  appleAuth,
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication'
import 'react-native-get-random-values'
import short from 'short-uuid'
import * as Sentry from '@sentry/react-native'
import {
  useAppleAuthMutation,
  useFacebookAuthMutation,
  useGoogleAuthMutation,
} from '../../store/slice/api/features/auth'
import DeviceInfo from 'react-native-device-info'
import { Colors } from '../../common'

const deviceId = DeviceInfo.getUniqueId()
const { APPLE, GOOGLE, FACEBOOK } = Images
const buttons = [
  {
    name: 'Google',
    icon: GOOGLE,
    color: Colors.googleWhite,
    bordered: false,
  },
  {
    name: 'Facebook',
    icon: FACEBOOK,
    color: Colors.facebookBlue,
    bordered: false,
  },
  {
    name: 'Apple',
    icon: APPLE,
    color: Colors.appleBlack,
    bordered: false,
  },
]

interface SocialLoginProps {
  bordered?: boolean
  handleToggleSuspendedModal: () => void
}

const SocialLogin = ({
  handleToggleSuspendedModal,
  bordered,
}: SocialLoginProps) => {
  if (bordered) buttons[0].bordered = true
  const [
    appleLogin,
    {
      isLoading: isLoadingAppleLogin,
      isError: isErrorAppleLogin,
      error: errorAppleLogin,
    },
  ] = useAppleAuthMutation()
  const [
    googleLogin,
    {
      isLoading: isLoadingGoogleLogin,
      isError: isErrorGoogleLogin,
      error: errorGoogleLogin,
    },
  ] = useGoogleAuthMutation()
  const [
    facebookLogin,
    {
      isLoading: isLoadingFacebookLogin,
      isError: isErrorFacebookLogin,
      error: errorFacebookLogin,
    },
  ] = useFacebookAuthMutation()

  const loading =
    isLoadingAppleLogin || isLoadingGoogleLogin || isLoadingFacebookLogin

  const handleLoginError = (message: string) => {
    if (String(message).match(/(suspended)/i)) {
      handleToggleSuspendedModal()
      return
    }
    handleErrorMessage(message, true)
  }

  useEffect(() => {
    if (isErrorAppleLogin) {
      const message = errorAppleLogin.data.message
      handleLoginError(message)
    }
  }, [isErrorAppleLogin, errorAppleLogin])

  useEffect(() => {
    if (isErrorGoogleLogin) {
      const message = errorGoogleLogin.data.message
      handleLoginError(message)
    }
  }, [isErrorGoogleLogin, errorGoogleLogin])

  useEffect(() => {
    if (isErrorFacebookLogin) {
      const message = errorFacebookLogin.data.message
      handleLoginError(message)
    }
  }, [isErrorFacebookLogin, errorFacebookLogin])

  const handleErrorMessage = (message: any, sendToSentry: boolean) => {
    console.log('error', message)
    if (sendToSentry) {
      Sentry.captureMessage(message, Sentry.Severity.Error)
    }
    ShowAlert({
      title: 'Sorry!',
      message,
      actions: [{ name: 'Try again', positive: true }],
    })
  }

  const handleGoogleAuth = async () => {
    try {
      const hasPlayServices = await GoogleSignin.hasPlayServices()
      if (!hasPlayServices) {
        const message = 'You do no have Google Play Services installed.'
        handleErrorMessage(message, false)
        return
      }

      const { idToken } = await GoogleSignin.signIn()
      if (idToken) {
        googleLogin({ idToken, deviceId })
      }
    } catch (error) {
      let message = ''
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        message = 'Google Login is currently in progress.'
        handleErrorMessage(message, false)
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        message = 'You do no have an up-to-date Google Play Services.'
        handleErrorMessage(message, false)
      } else {
        // some other error happened
        message = `There was a problem signing you in: ${error}`
        handleErrorMessage(message, true)
      }
    }
  }

  const handleFacebookAuth = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ])
      if (result.isCancelled) {
        return
      }

      if (
        result.grantedPermissions &&
        result.grantedPermissions.includes('email') &&
        result.grantedPermissions.includes('public_profile')
      ) {
        const currentAC = await AccessToken.getCurrentAccessToken()
        const { accessToken } = currentAC || {}
        if (accessToken) {
          facebookLogin({
            accessToken,
            deviceId,
          })
        }
      } else {
        handleErrorMessage(
          'Please grant permission to allow Netsave to access your Facebook.',
          false
        )
      }
    } catch (error) {
      handleErrorMessage(`Something went wrong: ${error}`, true)
    }
  }

  const handleAppleAuth = async () => {
    if (appleAuth.isSupported) {
      try {
        // performs login request
        const appleAuthRequestResponse = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        })

        // get current authentication state for user
        // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
        const credentialState = await appleAuth.getCredentialStateForUser(
          appleAuthRequestResponse.user
        )

        // use credentialState response to ensure the user is authenticated
        if (credentialState === appleAuth.State.AUTHORIZED) {
          // user is authenticated
          const { fullName, identityToken, nonce } = appleAuthRequestResponse
          if (identityToken) {
            appleLogin({
              ...(fullName && {
                firstName: fullName.givenName || undefined,
                lastName: fullName.familyName || undefined,
              }),
              idToken: identityToken,
              nonce,
              deviceId,
            })
          }
        } else {
          if (credentialState === appleAuth.State.NOT_FOUND) {
            handleErrorMessage('Apple user id not found', false)
          } else if (credentialState === appleAuth.State.REVOKED) {
            handleErrorMessage('Apple user id revoked', false)
          } else if (credentialState === appleAuth.State.TRANSFERRED) {
            handleErrorMessage(
              `Something went wrong. ${appleAuth.State.TRANSFERRED}`,
              true
            )
          }
        }
      } catch (error) {
        if (String(error).includes('E_SIGNIN_CANCELLED_ERROR')) {
          return
        }
        if (String(error).includes('1000')) {
          // user not signed in on phone
          return
        }
        if (String(error).includes('1001')) {
          // user cancelled
          return
        }
        handleErrorMessage(`Something went wrong: ${error}`, true)
      }
    } else {
      try {
        // Generate secure, random values for state and nonce
        const rawNonce = short.uuid()
        const state = short.uuid()

        // Configure the request
        appleAuthAndroid.configure({
          // The Service ID you registered with Apple
          clientId: 'com.netsave.netsave.sid',

          // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
          // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
          redirectUri: CONFIG.APPLE_AUTH_REDIRECT_URI,

          // The type of response requested - code, id_token, or both.
          responseType: appleAuthAndroid.ResponseType.ALL,

          // The amount of user information requested from Apple.
          scope: appleAuthAndroid.Scope.ALL,

          // Random nonce value that will be SHA256 hashed before sending to Apple.
          nonce: rawNonce,

          // Unique state value used to prevent CSRF attacks. A UUID will be generated if nothing is provided.
          state,
        })

        // Open the browser window for user sign in
        const response = await appleAuthAndroid.signIn()
        const { id_token: idToken, nonce, user } = response

        if (idToken && nonce) {
          appleLogin({
            ...(user && {
              firstName: user.name?.firstName,
              lastName: user.name?.lastName,
            }),
            idToken,
            nonce,
            deviceId,
          })
        }
      } catch (error) {
        if (String(error).includes('E_SIGNIN_CANCELLED_ERROR')) {
          return
        }
        handleErrorMessage(`Something went wrong. ${error}`, true)
      }
    }
  }

  const handleSocialLogin = ({ name }) => {
    switch (name.toLowerCase()) {
      case 'apple':
        // apple logic
        handleAppleAuth()
        break
      case 'google':
        // google logic
        handleGoogleAuth()
        break
      case 'facebook':
        // facebook logic'
        handleFacebookAuth()
        break
    }
  }

  const renderButton = ({ name, icon, color, bordered }) => {
    return (
      <ShellButton
        key={name}
        disabled={loading}
        data={{ name, icon }}
        style={[
          styles.socialButton,
          styles[`${name.toLowerCase()}Button`],
          bordered && styles.bordered,
        ]}
        onPress={handleSocialLogin}
      >
        <Image style={styles.socialIcon} source={icon} />
        <View style={styles.socialInfo}>
          <Text
            fontStyle="bold"
            style={[styles.socialText, styles[`${name.toLowerCase()}Text`]]}
          >
            Continue with {name}
          </Text>
        </View>
      </ShellButton>
    )
  }

  return <View style={styles.socialLogin}>{buttons.map(renderButton)}</View>
}

export default SocialLogin
