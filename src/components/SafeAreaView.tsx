import React from 'react'
import { View } from 'react-native'
import { Metrics } from '../common'
import { ifIphoneX } from 'react-native-iphone-x-helper'

const {
  ifIOS,
  baseMargin,
  doubleBaseMargin,
  section,
  screenWidth,
  screenHeight,
} = Metrics
export default (props) => {
  const styles = {
    width: screenWidth,
    height: screenHeight,
    paddingTop: ifIphoneX(section * 1.3, ifIOS(baseMargin * 1.4, baseMargin)),
    paddingBottom: ifIphoneX(baseMargin, ifIOS(0, baseMargin)),
  }
  return (
    <View {...props} style={[styles, props.style]}>
      {props.children}
    </View>
  )
}
