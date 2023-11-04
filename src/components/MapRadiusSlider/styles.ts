import React from 'react'
import { ScaledSheet } from 'react-native-size-matters'
import { Metrics, Fonts, Colors } from '../../common'

const { baseMargin, section, doubleBaseMargin, cornerRadius } = Metrics
const { green, white } = Colors
const { size, type } = Fonts

export default ScaledSheet.create({
  container: {
    width: '100%',
  },
  titleContainer: {
    alignItems: 'center',
    // paddingTop: baseMargin,
    paddingBottom: baseMargin / 4,
  },
  mapContainer: {},
  map: {
    borderRadius: cornerRadius,
    width: '100%',
    height: '200@vs',
  },
  slider: { width: '100%', height: 50 },
  thumb: { width: '15@ms', height: '15@ms' },
})
