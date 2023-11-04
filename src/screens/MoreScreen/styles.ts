import { ScaledSheet } from 'react-native-size-matters'
import { Metrics, Colors, Fonts } from '../../common'
import { ifIphoneX } from 'react-native-iphone-x-helper'

const {
  ifIOS,
  baseMargin,
  doubleBaseMargin,
  section,
  cornerRadius,
  doubleSection,
  screenWidth,
} = Metrics
const {
  white,
  green,
  lightGray,
  pastalGreen,
  pastalDarkGreen,
  borderGray,
  darkGreen,
  darkGray,
} = Colors
const { size, style } = Fonts

export default ScaledSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: green,
    padding: doubleBaseMargin,
    paddingTop: ifIphoneX(doubleSection, ifIOS(section * 1.5, section)),
    paddingBottom: doubleSection / 1.5,
    alignItems: 'center',
  },
  userMedia: {
    padding: baseMargin,
  },
  userImage: {
    resizeMode: 'cover',
    tintColor: lightGray,
    borderRadius: 50,
    width: '70@ms',
    height: '70@ms',
  },
  userInfo: {
    paddingLeft: baseMargin,
    justifyContent: 'center',
  },
  menues: {
    paddingHorizontal: doubleBaseMargin,
    paddingTop: baseMargin / 2,
  },
  menu: {
    borderBottomWidth: 1,
    borderBottomColor: borderGray,
  },
  last: {
    // borderBottomWidth: 0
  },
  menuButton: {
    paddingVertical: baseMargin * 1.25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuText: {
    color: green,
    fontSize: size.h4,
    marginTop: -baseMargin / 3,
  },
  menuCaret: {
    transform: [{ rotate: '180deg' }],
    width: '12@ms',
    height: '20@ms',
    tintColor: green,
  },
  version: {
    alignSelf: 'flex-end',
    paddingVertical: doubleBaseMargin,
    // right: doubleBaseMargin,
    // bottom: -doubleBaseMargin * 2
  },
})
