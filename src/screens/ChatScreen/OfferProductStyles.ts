import { ScaledSheet } from 'react-native-size-matters'
import { Metrics, Colors, Fonts } from '../../common'

const { section, baseMargin, doubleBaseMargin, cornerRadius } = Metrics
const {
  white,
  orange,
  borderGray,
  darkGray,
  gray,
  green,
  lighterGray,
  lightWhiteGray,
} = Colors
const { style, size } = Fonts

export default ScaledSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 11,
    elevation: 9,
    marginBottom: doubleBaseMargin,
  },
  product: {
    padding: baseMargin * 1.5,
    borderColor: green,
    margin: doubleBaseMargin,
    marginBottom: baseMargin / 2,
    borderWidth: 2,
    borderRadius: cornerRadius * 1.5,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  subWrapper: {
    flexDirection: 'row',
  },
  productTitle: {
    fontSize: size.h5,
  },
  productMedia: {
    flex: 1,
    maxWidth: '110@ms',
    height: '110@ms',
    overflow: 'hidden',
    borderRadius: cornerRadius,
  },
  productImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  productInfo: {
    flex: 1,
    paddingHorizontal: baseMargin * 1.4,
  },
  productOffer: {
    ...style.bold,
    color: darkGray,
  },
  textRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  headingText: {
    ...style.bold,
    textAlign: 'center',
    fontSize: size.h5,
  },
  normalGreenText: {
    fontSize: size.small,
    textAlign: 'center',
    color: green,
  },
  normalOrangeText: {
    fontSize: size.small,
    textAlign: 'center',
    color: orange,
  },
  normalText: {
    textAlign: 'center',
    fontSize: size.small,
  },
  greenText: {
    ...style.bold,
    fontSize: size.small,
    color: green,
  },
  orangeText: {
    ...style.extraBold,
    fontSize: size.standard,
    color: orange,
  },
  savePercent: {
    ...style.bold,
    fontSize: size.h6,
    color: orange,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  smallGrayText: {
    ...style.semiBold,
    fontSize: size.tiny,
    lineHeight: size.tiny * 1.5,
    paddingTop: 2,
    color: gray,
  },
  listPrice: {
    ...style.bold,
    fontSize: size.medium,
    color: green,
  },
  listPriceSmall: {
    fontSize: size.h6,
  },
  productsActions: {
    // marginTop: baseMargin / 1.25,
    marginBottom: baseMargin / 1.25,
  },
  productsActionsSpaced: {
    marginTop: baseMargin * 1.5,
  },
  statActions: {
    marginTop: baseMargin,
    marginLeft: -baseMargin,
    marginRight: -baseMargin,
  },
  moreActions: {
    width: '100%',
  },
  action: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    width: '100%',
  },
  actionSpaced: {
    marginTop: baseMargin * 1.5,
  },
  halfAction: {
    flex: 1,
  },
  spaced: {
    marginBottom: baseMargin,
  },
  topSpaced: {
    marginTop: baseMargin * 1.5,
  },
  actionText: {
    ...style.bold,
    fontSize: size.standard,
  },
  textWrap: {
    paddingTop: baseMargin / 2,
    paddingHorizontal: 0,
  },
  productUnavailableView: {
    height: '50@ms',
    width: '100%',
    justifyContent: 'center',
  },
  productUnavailableText: {
    color: 'red',
    textAlign: 'center',
  },
  topDivider: {
    width: '100%',
  },
  noPad: {
    paddingTop: 0,
  },
  exclamation: {
    position: 'absolute',
    top: -baseMargin,
    right: -baseMargin,
    zIndex: 9,
  },
  offerStat: {
    backgroundColor: lightWhiteGray,
    paddingHorizontal: section + baseMargin,
    paddingTop: baseMargin,
    paddingBottom: doubleBaseMargin,
  },
  completedBox: {
    top: 0,
    right: -0.5,
    zIndex: 0,
    width: 0,
    height: 0,
    borderTopRightRadius: cornerRadius * 1.4,
    overflow: 'hidden',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderTopColor: orange,
    borderBottomColor: orange,
    borderLeftColor: 'transparent',
    borderLeftWidth: 40,
    borderTopWidth: 40,
  },
  completedCheck: {
    width: 12,
    height: 12,
    top: 8,
    right: 7,
    resizeMode: 'contain',
    position: 'absolute',
    tintColor: white,
    zIndex: 9,
  },
  footer: {
    paddingTop: baseMargin / 2,
    width: '100%',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
  },
  collapseButton: {
    paddingHorizontal: baseMargin * 1.5,
    paddingVertical: baseMargin / 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: cornerRadius / 1.5,
    backgroundColor: lighterGray,
    marginBottom: -baseMargin * 1.5,
  },
  collapseCaret: {
    width: '10@ms',
    height: '10@ms',
    resizeMode: 'contain',
    transform: [{ rotate: '180deg' }],
    marginLeft: baseMargin / 2,
    tintColor: white,
  },
  collapsed: {
    transform: [{ rotate: '0deg' }],
  },
  collapseText: {
    ...style.semiBold,
    color: white,
    fontSize: size.h7,
  },
  offerState: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: baseMargin,
    paddingHorizontal: doubleBaseMargin,
  },
  offerStateSpaced: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: baseMargin,
    paddingBottom: baseMargin,
    paddingHorizontal: doubleBaseMargin,
  },
  stateCol: {
    flex: 1,
  },
  clockIcon: {
    width: '26@ms',
    height: '26@ms',
    marginRight: baseMargin,
  },
  actionsRow: {
    paddingTop: 0,
    alignItems: 'center',
    flexDirection: 'row',
  },
  checkCircle: {
    width: '11@ms',
    height: '11@ms',
    marginRight: baseMargin / 2,
  },
  loader: {
    flex: 1,
    width: '100%',
    height: 300,
    marginTop: baseMargin,
    marginBottom: baseMargin,
  },
})
