import { ScaledSheet } from 'react-native-size-matters'
import { Metrics, Colors, Fonts } from '../../common'
import { ifIphoneX } from 'react-native-iphone-x-helper'

const { baseMargin, doubleBaseMargin, section, screenHeight } = Metrics
const { green } = Colors
const { size, style } = Fonts

export default ScaledSheet.create({
  noProducts: {},
  categoryDisplay: {
    width: '100%',
    height: (screenHeight - 300) * 0.2, //'35%', // '100@vs', //
    resizeMode: 'contain',
    marginBottom: baseMargin,
  },
  sorryText: {
    fontSize: size.standard,
    marginBottom: baseMargin,
    textAlign: 'center',
  },
  button: {
    marginBottom: doubleBaseMargin,
  },
  mapPoint: {
    width: '25@ms',
    height: '25@ms',
    resizeMode: 'contain',
    marginRight: baseMargin / 2,
  },
  smallPoint: {
    width: '18@ms',
    height: '18@ms',
    marginTop: 3,
    marginRight: 2,
    marginLeft: 2,
  },
  plusButton: { alignItems: 'center', marginVertical: doubleBaseMargin },
  plusCircle: {
    width: 96,
    height: 96,
    backgroundColor: Colors.green,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: baseMargin,
  },
  plusImage: {
    width: '45@ms',
    height: '45@ms',
  },
  confetti2: {
    width: '100%',
    height: 80,
    marginTop: -30,
    resizeMode: 'contain',
  },
  icon: {
    width: '24@ms',
    height: '24@ms',
    resizeMode: 'contain',
    marginRight: baseMargin,
  },
})
