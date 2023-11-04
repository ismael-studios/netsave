import { ScaledSheet } from 'react-native-size-matters'
import { Metrics, Colors, Fonts } from '../../common'

const { baseMargin, cornerRadius, doubleBaseMargin } = Metrics
const { borderGray, green } = Colors
const { size } = Fonts

export default ScaledSheet.create({
  container: {
    width: '100%',
    minHeight: 40,
    borderTopColor: borderGray,
    borderTopWidth: 0.5,
    paddingHorizontal: doubleBaseMargin,
    paddingTop: baseMargin * 1.5,
    marginBottom: baseMargin / 2,
    alignItems: 'center',
    flexDirection: 'row',
  },
  info: {
    paddingRight: baseMargin,
  },
  infoText: {
    fontSize: size.h6,
  },
  progress: {
    flex: 1,
    paddingLeft: baseMargin,
  },
  base: {
    height: 10,
    borderRadius: cornerRadius,
    backgroundColor: borderGray,
  },
  bar: {
    height: 10,
    width: '100%',
    borderRadius: cornerRadius,
    backgroundColor: green,
  },
})
