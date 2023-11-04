import React from 'react'
import { View, ViewProps } from 'react-native'
import Text from './Text'
import { Metrics, Colors } from '../common'
import { FontSize } from '../common/Fonts'

const { screenHeight } = Metrics

interface EmptyContentProps extends ViewProps {
  flex?: number
  padding?: number
  paddingVertical?: number
  minHeight?: number
  color?: string
  show?: boolean
  message?: string
  fontSize?: FontSize | number
}

const EmptyContent = ({
  style = {},
  flex = 1,
  padding = 30,
  paddingVertical = 60,
  minHeight = screenHeight * 0.65,
  color = 'white',
  show = true,
  message = 'No items available.',
  fontSize,
}: EmptyContentProps) =>
  show ? (
    <View
      style={{
        flex,
        padding,
        backgroundColor: Colors[color] || color,
        paddingVertical,
        minHeight,
        justifyContent: 'center',
        ...style,
      }}
    >
      <Text center color="orange" fontSize={fontSize}>
        {message}
      </Text>
    </View>
  ) : (
    <View />
  )

export default EmptyContent
