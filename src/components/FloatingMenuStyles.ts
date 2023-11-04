import { ScaledSheet } from 'react-native-size-matters'
import { Fonts, Colors, Metrics } from '../common'

const {
  baseMargin,
  doubleBaseMargin,
  buttonRadius,
  footerHeight,
  screenWidth,
  screenHeight,
} = Metrics
const { size } = Fonts
const { green, white, lightGrayBorder, borderGray } = Colors

export default ScaledSheet.create({
  shade: {
    position: 'absolute',
    zIndex: 999,
    elevation: 999,
    flex: 1,
    width: '100%',
    height: '100%',
    // width: screenWidth,
    // height: screenHeight - footerHeight,
    backgroundColor: '#00000045',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: white,
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '100%',
    maxHeight: (screenHeight - footerHeight) * 0.85,
    zIndex: 9,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 9,
    borderTopLeftRadius: buttonRadius,
    borderTopRightRadius: buttonRadius,
  },
  header: {
    borderBottomColor: borderGray,
    borderBottomWidth: 0.5,
    paddingVertical: baseMargin,
    paddingHorizontal: doubleBaseMargin,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: baseMargin * 1.5,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: -baseMargin / 2,
    padding: doubleBaseMargin,
  },
  closeIcon: {
    width: '21@ms',
    height: '21@ms',
  },
  notch: {
    backgroundColor: lightGrayBorder,
    borderRadius: buttonRadius,
    height: '5@ms',
    width: '40@ms',
    marginBottom: baseMargin,
  },
  menues: {
    paddingVertical: baseMargin,
  },
  menu: {},
  wrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: baseMargin,
    paddingHorizontal: doubleBaseMargin,
  },
  icon: {
    width: '20@ms',
    height: '20@ms',
    resizeMode: 'contain',
    marginRight: baseMargin,
    tintColor: green,
  },
  text: {
    fontSize: size.standard,
    color: green,
  },
  loading: {
    marginRight: baseMargin,
  },
})
