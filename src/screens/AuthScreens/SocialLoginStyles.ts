import { ScaledSheet } from 'react-native-size-matters'
import { Colors, Fonts, Metrics } from '../../common'

const {
  facebookBlue,
  googleWhite,
  appleBlack,
  buttonColor,
  textDarkGray,
  white,
} = Colors
const { baseMargin, buttonRadius } = Metrics

export default ScaledSheet.create({
  socialLogin: {},
  socialButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    borderRadius: buttonRadius,
    paddingVertical: baseMargin * 1.25,
    marginBottom: baseMargin,
  },
  socialIcon: {
    width: '21@ms',
    height: '21@ms',
    marginLeft: baseMargin * 1.5,
    resizeMode: 'contain',
  },
  socialInfo: {
    flex: 1,
    alignItems: 'center',
  },
  appleButton: {
    backgroundColor: appleBlack,
  },
  googleButton: {
    backgroundColor: googleWhite,
  },
  facebookButton: {
    backgroundColor: facebookBlue,
  },
  socialText: {
    color: white,
    fontSize: Fonts.size.h7,
  },
  googleText: {
    color: textDarkGray,
  },
  bordered: {
    borderWidth: 0.3,
    borderColor: buttonColor,
  },
})
