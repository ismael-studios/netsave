import { ScaledSheet } from 'react-native-size-matters'
import { Colors } from '../common'

const { green } = Colors
const imageColor = green
const imageSize = '20@ms'
const imageMode = 'contain'

export default ScaledSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '21@ms',
    height: '21@ms',
  },
  seeImage: {
    width: imageSize,
    height: imageSize,
    resizeMode: imageMode,
    tintColor: imageColor,
  },
  seeNotImage: {
    width: imageSize,
    height: imageSize,
    resizeMode: imageMode,
    tintColor: imageColor,
  },
})
