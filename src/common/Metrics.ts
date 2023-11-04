import { Dimensions, Platform } from 'react-native'
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters'

const { width, height } = Dimensions.get('window')
export const IS_IOS = Platform.OS === 'ios'
export const ifIOS = <T>(is: T, isnt: T) => (IS_IOS ? is : isnt)

const Metrics = {
  IS_IOS,
  IS_ANDROID: !IS_IOS,
  ifIOS,
  section: moderateScale(25),
  baseMargin: moderateScale(10),
  doubleSection: moderateScale(50),
  doubleBaseMargin: moderateScale(20),
  screenWidth: width < height ? width : height - ifIOS(0, 23),
  screenHeight: width < height ? height - ifIOS(0, 23) : width,
  headerHeight: moderateVerticalScale(70),
  footerHeight: moderateVerticalScale(70),
  buttonRadius: moderateScale(8),
  roundedButtonRadius: 100,
  cornerRadius: moderateScale(8),
  inputRadius: moderateScale(8),
}

export default Metrics
