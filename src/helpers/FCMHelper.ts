import messaging from '@react-native-firebase/messaging'

const requestFCMToken = async () => {
  const authStatus = await messaging().requestPermission()
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL

  console.log('Authorization status:', authStatus)
  if (enabled) {
    const token = await messaging().getToken()
    // console.log('getToken', Platform.OS, token)
    return token
  } else {
    await deleteFCMToken()
  }
  return null
}

const deleteFCMToken = async () => {
  await messaging().deleteToken()
}

export { requestFCMToken, deleteFCMToken }
