import React, { useEffect } from 'react'
import messaging from '@react-native-firebase/messaging'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import RewardsModal from '../RewardsModal'
import { NotificationType } from '../../enums/Notifications'
import { setActiveNotification } from '../..//store/slice/notificationSlice'
import notifee, { EventType } from '@notifee/react-native'
import navigateWithNotificationData from '../../helpers/navigateWithNotificationData'
import { usePutFirebaseTokenMutation } from '../../store/slice/api/features/user'
import { requestFCMToken } from '../../helpers/FCMHelper'
import * as Sentry from '@sentry/react-native'
import DeviceInfo from 'react-native-device-info'

const deviceId = DeviceInfo.getUniqueId()
const Notifications = () => {
  const dispatch = useAppDispatch()
  const notification = useAppSelector((state) => state.notification)
  const { signedIn } = useAppSelector((state) => state.session)
  const [putFirebaseToken] = usePutFirebaseTokenMutation()

  const handleBackgroundNotificationPress = (data?: {
    [key: string]: string
  }) => {
    if (data) {
      dispatch(
        setActiveNotification({
          type: data.type,
        })
      )

      if (data.navigate) {
        navigateWithNotificationData(data)
      }
    }
  }

  useEffect(() => {
    const initFirebaseToken = async () => {
      try {
        const token = await requestFCMToken()
        if (token) {
          putFirebaseToken({
            fcmToken: token,
            deviceId,
          })
        }
      } catch (err) {
        console.log(err)
      }
    }

    initFirebaseToken()
  }, [putFirebaseToken, signedIn])

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage))
      if (remoteMessage.data) {
        dispatch(
          setActiveNotification({
            type: remoteMessage.data.type,
          })
        )
      }

      if (remoteMessage.notification) {
        try {
          const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
          })

          await notifee.displayNotification({
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            android: {
              channelId,
            },
            data: remoteMessage.data,
          })
        } catch (error) {
          Sentry.captureMessage(JSON.stringify(error), Sentry.Severity.Error)
        }
      }
    })

    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    const unsubscribe2 = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage
        )
        handleBackgroundNotificationPress(remoteMessage.data)
      }
    )
    const unsubscribe3 = messaging().onTokenRefresh((token: string) => {
      console.log('onTokenRefresh', token)
      putFirebaseToken({
        fcmToken: token,
        deviceId,
      })
    })

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage
          )
          handleBackgroundNotificationPress(remoteMessage.data)
        }
      })

    return () => {
      unsubscribe()
      unsubscribe2()
      unsubscribe3()
    }
  }, [])

  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification)
          break
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification)
          if (detail && detail.notification) {
            handleBackgroundNotificationPress(detail.notification.data)
          }
          break
      }
    })
  }, [])

  useEffect(() => {
    return notifee.onBackgroundEvent(async ({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log(
            'onBackgroundEvent User dismissed notification',
            detail.notification
          )
          break
        case EventType.PRESS:
          console.log(
            'onBackgroundEvent User pressed notification',
            detail.notification
          )
          if (detail && detail.notification) {
            handleBackgroundNotificationPress(detail.notification.data)
          }
          break
      }
    })
  }, [])

  if (notification.active) {
    if (notification.active.type === NotificationType.PRODUCT_LISTING_1000) {
      return <RewardsModal />
    }
  }
  return null
}

export default Notifications
