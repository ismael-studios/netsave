import { ScaledSheet } from 'react-native-size-matters'
import { Colors, Fonts, Metrics } from '../../common'

const { white, gray, whiteGray } = Colors
const { style, size } = Fonts
const { baseMargin, doubleBaseMargin, section, ifIOS } = Metrics

export default ScaledSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  qrCode: {
    width: '100%',
    alignItems: 'center',
    paddingTop: section * 1.5,
    paddingBottom: doubleBaseMargin,
  },
  orContainer: {
    paddingHorizontal: doubleBaseMargin,
    width: '100%',
    alignItems: 'center',
    paddingTop: '5@vs',
    paddingBottom: '23@vs',
  },
  or: {
    ...style.semiBold,
    fontSize: size.h5,
    color: gray,
    backgroundColor: white,
    zIndex: 1,
    paddingHorizontal: doubleBaseMargin * 1.2,
  },
  line: {
    marginTop: -baseMargin / 1.7,
    zIndex: -0,
    width: '100%',
    height: 1,
    backgroundColor: whiteGray,
  },
  codeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: doubleBaseMargin,
  },
  codeLabel: {
    fontSize: size.h5,
  },
  codeText: {
    ...style.bold,
    fontSize: size.h0 * 1.4,
    textAlign: 'center',
    letterSpacing: size.h3,
    paddingLeft: ifIOS(size.h3, 0),
    marginTop: baseMargin / 2,
  },
  textStyle: {
    textAlign: 'center',
    margin: 10,
  },
  actions: {
    width: '100%',
    paddingHorizontal: doubleBaseMargin,
    paddingBottom: doubleBaseMargin,
  },
})
