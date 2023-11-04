import { moderateScale } from 'react-native-size-matters'

// export enum type {
//   light = 'OpenSans-Light',
//   lightItalic = 'OpenSans-LightItalic',
//   regular = 'OpenSans-Regular',
//   italic = 'OpenSans-Italic',
//   semiBold = 'OpenSans-SemiBold',
//   semiBoldItalic = 'OpenSans-SemiBoldItalic',
//   bold = 'OpenSans-Bold',
//   boldItalic = 'OpenSans-BoldItalic',
//   extraBold = 'OpenSans-ExtraBold',
//   extraBoldItalic = 'OpenSans-ExtraBoldItalic',
// }
export enum type {
  light = 'Manrope-Light',
  lightItalic = 'Manrope-Light', // placeholder for now
  medium = 'Manrope-Medium',
  regular = 'Manrope-Regular',
  italic = 'Manrope-Regular', // placeholder for now
  semiBold = 'Manrope-Semibold',
  semiBoldItalic = 'Manrope-Semibold', // placeholder for now
  bold = 'Manrope-Bold',
  boldItalic = 'Manrope-Bold', // placeholder for now
  extraBold = 'Manrope-Extrabold',
  extraBoldItalic = 'Manrope-Extrabold', // placeholder for now
}

export type FontStyle =
  | 'light'
  | 'lightItalic'
  | 'medium'
  | 'regular'
  | 'italic'
  | 'normalText'
  | 'semiBold'
  | 'semiBoldItalic'
  | 'bold'
  | 'boldItalic'
  | 'boldText'
  | 'extraBold'
  | 'extraBoldItalic'
  | 'buttonText'

export type FontSize =
  | 'h0'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'button'
  | 'input'
  | 'xlarge'
  | 'large'
  | 'medium'
  | 'irregular'
  | 'regular'
  | 'standard'
  | 'small'
  | 'tiny'
  | 'micro'
  | 'nano'

export const size = {
  h0: moderateScale(34),
  h1: moderateScale(28),
  h2: moderateScale(26),
  h3: moderateScale(24),
  h4: moderateScale(22),
  h5: moderateScale(20),
  h6: moderateScale(18),
  h7: moderateScale(16),
  h8: moderateScale(14),
  button: moderateScale(16),
  input: moderateScale(15),
  xlarge: moderateScale(19),
  large: moderateScale(17),
  medium: moderateScale(15),
  regular: moderateScale(14),
  irregular: moderateScale(13),
  standard: moderateScale(12),
  small: moderateScale(10),
  tiny: moderateScale(9),
  micro: moderateScale(8),
  nano: moderateScale(7),
}

export const style = {
  light: {
    fontFamily: type.light,
    fontWeight: '200',
  },
  lightItalic: {
    fontFamily: type.lightItalic,
    fontWeight: '200',
    fontStyle: 'italic',
  },
  medium: {
    fontFamily: type.medium,
    fontWeight: '400',
  },
  regular: {
    fontFamily: type.regular,
    fontWeight: '500',
  },
  italic: {
    fontFamily: type.italic,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  semiBold: {
    fontFamily: type.semiBold,
    fontWeight: '600',
  },
  semiBoldItalic: {
    fontFamily: type.semiBoldItalic,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  bold: {
    fontFamily: type.bold,
    fontWeight: '700',
  },
  boldItalic: {
    fontFamily: type.boldItalic,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  extraBold: {
    fontFamily: type.extraBold,
    fontWeight: '800',
  },
  extraBoldItalic: {
    fontFamily: type.extraBoldItalic,
    fontWeight: '800',
    fontStyle: 'italic',
  },
  inputText: {
    fontFamily: type.regular,
    fontWeight: '400',
    fontSize: size.input,
  },
  normalText: {
    fontFamily: type.regular,
    fontWeight: '400',
    fontSize: size.regular,
  },
  mediumText: {
    fontFamily: type.semiBold,
    fontWeight: '600',
    fontSize: size.regular,
  },
  heroText: {
    fontFamily: type.bold,
    fontWeight: '700',
    fontSize: size.h0,
  },
  boldText: {
    fontFamily: type.bold,
    fontWeight: '700',
    fontSize: size.regular,
  },
  semiBoldText: {
    fontFamily: type.semiBold,
    fontWeight: '600',
    fontSize: size.regular,
  },
  smallText: {
    fontFamily: type.regular,
    fontWeight: '400',
    fontSize: size.small,
  },
  tinyText: {
    fontFamily: type.regular,
    fontWeight: '400',
    fontSize: size.tiny,
  },
  microText: {
    fontFamily: type.regular,
    fontWeight: '400',
    fontSize: size.micro,
  },
  buttonText: {
    fontFamily: type.semiBold,
    fontWeight: '600',
    fontSize: size.button,
  },
}

export default {
  type,
  size,
  style,
}
