import { ScaledSheet } from 'react-native-size-matters'
import { Colors, Metrics, Fonts } from '../common'

const { green } = Colors
const { baseMargin, cornerRadius } = Metrics
const size = 6

export default ScaledSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewContainer: {
    borderRadius: cornerRadius / 1.5,
    borderColor: green,
    borderWidth: 1,
    paddingVertical: baseMargin * 0.8,
    paddingHorizontal: baseMargin,
  },
  arrow: {
    zIndex: 9,
    width: size,
    height: size,
    transform: [{ rotate: '45deg' }],
    borderBottomColor: green,
    borderBottomWidth: 1.5,
    borderRightColor: green,
    borderRightWidth: 1.5,
    marginTop: -3,
    marginRight: 1,
    width: 10,
    height: 10,
  },
  input: {
    ...Fonts.style.inputText,
    ...Fonts.style.semiBold,
    marginRight: baseMargin,
    color: green,
  },
})
