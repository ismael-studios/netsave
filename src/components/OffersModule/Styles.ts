import { ScaledSheet } from 'react-native-size-matters'
import { Metrics, Colors, Fonts } from '../../common'

const { lighterBlueGray, darkGray, orange, white, green } = Colors
const {
  ifIOS,
  section,
  baseMargin,
  buttonRadius,
  doubleBaseMargin,
  cornerRadius,
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
    minHeight: 120,
    minWidth: 200,
    maxWidth: '90%',
    alignItems: 'center',
    height: 'auto',
    width: 'auto',
  },
  dialogTitle: {
    flexDirection: 'row',
    minHeight: 40,
    padding: baseMargin,
    paddingTop: doubleBaseMargin,
  },
  titleText: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogBody: {
    paddingHorizontal: section,
    alignItems: 'center',
  },
  closeButton: {
    padding: baseMargin * 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  closeIcon: {
    tintColor: darkGray,
  },
  dialogActions: {
    flexDirection: 'row',
    marginTop: baseMargin,
    paddingTop: baseMargin,
    paddingHorizontal: baseMargin * 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: section,
  },
  actionButton: {
    marginHorizontal: baseMargin,
  },
  positiveButton: {
    backgroundColor: green,
  },
  dangerButton: {
    backgroundColor: orange,
  },
  actionIcon: {
    marginRight: baseMargin,
    color: white,
    fontSize: size.h5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceInput: {
    borderBottomWidth: 0,
    marginBottom: baseMargin,
  },
  priceInputText: {
    ...style.extraBold,
    padding: baseMargin,
    paddingBottom: baseMargin * 1.25,
    borderRadius: cornerRadius,
    backgroundColor: lighterBlueGray,
    fontSize: size.h2,
    color: orange,
    height: ifIOS(50, 60),
  },
  transparentPrice: {
    backgroundColor: 'transparent',
  },
  input: {
    borderRadius: cornerRadius,
    backgroundColor: lighterBlueGray,
    borderBottomWidth: 0,
    minHeight: '78@mvs',
    padding: baseMargin,
  },
  priceWrapper: {
    paddingBottom: baseMargin,
  },
  inputText: {
    textAlign: 'left',
    paddingLeft: baseMargin / 2,
    paddingRight: baseMargin / 2,
  },
  buttons: {
    // paddingTop: section
    width: '100%',
  },
  button: {
    marginTop: section,
    paddingHorizontal: baseMargin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: size.standard,
    textAlign: 'center',
  },
  greenText: {
    color: green,
    fontSize: size.standard,
    textAlign: 'center',
  },
  textRow: {
    marginBottom: doubleBaseMargin,
  },
})
