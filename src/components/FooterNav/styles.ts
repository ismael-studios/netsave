import { ScaledSheet } from 'react-native-size-matters'
import { Metrics, Fonts, Colors } from '../../common'
import { ifIphoneX } from 'react-native-iphone-x-helper'

const { baseMargin, footerHeight } = Metrics
const { green, white, darkGray, borderGray } = Colors
const { size, style } = Fonts

export default ScaledSheet.create({
  container: {
    width: '100%',
    backgroundColor: white,
    flexDirection: 'row',
    height: footerHeight,
    borderTopWidth: 0.5,
    borderTopColor: borderGray,
    paddingBottom: ifIphoneX(baseMargin, 0),
  },
  hide: {
    marginBottom: -footerHeight + 1,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButton: {
    flex: 1.04,
  },
  navIcon: {
    width: '24@ms',
    height: '24@ms',
    resizeMode: 'contain',
    marginBottom: baseMargin / 3,
  },
  navIconTint: {
    tintColor: green,
  },
  iconSelected: {
    tintColor: darkGray,
  },
  navText: {
    ...style.semiBold,
    fontSize: size.h7,
    color: green,
  },
  textSelected: {
    color: darkGray,
  },
  iconGrayTint: {
    tintColor: green,
  },
})
