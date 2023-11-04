import { StyleSheet } from 'react-native'
import { Metrics } from '../common'

const { baseMargin, doubleBaseMargin, section } = Metrics

export default StyleSheet.create({
  underlined: {
    textDecorationLine: 'underline',
  },
  gray: {
    color: 'gray',
  },
  white: {
    color: 'white',
  },
  faded: {
    opacity: 0.5,
  },
  paragraph: {
    paddingVertical: baseMargin,
  },
  paragraph2x: {
    paddingVertical: doubleBaseMargin,
  },
  nobase: {
    paddingBottom: 0,
  },
  notop: {
    paddingTop: 0,
  },
  flex: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    textAlign: 'center',
  },
  wrap: {
    width: '100%',
    flexWrap: 'wrap',
  },
  padded: {
    padding: baseMargin,
  },
  xPadded: {
    padding: section,
  },
  spaced: {
    justifyContent: 'space-between',
  },
})
