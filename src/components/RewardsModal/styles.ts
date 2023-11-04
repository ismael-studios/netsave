import { ScaledSheet } from 'react-native-size-matters'
import { Metrics, Fonts, Colors } from '../../common'
import { ifIphoneX } from 'react-native-iphone-x-helper'

const { baseMargin, footerHeight } = Metrics
const { green, white, darkGray, borderGray } = Colors
const { size, style } = Fonts

export default ScaledSheet.create({
  container: {
    position: 'absolute',
    top: -120,
    backgroundColor: 'white',
    borderRadius: 100,
    padding: 12,
    zIndex: 10,
  },
  circleView: {
    backgroundColor: '#FF9C43',
    height: 110,
    width: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#FF7A00',
  },
  innerCircleView: {
    backgroundColor: '#FF7A00',
    height: 80,
    width: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confetti2: {
    width: '100%',
    height: 110,
    marginTop: -36,
    resizeMode: 'contain',
  },
})
