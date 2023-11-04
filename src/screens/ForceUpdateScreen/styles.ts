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
    justifyContent: 'center',
  },
  logo: {
    width: '80@ms',
    height: '80@ms',
    resizeMode: 'contain',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: doubleBaseMargin,
    paddingBottom: baseMargin,
  },
  cardView: {
    backgroundColor: white,
    padding: doubleBaseMargin * 1.5,
    borderRadius: cornerRadius,
    margin: baseMargin * 3,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: size.h4,
    fontWeight: '700',
    marginVertical: baseMargin * 1.5,
  },
  cardDescription: {
    fontSize: size.small,
    marginBottom: doubleBaseMargin * 1.2,
    textAlign: 'center',
  },
})
