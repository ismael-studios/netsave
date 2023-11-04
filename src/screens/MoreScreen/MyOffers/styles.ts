import { ScaledSheet } from 'react-native-size-matters'
import { Metrics, Colors, Fonts } from '../../../common'

const {
  baseMargin,
  doubleBaseMargin,
  cornerRadius,
  doubleSection,
  screenWidth,
} = Metrics
const {
  white,
  green,
  orange,
  lightGray,
  pastalGreen,
  pastalDarkGreen,
  borderGray,
  darkGreen,
  darkGray,
} = Colors
const { size, style } = Fonts

export default ScaledSheet.create({
  container: {
    flex: 1,
  },
  menu: {
    borderTopWidth: 1,
    borderTopColor: lightGray,
    borderBottomWidth: 1,
    borderBottomColor: lightGray,
    flexDirection: 'row',
  },
  menuButton: {
    flex: 1,
    alignItems: 'center',
    padding: baseMargin,
    paddingHorizontal: doubleBaseMargin,
  },
  menuText: {
    ...style.semiBold,
    color: green,
    fontSize: size.h6,
  },
  menuActive: {
    color: darkGray,
  },
  filterButton: {
    flexDirection: 'row',
  },
  filterText: {
    fontSize: size.h6,
  },
  filterCount: {},
  filterCountText: {
    fontSize: size.h6,
  },
  filterImage: {
    width: '18@ms',
    height: '18@ms',
    resizeMode: 'contain',
    tintColor: darkGray,
  },
  offersSwiper: {},
  offers: {
    width: screenWidth,
  },
  offer: {
    borderBottomWidth: 1,
    borderBottomColor: lightGray,
  },
  offerButton: {
    flexDirection: 'row',
    paddingHorizontal: doubleBaseMargin,
    paddingVertical: baseMargin,
  },
  offerTitle: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerImage: {
    width: '30@ms',
    height: '30@ms',
    marginRight: baseMargin,
  },
  titleText: {
    ...style.bold,
    flex: 2,
    color: green,
    fontSize: size.h6,
    paddingRight: baseMargin,
  },
  selectedTitle: {
    color: darkGray,
  },
  offerPrice: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  priceText: {
    color: orange,
    ...style.semiBold,
    fontSize: size.h6,
  },
  offerDate: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: size.h6,
  },
  offerDetails: {
    paddingHorizontal: doubleBaseMargin,
  },
  detailTop: {
    paddingTop: baseMargin * 1.5,
    paddingBottom: baseMargin * 1.5,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  dashed: {
    borderStyle: 'dashed',
    borderColor: lightGray,
    borderWidth: 1.5,
    borderRadius: 1,
    width: '100%',
  },
  detailImage: {
    width: '140@ms',
    height: '130@ms',
    resizeMode: 'contain',
  },
  detailInfo: {
    flex: 1,
    alignItems: 'flex-end',
    paddingLeft: baseMargin,
  },
  detailNote: {
    paddingBottom: doubleBaseMargin,
  },
  detailOptionButton: {
    position: 'absolute',
    right: 0,
    top: -baseMargin,
    padding: doubleBaseMargin,
    zIndex: 9,
  },
  detailOption: {
    width: '20@ms',
    height: '20@ms',
    resizeMode: 'contain',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: doubleBaseMargin,
  },
  button: {
    marginHorizontal: baseMargin,
  },
})
