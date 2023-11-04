import { ScaledSheet } from 'react-native-size-matters'
import { Fonts, Colors, Metrics } from '../common'

const { baseMargin, buttonRadius, roundedButtonRadius } = Metrics
const { style, size } = Fonts
const { textDarkGray, blue, gray, white, transparent } = Colors

export default ScaledSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: buttonRadius,
    backgroundColor: blue,
    borderWidth: 0,
    borderColor: blue,
    minHeight: 45,
  },
  tightButton: {
    borderRadius: buttonRadius * 0.8,
  },
  textWrapper: {
    paddingHorizontal: baseMargin,
    paddingVertical: baseMargin,
  },
  text: {
    ...style.buttonText,
    // ...style.regular,
    marginBottom: 2,
    color: white,
  },
  tightWrapper: {
    paddingHorizontal: baseMargin * 1.5,
    paddingVertical: baseMargin,
  },
  slimWrapper: {
    paddingHorizontal: baseMargin * 1.5,
    paddingVertical: baseMargin / 1.75,
  },
  bigWrapper: {
    paddingVertical: baseMargin * 1.5,
  },
  bigText: {
    fontSize: size.h4,
  },
  outlined: {
    backgroundColor: transparent,
    borderWidth: 1,
    borderColor: blue,
  },
  rounded: {
    borderRadius: roundedButtonRadius,
  },
  outlinedText: {
    color: blue,
    // ...style.semiBold
  },
  whiteButton: {
    backgroundColor: white,
    borderColor: white,
  },
  blackText: {
    color: textDarkGray,
  },
  faded: {
    opacity: 0.5,
  },
  grayed: {
    backgroundColor: gray,
    borderColor: gray,
  },
  block: {
    width: '100%',
  },
  loading: {
    minHeight: 26, //'23@ms',
    marginVertical: 0,
  },
  blueGradient: {
    borderRadius: buttonRadius,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
    width: '100%',
    height: '100%',
  },
})
