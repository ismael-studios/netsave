import { ScaledSheet } from 'react-native-size-matters'
import { Colors, Fonts, Metrics } from '../../common'
import { ifIphoneX } from 'react-native-iphone-x-helper'

const { style, size } = Fonts
const {
  white,
  textDarkGray,
  black,
  textGray,
  borderLightGray,
  red,
  blue,
  green,
} = Colors
const {
  screenWidth,
  baseMargin,
  doubleBaseMargin,
  section,
  doubleSection,
  screenHeight,
  cornerRadius,
} = Metrics

const smallerScreen = screenHeight < 750

export default ScaledSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    flex: 2,
    padding: section,
    paddingTop: 0,
  },
  baseContainer: {
    padding: section,
    paddingTop: 0,
  },
  heroContainer: {
    alignItems: 'center',
    paddingTop: baseMargin,
  },
  heroImage: {
    width: ifIphoneX('147@ms', '120@ms'),
    height: ifIphoneX('147@ms', '120@ms'),
    resizeMode: 'contain',
    marginBottom: ifIphoneX(section, baseMargin * 1.5),
  },
  heroTitle: {
    fontSize: ifIphoneX(size.h3, size.h4),
    color: black,
    marginBottom: baseMargin,
  },
  heroSummary: {
    ...style.medium,
    fontSize: ifIphoneX(size.large, size.medium),
    color: textGray,
    marginBottom: baseMargin * 1.5,
  },
  heroInfo: {
    ...style.medium,
    fontSize: ifIphoneX(size.medium, size.medium),
    color: textGray,
    marginTop: baseMargin / 2,
    marginBottom: baseMargin * 1.5,
  },
  title: {
    marginBottom: section,
    fontSize: ifIphoneX(size.h3, size.h4),
  },
  titleSpaced: {
    marginTop: baseMargin,
    marginBottom: baseMargin,
  },
  subTitle: {
    marginBottom: smallerScreen ? baseMargin : 0,
  },
  form: {
    paddingTop: smallerScreen ? 0 : section,
  },
  row: {
    marginBottom: baseMargin * 1.6,
    flexDirection: 'row',
  },
  columRow: {
    marginBottom: baseMargin * 1.6,
  },
  colum: {
    flex: 1,
  },
  leftSpaced: {
    paddingLeft: baseMargin,
  },
  lastNameNote: {
    marginTop: baseMargin / 3,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: section,
  },
  continueButton: {
    marginTop: doubleSection,
    marginBottom: baseMargin,
  },
  spaced: {
    marginTop: section,
  },
  footerNote: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: baseMargin / 2,
    marginBottom: ifIphoneX(-doubleBaseMargin, -section),
  },
  inline: {
    flexDirection: 'row',
  },
  link: {
    paddingHorizontal: baseMargin / 3,
  },
  linkButton: {
    paddingVertical: baseMargin,
    paddingHorizontal: baseMargin,
  },
  resendText: {
    color: blue,
  },
  forgetButton: {
    // marginTop: ifIphoneX(doubleSection, section),
  },
  forgotPasswordText: {
    fontWeight: '400',
    color: blue,
  },
  email: {
    width: '80@ms',
    height: '80@ms',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: baseMargin * 1.25,
    marginLeft: -baseMargin / 4,
    marginRight: -baseMargin / 4,
    marginBottom: baseMargin * 2,
  },
  blockInput: {
    borderRadius: cornerRadius,
    // borderColor: blue,
    // borderWidth: 1.5,
    height: '48@ms',
    width: '47@ms',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 0,
  },
  blockInputText: {
    height: '48@ms',
    fontSize: size.large,
  },
  notSeeButton: {
    position: 'absolute',
    right: baseMargin,
    top: 14,
    zIndex: 9,
  },
  introBody: {
    flex: ifIphoneX(2, 2.5),
  },
  introSlides: {},
  slide: {
    width: screenWidth - doubleSection,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: {
    width: '46%',
    height: '36%',
    resizeMode: 'contain',
    marginBottom: section,
  },
  slideTitle: {
    fontSize: size.h3,
    color: black,
    marginBottom: baseMargin,
  },
  slideSummary: {
    ...style.medium,
    fontSize: size.large,
    color: textGray,
  },
  slidesPagination: {
    bottom: ifIphoneX(section, 0),
    paddingHorizontal: baseMargin / 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 0,
    borderRadius: cornerRadius,
    backgroundColor: white,
  },
  slidePaginationDot: {
    width: '6.75@ms',
    height: '6.75@ms',
    marginHorizontal: baseMargin / 4,
  },
  slidePaginationDotActive: {
    backgroundColor: green,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: ifIphoneX(section, doubleBaseMargin),
  },
  footerBase: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: section,
    paddingBottom: doubleSection,
  },
  footerButton: {
    // marginTop: doubleSection,
    marginBottom: baseMargin,
  },
  ctaButton: {
    marginTop: baseMargin,
  },
  orContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: baseMargin * 1.5,
    paddingBottom: baseMargin * 1.5,
  },
  orLine: {
    width: '40%',
    height: 0.5,
    backgroundColor: borderLightGray,
  },
  orText: {
    ...style.medium,
    fontSize: size.irregular,
    color: textDarkGray,
    zIndex: 1,
    paddingHorizontal: doubleBaseMargin * 1.2,
  },
  passwordInstructions: {
    marginTop: -baseMargin,
    marginBottom: baseMargin,
  },
  passwordErrorText: {
    color: red,
    fontWeight: '300',
    fontSize: size.standard,
  },
  passwordInstructionsText: {
    color: textGray,
    fontWeight: '300',
    fontSize: size.standard,
    marginTop: -baseMargin,
    marginBottom: baseMargin * 1.5,
  },
  inputBordered: {
    borderColor: blue,
    borderWidth: 1.5,
  },
  iconCircle: {
    marginBottom: baseMargin * 1.5,
    alignSelf: 'center',
    width: '80@ms',
    height: '80@ms',
    backgroundColor: `${green}11`,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  circleIcon: {
    width: '48@ms',
    height: '48@ms',
  },
})
