import React from 'react'
import { ScaledSheet } from 'react-native-size-matters'
import { Metrics, Colors } from '../../common'

const { baseMargin, doubleBaseMargin } = Metrics
const { green, darkGreen } = Colors

export default ScaledSheet.create({
  container: {
    width: '100%',
    backgroundColor: green,
  },
  titleBar: {
    paddingHorizontal: doubleBaseMargin,
    paddingVertical: baseMargin * 1.25,
  },
  title: {},
  selectionsBar: {
    backgroundColor: darkGreen,
    flexDirection: 'row',
  },
  selectionButton: {
    flex: 1,
    minHeight: '33@vs',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: baseMargin * 0.5,
    borderBottomWidth: 0,
    borderBottomColor: green,
  },
  buttonSelected: {
    borderBottomWidth: 3,
  },
})
