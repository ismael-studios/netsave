import React from 'react'
import { Image } from 'react-native'
import styles from './HintButtonStyles'
import ShellButton from './ShellButton'
import { Images } from '../common'

const HintButton = (props) => {
  const { style, ...otherProps } = props
  const stylesArray = [styles.questionCircle, style]
  return (
    <ShellButton style={stylesArray} {...otherProps}>
      <Image source={Images.QUESTION} style={styles.questionMark} />
    </ShellButton>
  )
}

export default HintButton
