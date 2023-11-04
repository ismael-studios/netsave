import { useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
import type { DeepPartial, Theme } from 'stream-chat-react-native'

export const useStreamChatTheme = () => {
  const colorScheme = useColorScheme()
  const getChatStyle = (): DeepPartial<Theme> => ({
    avatar: {
      image: {
        height: 32,
        width: 32,
      },
    },
    colors: {
      accent_blue: '#005FFF',
      accent_green: '#20E070',
      accent_red: '#FF3742',
      bg_gradient_end: '#F7F7F7',
      bg_gradient_start: '#FCFCFC',
      black: '#000000',
      blue_alice: '#E9F2FF',
      border: '#00000014', // 14 = 8% opacity; top: x=0, y=-1; bottom: x=0, y=1
      grey: '#7A7A7A',
      grey_gainsboro: '#DBDBDB',
      grey_whisper: '#ECEBEB',
      icon_background: '#FFFFFF',
      modal_shadow: '#00000099', // 99 = 60% opacity; x=0, y= 1, radius=4
      overlay: '#00000099', // 99 = 60% opacity
      shadow_icon: '#00000040', // 40 = 25% opacity; x=0, y=0, radius=4
      targetedMessageBackground: '#FBF4DD', // dark mode = #302D22
      transparent: 'transparent',
      white: '#FFFFFF',
      white_smoke: '#F2F2F2',
      white_snow: '#FCFCFC',
    },
    spinner: {
      height: 15,
      width: 15,
    },
  })
  const [chatStyle, setChatStyle] = useState(getChatStyle())

  useEffect(() => {
    setChatStyle(getChatStyle())
  }, [colorScheme])

  return chatStyle
}
