import { ScaledSheet } from 'react-native-size-matters'
import { Metrics, Colors, Fonts } from '../../common'
import { ifIphoneX } from 'react-native-iphone-x-helper'

const {
  ifIOS,
  baseMargin,
  doubleBaseMargin,
  cornerRadius,
  screenWidth,
  screenHeight,
  section,
} = Metrics
const {
  white,
  red,
  gray,
  green,
  orange,
  boneWhite,
  textBlack,
  borderGray,
  darkGray,
} = Colors
const { size, style } = Fonts
const baseBorder = {
  borderBottomWidth: 1,
  borderBottomColor: borderGray,
}
const mediaHeight = 280
const iconTop = ifIOS(baseMargin * 1.5, baseMargin * 1.5)

export default ScaledSheet.create({
  wrapper: {
    flex: 1,
    marginTop: ifIOS(ifIphoneX(section * 1.5, doubleBaseMargin * 1.05), 0),
  },
  container: {
    flex: 1,
  },
  scroller: {
    backgroundColor: 'white',
  },
  productMedia: {
    width: '100%',
    height: `${mediaHeight}@vs`,
  },
  productMediaSwiper: {
    width: screenWidth,
    height: `${mediaHeight}@vs`,
  },
  productImageContainer: {
    width: screenWidth,
    height: `${mediaHeight}@vs`,
    flex: 1,
  },
  imageSwiper: {
    width: screenWidth,
    height: `${mediaHeight}@vs`,
  },
  dots: {
    alignItems: 'center',
    paddingBottom: baseMargin,
  },
  dot: {
    width: 10,
    height: 10,
    marginHorizontal: baseMargin / 2,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  priceContainer: {
    paddingHorizontal: doubleBaseMargin,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceSection: {
    flexDirection: 'row',
  },
  soldContainer: {
    alignSelf: 'center',
    marginLeft: baseMargin,
    backgroundColor: red,
    height: '24@vs',
    paddingHorizontal: baseMargin,
    justifyContent: 'center',
  },
  soldText: {
    ...style.bold,
    fontSize: size.small,
    color: white,
  },
  postInfo: {
    flexDirection: 'row',
    paddingHorizontal: doubleBaseMargin,
  },
  priceText: {
    ...style.extraBold,
    fontSize: size.h3,
    color: green,
  },
  retailInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: baseMargin / 3,
  },
  retail: {
    marginHorizontal: baseMargin / 2,
  },
  retailText: {
    fontSize: size.small,
    color: darkGray,
  },
  storePrice: {
    fontSize: size.h4,
    marginBottom: -2,
    color: orange,
    width: '100%',
  },
  strikethrough: {
    position: 'absolute',
    top: '12@ms',
    height: 2,
    width: '100%',
    backgroundColor: orange,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: doubleBaseMargin,
    paddingBottom: 0,
    paddingTop: baseMargin / 2,
  },
  titleSection: {
    flex: 1,
    flexDirection: 'row',
  },
  titleText: {
    ...style.boldText,
    fontSize: size.medium,
    paddingTop: baseMargin / 2,
    paddingBottom: baseMargin,
  },
  productCondition: {
    width: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${green}40`,
    borderRadius: cornerRadius / 2,
    padding: baseMargin / 2,
    paddingHorizontal: baseMargin,
  },
  conditionText: {
    ...style.tinyText,
    ...style.bold,
    color: green,
  },
  currentOfferContainer: {
    backgroundColor: white,
    alignItems: 'center',
    borderTopLeftRadius: cornerRadius,
    borderTopRightRadius: cornerRadius,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 9,
    paddingTop: baseMargin,
  },
  currentOffer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  currentOfferText: {
    ...style.extraBold,
    color: gray,
    fontSize: size.h4,
  },
  multiOfferText: {
    ...style.bold,
    fontSize: size.h4,
  },
  offerPrice: {
    ...style.extraBold,
    fontSize: size.h3,
    marginBottom: -2,
    color: orange,
  },
  offerButtons: {
    paddingHorizontal: doubleBaseMargin - baseMargin / 2,
    paddingTop: baseMargin,
    paddingBottom: doubleBaseMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  offerContainer: {
    // ...baseBorder,
    borderTopWidth: 0.5,
    borderTopColor: borderGray,
    paddingHorizontal: doubleBaseMargin - baseMargin / 2,
    paddingVertical: doubleBaseMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  offerButton: {
    width: '46%',
    marginHorizontal: baseMargin / 2,
  },
  summaryContainer: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: borderGray,
    margin: doubleBaseMargin,
    paddingTop: baseMargin * 1.5,
  },
  summaryIndent: {},
  summaryIcon: {
    marginRight: baseMargin * 1.5,
    marginTop: baseMargin / 3,
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  summaryColumn: {
    flex: 1,
  },
  summaryText: {
    paddingTop: 1,
    fontSize: size.standard,
    color: textBlack,
    lineHeight: size.h6 * 1.5,
  },
  authorContainer: {
    borderTopWidth: 0.5,
    borderTopColor: borderGray,
    backgroundColor: boneWhite,
    flexDirection: 'row',
    paddingHorizontal: doubleBaseMargin,
    paddingVertical: doubleBaseMargin,
    paddingTop: baseMargin * 1.5,
  },
  authorMedia: {
    marginRight: baseMargin,
  },
  authorPic: {
    width: '33@ms',
    height: '33@ms',
    borderRadius: 50,
  },
  authBadge: {
    position: 'absolute',
    top: '14@ms',
    right: -13,
    width: 27,
    height: 27,
  },
  authorInfo: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: baseMargin / 3,
  },
  authorName: {
    paddingLeft: baseMargin / 4,
  },
  authorAlias: {
    ...style.mediumText,
    fontSize: size.standard,
    marginLeft: -1,
  },
  metaInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  postedTime: {
    ...style.smallText,
    color: darkGray,
    alignSelf: 'flex-end',
  },
  locationBrief: {
    ...baseBorder,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    margin: baseMargin * 1.5,
    marginHorizontal: doubleBaseMargin,
  },
  locationText: {
    fontSize: size.small,
    color: darkGray,
  },
  mapContainer: {
    width: screenWidth,
    height: '120@vs',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: screenWidth,
    height: '120@vs',
  },
  backButton: {
    marginRight: 'auto',
  },
  bookmarkButton: {
    marginHorizontal: baseMargin / 1.5,
  },
  shareButton: {
    marginHorizontal: baseMargin / 1.5,
  },
  optionsButton: {
    marginHorizontal: baseMargin / 1.5,
  },
  optionsIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  floatingToolbar: {
    paddingLeft: doubleBaseMargin,
    paddingRight: baseMargin,
    width: '100%',
    position: 'absolute',
    zIndex: 9,
    top: iconTop,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  lightbox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightboxSwiper: {
    flex: 1,
  },
  lightboxImage: {
    width: screenWidth,
    height: screenHeight,
  },
  lightboxClose: {
    zIndex: 999,
    right: section,
    top: section * 1.45,
  },
  floatingMenu: {
    // bottom: ifIOS(footerHeight + ifIphoneX(baseMargin, -baseMargin) * .9, doubleBaseMargin)
  },
  swipeIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: baseMargin,
    // marginBottom: -baseMargin / 2
  },
  swipeDot: {
    borderWidth: 1,
    borderColor: green,
    width: 10,
    height: 10,
    borderRadius: 20,
    marginHorizontal: baseMargin / 2,
    marginTop: baseMargin / 3,
  },
  activeDot: {
    backgroundColor: green,
  },
  actions: {
    borderTopWidth: 1,
    borderTopColor: borderGray,
    paddingHorizontal: doubleBaseMargin,
    paddingTop: baseMargin * 1.9,
    paddingBottom: baseMargin * 0.5,
  },
  actionsRow: {
    borderTopWidth: 0.5,
    borderTopColor: borderGray,
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: baseMargin,
    paddingVertical: doubleBaseMargin,
  },
  actionButton: {
    marginBottom: baseMargin * 1.5,
  },
  editButton: {
    flex: 1,
    marginHorizontal: baseMargin,
  },
  postButton: {
    flex: 1.25,
    marginHorizontal: baseMargin,
  },
  mapButton: {
    alignItems: 'flex-end',
  },
  mapButtonText: {
    ...style.bold,
    color: green,
    fontSize: size.h6,
  },
  offersContainer: {},
  offer: {
    borderBottomWidth: 0.5,
    borderBottomColor: borderGray,
    padding: doubleBaseMargin,
  },
  first: {
    borderBottomWidth: 0,
  },
  offerUser: {
    flexDirection: 'row',
  },
  offerUserImage: {
    width: 20,
    height: 20,
    marginRight: baseMargin / 1.5,
    resizeMode: 'contain',
  },
  offerUsername: {
    ...style.bold,
    marginTop: 2,
    fontSize: size.h6,
  },
  offerTime: {
    fontSize: size.h7,
    color: darkGray,
    marginTop: 4,
    marginLeft: baseMargin,
  },
  offerPriceContainer: {
    marginTop: baseMargin / 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: baseMargin * 1.5,
  },
  offerAction: { flex: 1 },
  acceptButton: {
    marginRight: doubleBaseMargin,
  },
  attributes: {
    paddingTop: baseMargin / 2,
    paddingHorizontal: doubleBaseMargin,
  },
  attribute: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: baseMargin,
  },
  attributeIcon: {
    resizeMode: 'contain',
    marginRight: baseMargin / 1.1,
    width: '22@ms',
    height: '22@ms',
  },
  attributeText: {
    fontSize: size.small,
    color: darkGray,
  },
})
