import React from 'react'
import { Image } from 'react-native'
import { Images, Colors } from '../../common'
import ShellButton from '../ShellButton'
import styles from './styles'

const OptionsButton = (props) => {
  const {
    color,
    style,
    iconStyle,
    float,
    floatRight,
    shadowed,
    image,
    children,
  } = props
  const iconStyles = [styles.icon]
  const buttonStyles = [styles.button]

  if (color) iconStyles.push({ tintColor: Colors[color] || color })
  if (float) buttonStyles.push(styles.float)
  if (shadowed) buttonStyles.push(styles.shadowed)
  if (floatRight) buttonStyles.push([styles.float, styles.floatRight])
  if (style) buttonStyles.push(style)
  if (iconStyle) iconStyles.push(iconStyle)

  return (
    <ShellButton {...props} style={buttonStyles}>
      {children || (
        <Image source={image || Images.VERTICAL_ELLIPSIS} style={iconStyles} />
      )}
    </ShellButton>
  )
}

export default OptionsButton
