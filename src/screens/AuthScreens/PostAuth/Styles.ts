import { ScaledSheet } from 'react-native-size-matters'
import { Colors, Fonts, Metrics } from '../../../common'
import { ifIphoneX } from 'react-native-iphone-x-helper'

const { style, size } = Fonts
const { green, blue, red, borderGray, lightGray, textGray } = Colors
const {
  baseMargin,
  doubleBaseMargin,
  section,
  doubleSection,
  buttonRadius,
  screenHeight,
} = Metrics
const smallerScreen = screenHeight < 750

export default ScaledSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    paddingHorizontal: doubleBaseMargin,
  },
  form: {
    paddingTop: smallerScreen ? 0 : doubleBaseMargin,
  },
  row: {
    marginBottom: baseMargin * 1.6,
    flexDirection: 'row',
  },
  columRow: {
    marginBottom: baseMargin * 1.6,
  },
  button: {
    marginTop: section,
  },
  spaced: {
    marginTop: section,
  },
  topContainer: {
    width: '100%',
    paddingHorizontal: baseMargin,
    paddingTop: ifIphoneX(baseMargin, 0),
  },
  title: {
    marginBottom: '5@vs',
  },
  topTitle: {
    alignItems: 'center',
    paddingHorizontal: section,
    paddingTop: ifIphoneX(doubleSection, section),
  },
  confettiContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  confetti: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  confetti2: {
    width: '100%',
    height: 110,
    marginTop: -36,
    resizeMode: 'contain',
  },
  confettiLogo: {
    width: 50,
    height: 50,
    marginTop: -80,
  },
  welcomeDetails: {
    alignItems: 'center',
    paddingVertical: baseMargin,
    paddingHorizontal: section,
  },
  details: {
    alignItems: 'center',
    paddingHorizontal: doubleBaseMargin * 0.9,
  },
  features: {
    paddingTop: baseMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feature: {
    width: '33.33%',
    marginHorizontal: baseMargin / 2,
    alignItems: 'center',
  },
  featureRound: {
    borderRadius: 50,
    backgroundColor: lightGray,
    width: '68@ms',
    height: '68@ms',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: baseMargin,
  },
  featureIcon: {
    width: '33@ms',
    height: '33@ms',
  },
  welcomeProfile: {
    borderRadius: 100,
    overflow: 'hidden',
    marginTop: '-70@ms',
    marginBottom: '-10@ms',
    width: '70@ms',
    height: '70@ms',
    borderWidth: 3,
    borderColor: green,
  },
  featureIcon2: {
    width: '28@ms',
    height: '28@ms',
  },
  featureText: {
    ...style.semiBold,
    fontSize: size.tiny,
  },
  buttons: {
    flex: 1,
    minHeight: '75@mvs',
    paddingHorizontal: doubleBaseMargin,
    justifyContent: 'flex-end',
    paddingBottom: ifIphoneX(baseMargin, 0),
  },
  buttonSpaced: {
    marginBottom: doubleBaseMargin,
  },
  locationButtonGroup: {
    flex: 0,
  },
  featureIcon: {
    width: '135@ms',
    height: '135@ms',
    resizeMode: 'contain',
  },
  procedures: {
    backgroundColor: `${green}14`,
    marginTop: doubleBaseMargin,
    paddingHorizontal: doubleBaseMargin,
    paddingVertical: baseMargin,
    borderRadius: buttonRadius,
  },
  colonTitle: {
    fontSize: size.h6,
    marginVertical: doubleBaseMargin,
  },
  check: {
    marginTop: baseMargin / 2,
    marginRight: baseMargin,
    width: '18@ms',
    height: '14@ms',
  },
  point: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: section,
  },
  pointText: {
    flexWrap: 'wrap',
    marginLeft: Metrics.baseMargin * 1.7,
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: doubleBaseMargin,
    paddingRight: doubleSection * 1.5,
  },
  checkBox: {
    marginLeft: baseMargin * 0.7,
  },
  notNow: {
    paddingTop: baseMargin,
    paddingBottom: section,
  },
  circle: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  safetyLogo: {
    alignSelf: 'center',
    marginTop: doubleBaseMargin,
    width: '112@ms',
    height: '135@ms',
  },
  backButton: {
    marginTop: baseMargin,
    alignSelf: 'flex-start',
  },
  footerBase: {
    flex: 1,
    minHeight: 120,
    justifyContent: 'flex-end',
    paddingHorizontal: section,
    paddingBottom: doubleBaseMargin * 1.5,
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: section,
  },
  profileButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${green}20`,
    borderRadius: 100,
    minHeight: 130,
    minWidth: 130,
    overflow: 'hidden',
  },
  profileImage: {
    minHeight: 130,
    minWidth: 130,
    resizeMode: 'cover',
  },
  profileIcon: {
    width: 50,
    height: 50,
  },
  profileSelectButton: {
    paddingHorizontal: baseMargin,
    paddingVertical: baseMargin / 2,
    borderWidth: 1,
    borderColor: borderGray,
    borderRadius: 25,
  },
  profileSelectText: {
    fontWeight: 'bold',
  },
  atSign: {
    marginRight: -baseMargin / 2,
    marginTop: -baseMargin / 4,
    marginLeft: doubleBaseMargin * 1.75,
    alignSelf: 'center',
    color: textGray,
    fontSize: size.h2,
  },
  errorText: {
    paddingLeft: baseMargin / 2,
    paddingTop: baseMargin / 2,
    color: red,
    fontSize: size.small,
  },
  welcomeLogo: {
    width: '171@ms',
    height: '148@ms',
    marginBottom: doubleSection,
  },
  welcomeGift: {
    paddingHorizontal: section,
    paddingTop: baseMargin * 0.6,
  },
  welcomePointsUse: {
    paddingTop: section,
    paddingHorizontal: section,
  },
  welcomeConfetti: {
    width: '370@ms',
    height: '420@ms',
  },
  linkButton: {
    paddingVertical: baseMargin,
    paddingHorizontal: baseMargin,
  },
  resendText: {
    color: blue,
  },
  locationLogo: {
    alignItems: 'center',
    paddingTop: doubleSection,
  },
  locationDetail: {
    paddingVertical: baseMargin * 3.2,
    paddingHorizontal: baseMargin,
  },
  locationLogoIcon: {
    width: '120@ms',
    height: '120@ms',
  },
})
