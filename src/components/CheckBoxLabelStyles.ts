import { ScaledSheet } from 'react-native-size-matters'
import { Colors, Fonts, Metrics } from '../common'

const { doubleBaseMargin, baseMargin } = Metrics
const { size } = Fonts
const { green, white, lighterGray } = Colors

export default ScaledSheet.create({
  checkBox: {
    width: '20@ms',
    height: '20@ms',
    borderWidth: 2,
    borderColor: lighterGray,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: doubleBaseMargin,
    backgroundColor: white,
  },
  tightCheckbox: {
    marginRight: baseMargin,
  },
  activeCheckbox: {
    backgroundColor: green,
    borderColor: green,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offsetTop: {
    marginTop: 5,
  },
  checkTick: {
    width: '10@ms',
    height: '10@ms',
    tintColor: white,
    resizeMode: 'contain',
  },
  text: {
    fontSize: size.h5,
    paddingBottom: 2,
  },
  smallText: {
    fontSize: size.h6,
  },
  activeText: {
    color: green,
  },
})
