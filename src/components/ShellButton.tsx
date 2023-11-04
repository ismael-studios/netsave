import React from 'react'
import {
  Keyboard,
  TouchableOpacity,
  TouchableOpacityProps,
  TouchableWithoutFeedback,
} from 'react-native'
import * as Animatable from 'react-native-animatable'
import { Metrics } from '../common'

const AnimeTouchableNoFeedback = Animatable.createAnimatableComponent(
  TouchableWithoutFeedback
)
const AnimeTouchableOpacity =
  Animatable.createAnimatableComponent(TouchableOpacity)
const { baseMargin } = Metrics

interface ShellButtonProps extends TouchableOpacityProps {
  data?: any
  faded?: boolean
  padded?: boolean
  untouchable?: boolean
  noninteractive?: boolean
  hitSize?: number
}

const ShellButton = (props: ShellButtonProps) => {
  const handlePress = () => {
    const { data, onPress } = props
    Keyboard.dismiss()
    onPress && onPress(data)
  }

  const {
    style,
    faded,
    padded,
    children,
    disabled,
    untouchable,
    noninteractive,
    hitSize = 5,
  } = props
  const stylesArray = [style]
  const TouchableComponent = untouchable
    ? AnimeTouchableNoFeedback
    : AnimeTouchableOpacity
  const hitArea = {
    top: hitSize,
    bottom: hitSize,
    left: hitSize,
    right: hitSize,
  }
  if (disabled || faded) {
    stylesArray.push({ opacity: 0.5 })
  }
  if (padded) {
    stylesArray.push({ padding: baseMargin })
  }

  return (
    <TouchableComponent
      {...props}
      style={stylesArray}
      disabled={disabled || noninteractive}
      onPress={handlePress}
      hitSlop={hitArea}
    >
      {children}
    </TouchableComponent>
  )
}

export default ShellButton
