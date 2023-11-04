import { ScaledSheet } from 'react-native-size-matters'
import { Fonts, Colors, Metrics } from '../common'

const { textBlack, blue } = Colors
const { baseMargin, doubleBaseMargin, ifIOS, inputRadius } = Metrics
const { size, style } = Fonts

export default ScaledSheet.create({
  container: {
    width: '100%',
    height: '48@ms',
    paddingBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: inputRadius,
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: Colors.inputBackground,
  },
  multiline: {
    height: 'auto',
    minHeight: '48@ms',
    maxHeight: '120@ms',
    paddingBottom: ifIOS(5, 0),
  },
  label: {
    ...style.bold,
    fontSize: size.input,
  },
  inputWrapper: {
    flexDirection: 'row',
  },
  input: {
    ...style.inputText,
    width: '100%',
    height: '48@ms',
    color: textBlack,
    marginTop: ifIOS(0, -baseMargin / 1.5),
    paddingHorizontal: baseMargin,
  },
  inputFocused: {
    color: blue,
  },
  password: {
    width: 'auto',
    flex: 1,
  },
  unbordered: {
    borderWidth: 0,
    paddingVertical: baseMargin / 2,
    paddingHorizontal: doubleBaseMargin,
    backgroundColor: textBlack,
  },
  bordered: {
    borderColor: blue,
    borderWidth: 1.5,
  },
  center: {
    textAlign: 'center',
  },
  icon: {},
})
