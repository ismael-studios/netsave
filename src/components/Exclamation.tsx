import React from 'react'
import { ScaledSheet } from 'react-native-size-matters'
import { View, ViewProps } from 'react-native'
import Text from './Text'
import { Fonts, Colors, Metrics } from '../common'

const { section } = Metrics
const { size } = Fonts
const { white, orange } = Colors

const Exclamation = ({ style, ...otherProps }: ViewProps) => {
  return (
    <View style={[styles.container, style]} {...otherProps}>
      <Text style={styles.text}>!</Text>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    backgroundColor: orange,
    width: section * 1.15,
    height: section * 1.15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: white,
    borderRadius: section,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 9,
  },
  text: {
    top: '-2@ms',
    color: white,
    fontSize: size.h3,
  },
})

export default Exclamation
