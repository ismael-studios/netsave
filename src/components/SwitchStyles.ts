import { ScaledSheet } from 'react-native-size-matters'
import { Colors, Fonts, Metrics } from '../common'

const { size, style } = Fonts
const { baseMargin } = Metrics
const { green, white, textGray, borderGray } = Colors
const text = {
  ...style.bold,
  color: white,
  fontSize: size.small,
  paddingHorizontal: baseMargin / 4,
}
const notchSize = 25

export default ScaledSheet.create({
  container: {},
  switchBG: {
    height: `${notchSize + 6}@ms`,
    borderWidth: 3,
    borderColor: green,
    borderRadius: 50,
    flexDirection: 'row',
    backgroundColor: green,
    paddingVertical: baseMargin / 2,
  },
  switchOffBG: {
    borderColor: borderGray,
    backgroundColor: borderGray,
  },
  onText: {
    ...text,
    paddingLeft: baseMargin / 1.5,
  },
  offText: {
    ...text,
    paddingRight: baseMargin / 1.75,
    color: textGray,
  },
  notch: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderRadius: 50,
    width: `${notchSize}@ms`,
    height: `${notchSize}@ms`,
    backgroundColor: white,
  },
  notchOff: {
    left: 0,
  },
})
