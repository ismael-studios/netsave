import React, { Component } from 'react'
import { Text as RNText, TextProps } from 'react-native'
import styles from './TextStyles'
import { Fonts, Colors } from '../common'
import { FontSize, FontStyle } from '../common/Fonts'
import { CallBackFunction } from '../types'

const { size: fontSizes, style: fontStyles, type: fontTypes } = Fonts

interface Props extends TextProps {
  style?: object
  typeFace?: typeof fontTypes
  fontSize?: FontSize | number
  fontStyle?: FontStyle
  faded?: boolean
  flex?: boolean
  wrap?: boolean
  gray?: boolean
  white?: boolean
  color?: string
  center?: boolean
  notop?: boolean
  nobase?: boolean
  padded?: boolean
  xPadded?: boolean
  spaced?: boolean
  leading?: number
  children?: any
  data?: any
  onPress?: CallBackFunction
  underlined?: boolean
  paragraph?: boolean
  paragraph2x?: boolean
  maxFontSizeMultiplier?: number
  strikethrough?: boolean
}

export default class Text extends Component<Props> {
  handlePress = () => {
    const { onPress, data } = this.props
    onPress && onPress(data)
  }
  render() {
    const {
      props,
      props: {
        style,
        typeFace = 'regular',
        fontSize = 'regular',
        fontStyle = 'regular',
        faded,
        flex,
        wrap,
        gray,
        white,
        color = Colors.textBlack,
        center,
        notop,
        nobase,
        padded,
        xPadded,
        onPress,
        spaced,
        leading,
        children,
        underlined,
        paragraph,
        paragraph2x,
        maxFontSizeMultiplier = 1.1,
        strikethrough,
      },
    } = this
    const compStyles = []

    if (typeFace) {
      compStyles.push({ fontFamily: fontTypes[typeFace] || typeFace })
    }
    if (fontStyle) {
      compStyles.push({
        ...(fontStyles[fontStyle] || { fontStyle }),
      })
    }
    if (fontSize) {
      compStyles.push({ fontSize: fontSizes[fontSize] || fontSize })
    }
    if (color) {
      compStyles.push({ color: Colors[color] || color })
    }
    if (faded) compStyles.push(styles.faded)
    if (flex) compStyles.push(styles.flex)
    if (gray) compStyles.push(styles.gray)
    if (white) compStyles.push(styles.white)
    if (underlined) compStyles.push(styles.underlined)
    if (paragraph) compStyles.push(styles.paragraph)
    if (paragraph2x) compStyles.push(styles.paragraph2x)
    if (nobase) compStyles.push(styles.nobase)
    if (notop) compStyles.push(styles.notop)
    if (center) compStyles.push(styles.center)
    if (wrap) compStyles.push(styles.wrap)
    if (spaced) compStyles.push(styles.spaced)
    if (padded) compStyles.push(styles.padded)
    if (xPadded) compStyles.push(styles.xPadded)
    if (leading) compStyles.push({ lineHeight: leading })
    if (strikethrough) compStyles.push({ textDecorationLine: 'line-through' })

    compStyles.push(style)

    return (
      <RNText
        {...props}
        style={compStyles}
        onPress={onPress && this.handlePress}
        maxFontSizeMultiplier={maxFontSizeMultiplier}
      >
        {children}
      </RNText>
    )
  }
}
