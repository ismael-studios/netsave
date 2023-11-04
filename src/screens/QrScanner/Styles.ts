import { ScaledSheet } from 'react-native-size-matters'
import { Colors, Fonts, Metrics } from '../../common'

const { green, lightGray } = Colors
const { style, size } = Fonts
const { screenWidth, doubleBaseMargin, doubleSection } = Metrics

const overlayColor = 'rgba(0,0,0,0.5)' // this gives us a black color with a 50% transparency
const rectDimensions = screenWidth * 0.65 // this is equivalent to 255 from a 393 device width
const rectBorderWidth = screenWidth * 0.01 // this is equivalent to 2 from a 393 device width
const rectBorderColor = green
const rectSize = 30
const rectWidth = 4

export default ScaledSheet.create({
  container: {
    flex: 1,
  },
  selections: {
    flexDirection: 'row',
    backgroundColor: lightGray,
  },
  selectButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: doubleBaseMargin,
  },
  activeButton: {
    borderBottomWidth: 3,
    borderBottomColor: green,
  },
  buttonText: {
    ...style.bold,
    fontSize: size.h6,
  },
  rectangleContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rectangle: {
    height: rectDimensions,
    width: rectDimensions,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  row: { width: '100%', flexDirection: 'row' },
  shade: {
    flex: 1,
    backgroundColor: overlayColor,
  },
  wide: {
    width: '100%',
  },
  topLeft: {
    width: rectSize,
    height: rectSize,
    position: 'absolute',
    top: 0,
    left: 0,
    borderLeftWidth: rectWidth,
    borderTopWidth: rectWidth,
    borderColor: green,
  },
  topRight: {
    width: rectSize,
    height: rectSize,
    position: 'absolute',
    top: 0,
    right: 0,
    borderRightWidth: rectWidth,
    borderTopWidth: rectWidth,
    borderColor: green,
  },
  bottomLeft: {
    width: rectSize,
    height: rectSize,
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderLeftWidth: rectWidth,
    borderBottomWidth: rectWidth,
    borderColor: green,
  },
  bottomRight: {
    width: rectSize,
    height: rectSize,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRightWidth: rectWidth,
    borderBottomWidth: rectWidth,
    borderColor: green,
  },
  verifyButton: {
    marginTop: doubleSection,
  },
  codeInputContainer: {
    padding: doubleBaseMargin,
  },
  instruction: {
    ...style.bold,
    fontSize: size.h5,
  },
})
