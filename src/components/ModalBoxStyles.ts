import { ScaledSheet } from 'react-native-size-matters'
import { Colors, Metrics, Fonts } from '../common'

const { textGray, white, darkGray, gray, textBlack, lightGray } = Colors
const {
  section,
  doubleSection,
  doubleBaseMargin,
  baseMargin,
  buttonRadius,
  screenHeight,
  screenWidth,
} = Metrics
const { size, style } = Fonts

export default ScaledSheet.create({
  shade: {
    position: 'absolute',
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogBox: {
    backgroundColor: white,
    borderRadius: buttonRadius,
    paddingTop: baseMargin,
    height: 'auto',
    maxHeight: '80%',
    minWidth: '90%',
    maxWidth: '90%',
    alignItems: 'center',
    width: 'auto',
  },
  uncentered: {
    alignItems: 'flex-start',
  },
  dialogTitle: {
    flexDirection: 'row',
    minHeight: 40,
    padding: baseMargin,
    paddingTop: baseMargin * 1.2,
    paddingBottom: 0,
  },
  titleText: {
    ...style.bold,
    fontSize: size.medium,
    marginBottom: baseMargin,
    color: textBlack,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogBody: {
    width: '100%',
    paddingHorizontal: section,
    paddingBottom: section,
    alignItems: 'center',
  },
  closeButton: {
    padding: doubleBaseMargin,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  closeIcon: {
    height: 17,
    width: 17,
  },
})
