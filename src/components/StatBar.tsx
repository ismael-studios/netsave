import React from 'react'
import * as Animatable from 'react-native-animatable'
import styles from './StatBarStyles'
import Text from './Text'

const StatBar = (props) => {
  const { style, title, subTitle } = props
  const stylesArray = [styles.statContainer, style]
  return (
    <Animatable.View style={stylesArray}>
      <Text fontSize="h5" fontStyle="bold" white>
        {title}
      </Text>
      <Text fontSize="h6" white>
        {subTitle}
      </Text>
    </Animatable.View>
  )
}

export default StatBar
