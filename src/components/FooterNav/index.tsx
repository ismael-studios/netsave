import React, { useEffect, useState } from 'react'
import { Image, View } from 'react-native'
import Text from '../Text'
import ShellButton from '../ShellButton'
import styles from './styles'
import { Images } from '../../common'
import chatClient from '../../services/Chat'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useAppSelector } from '../../store/hooks'

const { NETSAVE_ICON, HEART, PLUS_CIRCLE_COLOR, MESSAGING, USER_ACCOUNT } =
  Images

const getIcon = (route) => {
  let icon
  switch (route.name) {
    case 'Shop':
      icon = NETSAVE_ICON
      break
    case 'Likes':
      icon = HEART
      break
    case 'Sell':
      icon = PLUS_CIRCLE_COLOR
      break
    case 'Chat':
      icon = MESSAGING
      break
    case 'Account':
      icon = USER_ACCOUNT
      break
  }
  return icon
}

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { signedIn } = useAppSelector((state) => state.session)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const sub = chatClient.on((event) => {
      if (
        event.total_unread_count !== undefined ||
        event.me?.total_unread_count !== undefined
      ) {
        setUnreadCount(
          event.total_unread_count || event.me?.total_unread_count || 0
        )
      }
    })
    return () => {
      sub.unsubscribe()
    }
  }, [])

  return (
    <View style={[styles.container]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name
        const isFocused = state.index === index
        const isChat = route.name === 'Chat'
        const hasChatCount = isChat && unreadCount

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            if (signedIn) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({ name: route.name, merge: true })
            } else {
              navigation.navigate('Login', { IntentScreen: route.name })
            }
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          })
        }

        return (
          <ShellButton
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            style={[styles.navButton]}
            onPress={onPress}
          >
            <Image
              source={getIcon(route)}
              style={[
                styles.navIcon,
                {
                  ...(!['Shop', 'Sell'].includes(route.name) && {
                    tintColor: isFocused
                      ? options.tabBarActiveTintColor
                      : options.tabBarInactiveTintColor,
                  }),
                },
              ]}
            />
            <Text
              style={[
                styles.navText,
                {
                  color: isFocused
                    ? options.tabBarActiveTintColor
                    : options.tabBarInactiveTintColor,
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {label}
              {hasChatCount ? (
                <Text fontSize="h7" fontStyle="semiBold" color="orange">
                  {' '}
                  ({unreadCount})
                </Text>
              ) : null}
            </Text>
          </ShellButton>
        )
      })}
    </View>
  )
}

export default TabBar
