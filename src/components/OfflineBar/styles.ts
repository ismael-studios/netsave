import { ScaledSheet } from 'react-native-size-matters'
import { Metrics, Fonts, Colors } from '../../common'
import { ifIphoneX } from 'react-native-iphone-x-helper'

const { ifIOS, baseMargin, doubleBaseMargin, footerHeight, section } = Metrics
const { green, white, orange, darkGray, borderGray, red } = Colors
const { size, style } = Fonts

export default ScaledSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: red,
    height: '42@mvs',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ifIphoneX(-baseMargin * 0.8, 0),
    paddingBottom: ifIphoneX(baseMargin * 0.8, 0),
  },
  hidden: {
    backgroundColor: green,
    height: 0,
    marginTop: 0,
    paddingBottom: 0,
  },
  text: {
    ...style.semiBold,
    fontSize: size.small,
    color: white,
  },
})
