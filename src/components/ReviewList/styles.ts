import React from 'react'
import { ScaledSheet } from 'react-native-size-matters'
import { Metrics, Colors, Fonts } from '../../common'

const {
  section,
  baseMargin,
  doubleBaseMargin,
  cornerRadius,
  screenWidth,
  screenHeight,
  doubleSection,
} = Metrics
const {
  white,
  textBlack,
  gray,
  red,
  borderGray,
  orange,
  lightGray,
  lighterGray,
  pastalGreen,
  green,
  darkGreen,
} = Colors
const { size, style } = Fonts
const productWidth = (screenWidth / 2 - baseMargin * 1.5) * 0.9999

export default ScaledSheet.create({
  container: {
    width: '100%',
    flex: 1,
    // paddingHorizontal: doubleBaseMargin,
  },
  titleContainer: {},
  titleText: {
    ...style.semiBold,
    fontSize: size.standard,
    color: gray,
  },
  reviewsContainer: {},
  tabsContainer: {
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
    // paddingTop: baseMargin,
    // paddingBottom: baseMargin / 2,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: borderGray,
    padding: doubleBaseMargin,
    backgroundColor: lightGray,
  },
  tabLeft: {
    borderRightWidth: 1,
  },
  selectedTab: {
    // borderBottomColor: orange,
    // borderBottomWidth: 2.75,
    backgroundColor: white,
    borderBottomWidth: 0,
  },
  right: {
    alignItems: 'flex-end',
  },
  tabText: {
    ...style.semiBold,
    // color: green,
    fontSize: size.standard,
  },
  selectedText: {
    color: textBlack,
  },
  reviewsList: {},
  review: {
    padding: baseMargin * 1.45,
    borderBottomWidth: 1,
    borderBottomColor: borderGray,
    // flexDirection: 'row',
  },
  reviewerMedia: {
    paddingRight: baseMargin,
    paddingTop: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  reviewerPic: {
    borderWidth: 0.75,
    borderColor: borderGray,
    borderRadius: 15,
    overflow: 'hidden',
    width: 20,
    height: 20,
    marginRight: baseMargin,
  },
  reviewDetails: {
    // flex: 1,
    paddingRight: baseMargin,
  },
  reviewerFrom: {
    ...style.semiBold,
    fontSize: size.standard,
  },
  reviewMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: baseMargin / 2,
  },
  reviewTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    ...style.semiBold,
    fontSize: size.standard,
  },
  reviewStars: {
    // marginLeft: baseMargin / 1.5,
    marginRight: baseMargin / 2,
    marginTop: -baseMargin,
  },
  timeText: {
    fontSize: size.standard,
  },
  optionsButton: {},
  optionsIcon: {
    width: 22,
  },
  reviewText: {
    color: gray,
    fontSize: size.standard,
  },
  product: {
    flexDirection: 'row',
    paddingTop: baseMargin,
    paddingBottom: baseMargin * 1.5,
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: baseMargin,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    ...style.bold,
    fontSize: size.standard,
  },
  productPrice: {
    ...style.bold,
    fontSize: size.standard,
    color: green,
  },
  empty: {},
  newPost: {
    backgroundColor: white,
    width: '100%',
    borderRadius: cornerRadius * 2,
    alignItems: 'center',
    padding: doubleBaseMargin,
  },
  categoryDisplay: {
    width: '100%',
    height: (screenHeight - 300) * 0.2, //'35%', // '100@vs', //
    resizeMode: 'contain',
    marginBottom: baseMargin,
  },
  newPostButton: {
    marginTop: baseMargin,
  },
})
