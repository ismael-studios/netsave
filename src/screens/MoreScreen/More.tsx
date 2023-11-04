import React, { useEffect, useState } from 'react'
import { View, Image } from 'react-native'
import {
  Text,
  ShowAlert,
  ShellButton,
  ErrorBoundary,
  ScrollView,
} from '../../components'
import styles from './styles'
import FastImage from 'react-native-fast-image'
import { Images } from '../../common'
import VersionNumber from 'react-native-version-number'
import CONFIG from 'react-native-config'
import analytics from '@react-native-firebase/analytics'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { logout } from '../../store/slice/sessionSlice'
import { MainTabScreenProps } from '../../navigation/types'
import { resetApp } from '../../store/slice/appSlice'

const { ENV } = CONFIG
const { CARET_LEFT, USER_PROFILE_CIRCLE } = Images

interface MenuItem {
  name: string
  route?: string
  params?: { userId: string }
  link?: string
  callback?: () => void
}
const MoreScreen = ({ navigation }: MainTabScreenProps<'Account'>) => {
  const dispatch = useAppDispatch()
  const { user, sub } = useAppSelector((state) => state.session)
  const handleSignout = () => {
    ShowAlert({
      title: '',
      message: 'Do you wish to log out?',
      actions: [
        {
          name: 'Log Out Now',
          positive: true,
          callback: () => {
            dispatch(logout())
          },
        },
        { name: 'Cancel' },
      ],
    })
  }

  const [menues, setMenues] = useState<MenuItem[]>([
    { name: 'My Profile Settings', route: 'ProfileSettings' },
    {
      name: 'My Public Profile',
      route: 'UserProfile',
      params: { userId: sub },
    },
    { name: 'My Listings', route: 'MyListings' },
    { name: 'My Offers', route: 'MyOffers' },
    { name: 'My Wallet', route: 'MyEarnings' },
    { name: 'About Us', link: 'https://netsave.com/about?source=webview' },
    {
      name: 'Privacy Policy',
      link: 'https://netsave.com/privacy?source=webview',
    },
    {
      name: 'Terms & Conditions',
      link: 'https://netsave.com/terms?source=webview',
    },
    // {
    //   name: 'Trust & Safety Guidelines',
    //   link: 'https://netsave.com/trust-safety-resources?source=webview',
    // },
    // { name: "FAQ's", link: 'https://netsave.com/faq?source=webview' },
    {
      name: 'Help & Support Center',
      link: 'https://netsave.com/help-support-center?source=webview',
    },
    {
      name: 'Feedback & Recommendations',
      link: 'https://netsave.com/feedback?source=webview',
    },
    { name: 'Delete Account', route: 'DeleteAccount' },
    { name: 'Logout', callback: handleSignout },
  ])

  useEffect(() => {
    analytics().logScreenView({
      screen_class: 'MoreScreen',
      screen_name: 'MoreScreen',
    })
  }, [])

  const handleMenuPress = ({ route, params, link, callback }: MenuItem) => {
    callback && callback()
    route && navigation.navigate(route, params)
    link && navigation.navigate('WebScreen', { uri: link })
    route && analytics().logEvent('more_route', { route })
    link && analytics().logEvent('more_link', { link })
  }

  const handleGoToProfileSettings = () => {
    navigation.navigate('ProfileSettings')
  }

  const handleGoToPrivacySettings = () => {
    navigation.navigate('PrivacySettings')
  }

  const handleCrashError = () => {
    dispatch(resetApp())
  }

  const renderMenu = (menu: MenuItem, i: number) => {
    const isLast = i == menues.length - 1
    return (
      <View style={[styles.menu, isLast && styles.last]} key={i}>
        <ShellButton
          style={styles.menuButton}
          data={menu}
          onPress={handleMenuPress}
        >
          <Text style={styles.menuText}>{menu.name}</Text>
          <FastImage source={CARET_LEFT} style={styles.menuCaret} />
        </ShellButton>
      </View>
    )
  }

  if (!user) {
    return null
  }

  const { username, firstName, lastName, profileImageUrl } = user
  // const accountAccess = String(email).includes('privaterelay.appleid.com')
  //   ? '[Private Email]'
  //   : email
  return (
    <ErrorBoundary onError={handleCrashError}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ShellButton
            style={styles.userMedia}
            onPress={handleGoToProfileSettings}
          >
            {!profileImageUrl ? (
              <Image
                source={USER_PROFILE_CIRCLE}
                resizeMode="contain"
                style={styles.userImage}
              />
            ) : (
              <FastImage
                source={{ uri: profileImageUrl }}
                resizeMode="cover"
                style={styles.userImage}
              />
            )}
          </ShellButton>
          <ShellButton
            style={styles.userInfo}
            onPress={handleGoToPrivacySettings}
          >
            <Text white fontSize="xlarge" fontStyle="bold">
              {firstName} {lastName}
            </Text>
            {/* <Text leading={20} white fontSize="standard">
                {accountAccess}
              </Text> */}
            <Text leading={25} white fontSize="standard">
              @{username}
            </Text>
          </ShellButton>
        </View>
        <ScrollView>
          <View style={styles.menues}>
            {menues.map(renderMenu)}
            <View style={styles.version}>
              {ENV === 'production' ? (
                <Text color="green" faded fontSize="micro">
                  v{VersionNumber.appVersion}
                </Text>
              ) : (
                <Text color="darkGray" fontSize="micro">
                  {String(ENV).toUpperCase()} v{VersionNumber.appVersion}{' '}
                  <Text color="darkGray" fontSize="micro">
                    ({VersionNumber.buildVersion})
                  </Text>
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </ErrorBoundary>
  )
}

export default MoreScreen
