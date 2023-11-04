import React from 'react'
import { Image, TouchableOpacityProps } from 'react-native'
import { Images, Colors } from '../../common'
import ShellButton from '../ShellButton'
import styles from './styles'

interface Props extends TouchableOpacityProps {
  color?: string
  style?: any
  float?: boolean
  rounded?: boolean
  shadowed?: boolean
}

const BackButton = (props: Props) => {
  const { color, style, float, rounded, shadowed } = props
  const iconStyles = []
  const buttonStyles = []
  iconStyles.push(styles.caret)
  buttonStyles.push(styles.button)
  iconStyles.push(styles.backStyle)
  if (color) iconStyles.push({ tintColor: Colors[color] || color })
  if (float) buttonStyles.push(styles.float)
  if (shadowed) buttonStyles.push(styles.shadowed)
  if (rounded) buttonStyles.push(styles.rounded)
  if (style) buttonStyles.push(style)

  return (
    <ShellButton {...props} style={buttonStyles}>
      <Image source={Images.BACK_ARROW} style={iconStyles} />
    </ShellButton>
  )
}

export default BackButton
