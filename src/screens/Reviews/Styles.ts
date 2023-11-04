import { ScaledSheet } from 'react-native-size-matters'
import { Colors, Fonts, Metrics } from '../../common'
import { BLOCK_STYLE } from '../../components/AddProduct/ImageBlockStyles'
import { ifIphoneX } from 'react-native-iphone-x-helper'

const { style, size } = Fonts
const { white, gray, green, darkGray, lightGray, borderGray, lighterBlueGray } =
  Colors

const {
  ifIOS,
  baseMargin,
  doubleBaseMargin,
  section,
  doubleSection,
  cornerRadius,
  screenWidth,
  screenHeight,
} = Metrics

export default ScaledSheet.create({
  container: {
    flex: 1,
  },
  base: {
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  pageTitle: {
    ...style.bold,
    fontSize: size.h3,
    paddingHorizontal: doubleBaseMargin,
  },
  subWrapper: {
    flex: 1,
    paddingHorizontal: section * 1.4,
    paddingTop: doubleBaseMargin,
    paddingBottom: 0,
  },
  wrapper: {
    padding: doubleBaseMargin,
  },
  rater: {
    marginBottom: `18@vs`,
  },
  label: {
    ...style.semiBold,
    fontSize: size.standard,
  },
  rating: {
    marginTop: baseMargin / 1.5,
  },
  stars: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  star: {
    width: '25@ms',
    height: '25@ms',
  },
  actions: {
    paddingHorizontal: doubleBaseMargin,
    paddingBottom: doubleBaseMargin,
  },
  footnote: {
    fontSize: size.standard,
    marginBottom: baseMargin * 1.5,
    marginTop: baseMargin / 2,
  },
  // success
  thumbsContainer: {
    paddingBottom: baseMargin,
  },
  thumbsUp: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  congratsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  congratsBody: {
    alignItems: 'center',
    marginHorizontal: doubleSection,
  },
  congratsText: {
    marginVertical: baseMargin,
    fontSize: size.h2,
    ...style.bold,
  },
  successText: {
    fontSize: size.h5,
  },
  button: {
    marginBottom: baseMargin * 1.5,
  },
  radios: {
    marginTop: doubleBaseMargin,
    paddingLeft: baseMargin / 4,
  },
  radioRow: {
    marginBottom: baseMargin,
  },
  radio: {
    paddingLeft: baseMargin / 4,
    alignItems: 'flex-start',
  },
  radioLabel: {
    ...style.bold,
    marginTop: -3,
    marginLeft: baseMargin,
    fontSize: size.standard,
    marginBottom: baseMargin,
  },
  radioLabelSelected: { color: green },
  radioButton: {
    marginLeft: doubleBaseMargin,
  },
  spacedLabel: {
    ...style.semiBold,
    fontSize: size.regular,
    marginBottom: baseMargin,
  },
  footActions: {
    borderTopWidth: 0.5,
    borderTopColor: borderGray,
    justifyContent: 'flex-end',
    paddingHorizontal: doubleBaseMargin,
    paddingVertical: doubleBaseMargin,
    paddingBottom: baseMargin * 1.5,
  },
  input: {
    marginTop: baseMargin / 2,
    // marginBottom: baseMargin * 1.5,
    borderRadius: cornerRadius,
    backgroundColor: lighterBlueGray,
    borderBottomWidth: 0,
    minHeight: '78@mvs',
    padding: baseMargin,
  },
  inputLarge: {
    minHeight: '210@mvs',
  },
  inputText: {
    textAlign: 'left',
    paddingLeft: baseMargin / 2,
    paddingRight: baseMargin / 2,
    fontSize: size.regular,
  },
  row: {
    marginTop: baseMargin,
  },
})
