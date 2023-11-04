import React from 'react'
import { Image } from 'react-native'
import { Images, Colors } from '../../common'
import ShellButton from '../ShellButton'
import styles from './styles'

const CloseButton = (props) => {
  const { color, style, iconStyle, float, floatRight, shadowed } = props
  const iconStyles = [styles.icon]
  const buttonStyles = [styles.button]

  if (color) iconStyles.push({ tintColor: Colors[color] || color })
  if (float) buttonStyles.push(styles.float)
  if (floatRight) buttonStyles.push([styles.float, styles.floatRight])
  if (shadowed) buttonStyles.push(styles.shadowed)
  if (style) buttonStyles.push(style)
  if (iconStyle) iconStyles.push(iconStyle)

  return (
    <ShellButton {...props} style={buttonStyles}>
      <Image source={Images.CLOSE_X} style={iconStyles} />
    </ShellButton>
  )
}

export default CloseButton
