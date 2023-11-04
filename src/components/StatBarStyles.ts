import { StyleSheet } from 'react-native'
import { Colors, Metrics } from '../common'

const { baseMargin } = Metrics
const { green } = Colors

export default StyleSheet.create({
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: green,
    paddingHorizontal: baseMargin,
    paddingVertical: baseMargin * 1.5,
  },
})
