import React, { useState, useRef } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  TextInput,
  TextInputProps,
  StyleProp,
  TextStyle,
} from 'react-native'
import styles from './InputStyles'
import { Colors, Fonts } from '../common'
import Text from './Text'
import { Metrics } from '../common'

const { size: fontSizes, style: fontStyles } = Fonts
const { placeholderColor } = Colors
const { ifIOS } = Metrics

export interface InputProps extends TextInputProps {
  wideFocus?: boolean
  leftElement?: React.ReactNode
  rightElement?: React.ReactNode
  label?: string | React.ReactNode
  labelStyle?: object
  center?: boolean
  unbordered?: boolean
  onFocus?: () => void
  onBlur?: () => void
  fontSize?: string | number
  fontStyle?: typeof fontStyles
  inputStyle?: StyleProp<TextStyle>
}

const Input = React.forwardRef<TextInput, InputProps>(
  (props: InputProps, ref) => {
    const [focused, setFocused] = useState(false)
    const _ref = useRef<TextInput>(null)
    // const handleOnChangeText = (TextValue) => {
    //   const { onChangeText, data } = props
    //   onChangeText && onChangeText(TextValue, data)
    // }

    const focus = () => _ref.current?.focus()

    const blur = () => _ref.current?.blur()

    const {
      wideFocus = true,
      multiline,
      numberOfLines,
      leftElement,
      rightElement,
      placeholderTextColor = placeholderColor,
      label,
      labelStyle,
      style,
      fontStyle,
      fontSize,
      onFocus,
      onBlur,
      inputStyle,
      center,
      unbordered,
      maxFontSizeMultiplier = 1.1,
      ...rest
    } = props

    const handleOnFocus = () => {
      setFocused(true)
      onFocus && onFocus()
    }
    const handleOnBlue = () => {
      setFocused(false)
      onBlur && onBlur()
    }

    const inputStyles = []
    inputStyles.push(styles.input, inputStyle || {})

    const containerStyles = []
    containerStyles.push(styles.container)
    if (unbordered) containerStyles.push(styles.unbordered)
    if (center) inputStyles.push(styles.center)
    if (multiline) {
      containerStyles.push(styles.multiline)
    }
    containerStyles.push(style)

    if (fontStyle) {
      inputStyles.push({
        ...(fontStyles[fontStyle] || { fontStyle }),
      })
    }
    if (fontSize) {
      inputStyles.push({ fontSize: fontSizes[fontSize] || fontSize })
    }

    if (focused) {
      inputStyles.push(styles.inputFocused)
      containerStyles.push(styles.bordered)
    }

    return (
      <TouchableWithoutFeedback onPress={wideFocus ? focus : () => {}}>
        <View style={containerStyles}>
          {label && typeof label === 'string' ? (
            <Text style={[styles.label, labelStyle]} center={center}>
              {label}
            </Text>
          ) : (
            label
          )}
          <View style={styles.inputWrapper}>
            {leftElement}
            <TextInput
              ref={ref}
              numberOfLines={ifIOS(numberOfLines, 1)}
              placeholderTextColor={placeholderTextColor}
              style={inputStyles}
              maxFontSizeMultiplier={maxFontSizeMultiplier}
              multiline={multiline}
              onFocus={handleOnFocus}
              onBlur={handleOnBlue}
              {...rest}
            />
            {rightElement}
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
)

export default Input
