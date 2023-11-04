import { ScaledSheet } from 'react-native-size-matters'
import { Metrics, Colors, Fonts } from '../../common'

const {
  baseMargin,
  doubleBaseMargin,
  cornerRadius,
  screenWidth,
  screenHeight,
} = Metrics
const {
  white,
  lightGray,
  lightWhiteGray,
  pastalGreen,
  pastalDarkGreen,
  borderGray,
  darkGreen,
  darkGray,
  green,
} = Colors
const { size, style } = Fonts
const baseBorder = {
  borderBottomWidth: 1,
  borderBottomColor: borderGray,
}
const mediaHeight = 240
export default ScaledSheet.create({
  container: {
    flex: 1,
  },
  optionsButton: {
    marginRight: -baseMargin,
    padding: doubleBaseMargin,
    paddingVertical: baseMargin,
  },
  optionsIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  scroller: {},
  userContainer: {
    ...baseBorder,
    flexDirection: 'row',
    paddingHorizontal: doubleBaseMargin,
    paddingVertical: doubleBaseMargin,
    flexWrap: 'wrap',
    resizeMode: 'cover',
  },
  userMedia: {
    flex: 1,
    marginRight: baseMargin,
  },
  userPic: {
    width: '65@ms',
    height: '65@ms',
    borderRadius: 40,
    resizeMode: 'contain',
    backgroundColor: pastalDarkGreen,
    borderWidth: 1.24,
    borderColor: 'white',
  },
  userBadge: {
    position: 'absolute',
    top: '40@ms',
    left: '40@ms',
    width: '40@ms',
    height: '40@ms',
    resizeMode: 'contain',
  },
  userInfo: {
    flex: 2,
    paddingTop: baseMargin / 2,
    paddingLeft: baseMargin / 4,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 9,
  },
  userAlias: {
    color: white,
    ...style.bold,
    fontSize: size.h4,
    lineHeight: size.h4,
  },
  userName: {
    fontSize: size.small,
    lineHeight: size.medium,
  },
  userLocation: {
    color: white,
    ...style.semiBold,
    fontSize: size.small,
    lineHeight: size.h2,
  },
  userTransactions: {
    ...style.light,
    fontSize: size.small,
    lineHeight: size.medium,
  },
  userStats: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: doubleBaseMargin,
    paddingBottom: baseMargin / 2,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 9,
  },
  userStat: {
    // paddingHorizontal: baseMargin
  },
  profileActions: {
    paddingTop: baseMargin / 2,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  aboutButton: {
    marginRight: baseMargin * 1.3,
  },
  verifyContainer: {
    paddingVertical: doubleBaseMargin,
    backgroundColor: white,
    alignItems: 'center',
    paddingBottom: baseMargin * 1.5,
  },
  verifyActions: {
    flexDirection: 'row',
    paddingVertical: baseMargin,
    paddingBottom: 0,
  },
  verifyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: baseMargin,
  },
  icon: {
    width: '28@ms',
    height: '28@ms',
    marginRight: baseMargin,
  },
  borderLeft: {
    borderLeftWidth: 1,
    borderLeftColor: borderGray,
  },
  newPostContainer: {
    flex: 1,
    padding: doubleBaseMargin,
  },
  newPost: {
    backgroundColor: white,
    width: '100%',
    borderRadius: cornerRadius * 2,
    alignItems: 'center',
    padding: doubleBaseMargin,
  },
  newPostImage: {
    width: screenWidth * 0.85,
    height: screenWidth * 0.5,
    resizeMode: 'contain',
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
  sellerRated: {
    flexDirection: 'row',
    paddingTop: baseMargin / 4,
    // paddingBottom: baseMargin,
  },
  rating: {
    ...style.semiBold,
    fontSize: size.standard,
    color: white,
  },
  reviewStars: {
    marginLeft: baseMargin / 2,
    marginRight: baseMargin / 4,
    marginTop: -3,
  },
  menu: {
    borderTopWidth: 1,
    borderTopColor: lightWhiteGray,
    borderBottomWidth: 1,
    borderBottomColor: lightWhiteGray,
    flexDirection: 'row',
    backgroundColor: lightWhiteGray,
  },
  menuButton: {
    flex: 1,
    alignItems: 'center',
    padding: doubleBaseMargin,
  },
  menuActive: {
    borderBottomWidth: 3,
    borderBottomColor: green,
  },
  aboutView: {
    padding: doubleBaseMargin,
    paddingTop: baseMargin * 1.5,
  },
  noListingsView: {
    padding: doubleBaseMargin,
    alignItems: 'center',
    backgroundColor: lightGray,
    flex: 1,
  },
})
