import { ScaledSheet } from 'react-native-size-matters'
import { Metrics, Colors, Fonts } from '../../../common'
import { ifIphoneX } from 'react-native-iphone-x-helper'

const {
  ifIOS,
  baseMargin,
  section,
  screenHeight,
  doubleBaseMargin,
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
  subContainer: {
    paddingBottom: doubleSection * 2,
  },
  top: {
    flexDirection: 'row',
    paddingHorizontal: doubleBaseMargin,
    paddingBottom: doubleSection / 1.5,
    alignItems: 'center',
  },
  userMedia: {
    padding: baseMargin,
  },
  userImage: {
    backgroundColor: lightGray,
    borderRadius: 50,
    width: '80@ms',
    height: '80@ms',
  },
  uploading: {
    position: 'absolute',
    left: '32@ms',
    top: '32@ms',
    zIndex: 9,
  },
  camera: {
    width: '25@ms',
    height: '25@ms',
    position: 'absolute',
    resizeMode: 'contain',
    bottom: -10,
    right: 0,
  },
  userInfo: {
    paddingLeft: baseMargin,
    justifyContent: 'center',
  },
  infoText: {
    fontSize: size.h6,
  },
  username: {
    ...style.bold,
  },
  userBio: {
    paddingHorizontal: doubleBaseMargin,
    paddingBottom: doubleBaseMargin,
  },
  bioTitle: {
    fontSize: size.h6,
    ...style.bold,
  },
  bioText: {
    fontSize: size.standard,
    marginTop: baseMargin,
    // color: green
  },
  menues: {
    paddingHorizontal: doubleBaseMargin,
    paddingTop: baseMargin / 2,
  },
  menu: {
    borderTopWidth: 1,
    borderTopColor: borderGray,
  },
  last: {
    borderBottomWidth: 1,
    borderBottomColor: borderGray,
  },
  menuButton: {
    justifyContent: 'center',
    paddingVertical: baseMargin * 1.25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuText: {
    color: green,
    fontSize: size.regular,
    marginTop: -baseMargin / 3,
  },
  menuCaret: {
    transform: [{ rotate: '180deg' }],
    width: '12@ms',
    height: '20@ms',
    tintColor: green,
  },
  scroller: {
    height: screenHeight,
  },
  scrollerBase: {
    // flex: 1
  },
  form: {
    padding: doubleBaseMargin,
  },
  noBase: {
    paddingBottom: 0,
  },
  row: {
    paddingBottom: section,
    flexDirection: 'row',
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: borderGray,
    marginBottom: doubleBaseMargin,
  },
  rowTight: {
    paddingBottom: 0,
  },
  actions: {
    flex: 1,
    minHeight: '105@mvs',
    paddingHorizontal: doubleBaseMargin,
    justifyContent: 'flex-end',
    paddingBottom: ifIphoneX(section, doubleBaseMargin),
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: borderGray,
  },
  password: {
    color: darkGray,
  },
  forgetButton: {
    marginTop: ifIOS(-baseMargin / 1.5, -baseMargin / 3),
    paddingLeft: 3,
    paddingTop: 3,
    paddingBottom: 3,
  },
  blurb: {
    flex: 1,
    paddingRight: baseMargin,
  },
  spaced: {
    paddingBottom: baseMargin,
  },
  zipcode: {
    // width: '70@ms',,
    height: ifIOS('50@ms', '52@ms'),
    borderBottomWidth: 0,
  },
  zipcodeInput: {
    ...style.semiBold,
    fontSize: size.large,
    color: green,
    marginBottom: baseMargin,
  },
  colum: {
    flex: 1,
  },
  ctaButton: {
    marginTop: baseMargin * 1.6,
  },
  logo: {
    alignSelf: 'center',
    marginTop: doubleBaseMargin,
    width: '120@ms',
    height: '120@ms',
  },
  title: {
    paddingTop: baseMargin * 3.4,
  },
  description: {
    paddingTop: section,
    paddingHorizontal: baseMargin * 3.7,
  },
})
