import React from 'react'
import {
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  View,
  TouchableOpacityProps,
} from 'react-native'
import styles from './ButtonStyles'
import Text from './Text'
import { Colors } from '../common'
import * as Animatable from 'react-native-animatable'
import { FontSize, FontStyle } from '../common/Fonts'
import LinearGradient from 'react-native-linear-gradient'

const AnimatableTouchableOpacity =
  Animatable.createAnimatableComponent(TouchableOpacity)

interface Props extends TouchableOpacityProps {
  data?: any
  white?: boolean
  tight?: boolean
  block?: boolean
  bold?: boolean
  big?: boolean
  slim?: boolean
  color?: string
  faded?: boolean
  loading?: boolean
  label?: string
  buttonText?: string
  blueGradient?: boolean
  rounded?: boolean
  outlined?: boolean
  textColor?: string
  textStyle?: any
  wrapperStyle?: any
  fontSize?: FontSize | number
  fontStyle?: FontStyle
}
const Button: React.FC<Props> = (props) => {
  const handlePress = () => {
    Keyboard.dismiss()
    const { data, onPress } = props
    onPress && onPress(data)
  }

  const {
    style,
    block,
    bold,
    big,
    white,
    tight,
    slim,
    label,
    faded,
    color = 'blue',
    loading,
    rounded,
    children,
    outlined,
    disabled,
    textColor,
    textStyle,
    buttonText,
    wrapperStyle,
    blueGradient,
    fontStyle = 'bold',
    fontSize = 'regular',
  } = props
  const stylesArray = [] // [styles.button]
  const textStylesArray = [] //[styles.text]
  const wrapperStylesArray = [] //[styles.textWrapper]
  const buttonTextRender = label || buttonText || children
  let loadingColor = 'white'

  stylesArray.push(styles.button)
  textStylesArray.push(styles.text)
  wrapperStylesArray.push(styles.textWrapper)

  if (style) stylesArray.push(style)
  if (block) stylesArray.push(styles.block)
  if (outlined) {
    stylesArray.push(styles.outlined)
    textStylesArray.push(styles.outlinedText)
    loadingColor = Colors[color] || color
  }
  if (textStyle) textStylesArray.push(textStyle)
  if (textColor) {
    textStylesArray.push({ color: Colors[textColor] || textColor })
  }
  if (wrapperStyle) wrapperStylesArray.push(wrapperStyle)
  if (tight) wrapperStylesArray.push(styles.tightWrapper)
  if (slim) wrapperStylesArray.push(styles.slimWrapper)
  if (tight || slim) {
    stylesArray.push(styles.tightButton)
  }
  if (big) {
    wrapperStylesArray.push(styles.bigWrapper)
    textStylesArray.push(styles.bigText)
  }
  if (rounded) stylesArray.push(styles.rounded)
  if (color) {
    const colorProp = Colors[color] || color
    const colorObject = { backgroundColor: '', borderColor: colorProp }
    if (!outlined) colorObject.backgroundColor = colorProp
    stylesArray.push(colorObject)
    if (outlined && !textColor) textStylesArray.push({ color: colorProp })
  }
  if (white) {
    stylesArray.push(styles.whiteButton)
    textStylesArray.push(styles.blackText)
  }
  if (bold) {
    textStylesArray.push({ fontWeight: '700' })
  }
  if (disabled || loading || faded) {
    stylesArray.push(styles.faded)
    if (disabled) {
      if (outlined) {
        textStylesArray.push({ color: Colors.gray })
        stylesArray.push({ borderColor: Colors.gray })
      } else {
        textStylesArray.push({ color: 'white' })
        stylesArray.push(styles.grayed)
      }
    }
  }

  return (
    <AnimatableTouchableOpacity
      {...props}
      style={stylesArray}
      onPress={handlePress}
      disabled={disabled || loading}
    >
      <View style={wrapperStylesArray}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={loadingColor} />
          </View>
        ) : (
          <Text
            fontStyle={fontStyle}
            fontSize={fontSize}
            style={textStylesArray}
          >
            {buttonTextRender}
          </Text>
        )}
      </View>
      {blueGradient ? (
        <LinearGradient
          useAngle
          colors={['#027dca', '#2d68a5']}
          style={styles.blueGradient}
        />
      ) : null}
    </AnimatableTouchableOpacity>
  )
}

export default Button
