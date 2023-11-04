import React from 'react'
import { View, ActivityIndicator, StyleProp, ViewStyle } from 'react-native'
import { Colors, Metrics } from '../common'
import Text from './Text'

const { screenHeight } = Metrics

interface LoadingProps {
  color?: string
  show?: boolean
  children?: React.ReactNode
  loadingText?: string
  style?: StyleProp<ViewStyle>
  minHeight?: number
}

const Loading = ({
  color = Colors.orange,
  show = true,
  children,
  loadingText = '',
  style,
  minHeight = screenHeight * 0.65,
}: LoadingProps) => {
  return show ? (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        ...style,
      }}
    >
      <ActivityIndicator color={color} />
      {loadingText ? (
        <Text padded center fontSize="standard" color="orange">
          {loadingText}
        </Text>
      ) : null}
    </View>
  ) : (
    (children && children) || null
  )
}

export default Loading
