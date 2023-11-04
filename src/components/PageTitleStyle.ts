import { ScaledSheet } from 'react-native-size-matters'
import { Colors, Metrics, Fonts } from '../common'
import { ifIphoneX } from 'react-native-iphone-x-helper'

const { baseMargin } = Metrics
const { size, style } = Fonts

export default ScaledSheet.create({
  container: {},
  title: {
    fontSize: ifIphoneX(size.h3, size.h4),
    color: Colors.black,
    marginBottom: baseMargin,
  },
  summary: {
    ...style.medium,
    fontSize: ifIphoneX(size.medium, size.medium),
    color: Colors.textGray,
    marginTop: baseMargin / 2,
    marginBottom: baseMargin * 1.5,
  },
})
