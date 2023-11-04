import { ScaledSheet } from 'react-native-size-matters'
import { Metrics, Colors, Fonts } from '../../common'

const { white, blue, orange } = Colors
const {
  section,
  baseMargin,
  buttonRadius,
  doubleBaseMargin,
  doubleSection,
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
    paddingHorizontal: section,
    minHeight: 120,
    minWidth: 200,
    maxWidth: '90%',
    alignItems: 'center',
    height: 'auto',
    // width: 'auto'
    width: screenWidth * 0.8,
  },
  dialogIcon: {
    alignItems: 'center',
    marginTop: section * 1.5,
    marginBottom: -section * 1.25,
  },
  dialogIconImage: {
    resizeMode: 'contain',
    width: '85@ms',
    height: '85@ms',
  },
  dialogTitle: {
    flexDirection: 'row',
    minHeight: 40,
    padding: baseMargin,
    marginTop: doubleSection / 1.5,
  },
  titleText: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogBody: {
    width: '100%',
    padding: baseMargin,
    alignItems: 'center',
  },
  bodyText: {
    fontSize: size.standard,
  },
  input: {
    maxWidth: '100%',
  },
  inputText: {
    ...style.bold,
    fontSize: size.standard,
  },
  closeButton: {
    padding: baseMargin * 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    position: 'absolute',
    top: baseMargin / 4,
    right: baseMargin / 4,
  },
  closeIcon: {
    tintColor: blue,
  },
  dialogActions: {
    width: '100%',
    marginTop: doubleBaseMargin,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: baseMargin * 1.5,
  },
  actionButton: {
    width: '100%',
    paddingVertical: 2,
    marginLeft: -baseMargin,
    marginRight: -baseMargin,
    marginBottom: baseMargin * 1.25,
  },
  positiveButton: {
    backgroundColor: blue,
  },
  dangerButton: {
    backgroundColor: orange,
  },
  blockButton: {
    width: '100%',
  },
  buttonText: {},
  actionIcon: {
    marginRight: baseMargin,
    color: white,
    fontSize: size.h5,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
