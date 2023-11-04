import { ScaledSheet } from 'react-native-size-matters'
import { Colors, Fonts, Metrics } from '../../common'

const { style, size } = Fonts
const { white } = Colors
const { baseMargin, section, doubleBaseMargin, cornerRadius } = Metrics

export default ScaledSheet.create({
  container: {
    flex: 1,
  },
  bg: {
    flex: 1,
  },
  tint: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000090',
  },
  top: {
    flex: 1,
    paddingBottom: section,
    justifyContent: 'flex-end',
    paddingHorizontal: section,
  },
  logo: {
    width: '232@ms',
    tintColor: white,
    resizeMode: 'contain',
    aspectRatio: 3.6,
  },
  blurb: {
    paddingBottom: section,
  },
  blurbTexts: {
    paddingHorizontal: section,
    marginBottom: baseMargin * 1.5,
  },
  title: {
    ...style.heroText,
    lineHeight: size.h0 * 1.1,
    color: white,
  },
  subtitle: {
    ...style.semiBoldText,
    color: white,
  },
  footer: {
    borderTopLeftRadius: cornerRadius,
    borderTopRightRadius: cornerRadius,
    padding: doubleBaseMargin,
    backgroundColor: white,
  },
  button: {},
  login: {
    marginTop: doubleBaseMargin,
  },
  skipButton: {
    position: 'absolute',
    zIndex: 999,
    top: baseMargin,
    right: doubleBaseMargin,
    alignItems: 'center',
    paddingVertical: doubleBaseMargin,
    paddingBottom: baseMargin,
  },
})
