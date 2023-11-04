import { ScaledSheet } from 'react-native-size-matters'
import { Colors, Metrics } from '../../common'

const {
  ifIOS,
  baseMargin,
  doubleBaseMargin,
  cornerRadius,
  screenWidth,
  screenHeight,
} = Metrics
const { white, green } = Colors

export const IMAGE_WIDTH = (screenWidth - doubleBaseMargin * 2) * 0.225
export const IMAGE_HEIGHT = screenHeight * 0.12
export const IMAGES_WIDTH = screenWidth - doubleBaseMargin * 2
export const BLOCK_STYLE = {
  height: IMAGE_HEIGHT,
  width: IMAGE_WIDTH,
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: baseMargin,
  marginBottom: baseMargin,
}

export default ScaledSheet.create({
  imageContainer: {
    ...BLOCK_STYLE,
  },
  imageWrapper: {
    height: IMAGE_HEIGHT,
    width: IMAGE_WIDTH,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: cornerRadius / 1.5,
  },
  closeButton: {
    width: 25,
    height: 25,
    top: -8,
    right: -8,
  },
  closeIcon: {
    width: 12,
    height: 12,
  },
})
