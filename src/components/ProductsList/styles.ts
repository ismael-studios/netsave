import { ScaledSheet } from 'react-native-size-matters'
import { Metrics, Colors, Fonts } from '../../common'

const {
  baseMargin,
  doubleBaseMargin,
  cornerRadius,
  screenWidth,
  doubleSection,
} = Metrics
const { white, red, orange, lightGray, lighterGray, green } = Colors
const { size, style } = Fonts
const productWidth = (screenWidth / 2 - baseMargin * 1.5) * 0.9999

export default ScaledSheet.create({
  container: {
    flex: 1,
    paddingRight: 0,
    paddingBottom: 0,
    backgroundColor: white,
  },
  titleSection: {
    alignItems: 'center',
    paddingHorizontal: doubleBaseMargin,
    marginTop: baseMargin / 2,
    paddingBottom: baseMargin,
  },
  products: {
    flex: 1,
    paddingLeft: baseMargin,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: lightGray,
  },
  list: {
    elevation: 9,
  },
  flatlist: {
    paddingTop: baseMargin,
  },
  product: {
    backgroundColor: white,
    width: productWidth,
    marginRight: baseMargin,
    marginBottom: baseMargin,
    borderRadius: '3@ms',
    overflow: 'hidden',
    elevation: 9,
  },
  imageContainer: {
    paddingTop: baseMargin,
    paddingHorizontal: baseMargin,
    maxHeight: productWidth * 0.75,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productBase: {
    flex: 1,
    justifyContent: 'space-between',
  },
  summaryContainer: {
    padding: baseMargin,
    paddingTop: baseMargin * 0.8,
    paddingBottom: 0,
  },
  productTitle: {
    ...style.bold,
    fontSize: size.standard,
    maxHeight: '65@mvs',
  },
  productSummary: {
    fontSize: size.h7,
    lineHeight: size.h7 * 1.5,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: baseMargin,
    paddingTop: baseMargin / 2,
  },
  spaced: {
    justifyContent: 'space-between',
  },
  price: {
    ...style.bold,
    fontSize: size.standard,
    color: green,
    paddingBottom: baseMargin,
  },
  storePrice: {
    ...style.semiBold,
    fontSize: size.standard,
    color: orange,
    paddingBottom: baseMargin,
    width: '100%',
  },
  retail: {
    marginLeft: baseMargin / 2,
  },
  strikethrough: {
    position: 'absolute',
    top: '32%',
    height: 2,
    width: '100%',
    backgroundColor: orange,
  },
  location: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  locationText: {
    ...style.semiBold,
    fontSize: size.h7,
    color: lighterGray,
  },
  flexLocation: {
    flex: 1,
    textAlign: 'right',
  },
  profileImage: {
    width: 20,
    height: 20,
    borderRadius: 20,
    resizeMode: 'cover',
    marginRight: baseMargin / 1.5,
  },
  discountBadge: {
    position: 'absolute',
    zIndex: 9,
    backgroundColor: orange,
    padding: baseMargin,
    borderBottomRightRadius: '3@ms',
    paddingVertical: baseMargin / 2,
  },
  discountText: {
    ...style.bold,
    color: white,
    fontSize: size.tiny,
  },
  soldBadge: {
    position: 'absolute',
    zIndex: 9,
    backgroundColor: red,
    padding: baseMargin,
    borderBottomRightRadius: '3@ms',
    paddingVertical: baseMargin / 2,
  },
  soldText: {
    ...style.bold,
    color: white,
    fontSize: size.tiny,
  },
  categoriesScroll: {},
  categories: {
    flexDirection: 'row',
    paddingHorizontal: baseMargin,
    paddingBottom: baseMargin,
  },
  allCategories: {
    flexWrap: 'wrap',
    width: '100%',
    paddingBottom: 0,
  },
  categoryButton: {
    minWidth: '59@ms',
    alignItems: 'center',
  },
  blockCategory: {
    width: '19.99%',
    marginBottom: baseMargin * 1.5,
  },
  categoryIconWrap: {
    width: '40@ms',
    height: '40@ms',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: green,
    marginBottom: baseMargin * 0.8,
  },
  IconWrapSelected: {
    backgroundColor: green,
  },
  categoryIcon: {
    width: '19@ms',
    height: '19@ms',
    resizeMode: 'contain',
    tintColor: green,
  },
  categoryIconSelected: {
    tintColor: 'white',
  },
  svgIcon: {
    width: '19@ms',
    height: '19@ms',
  },
  categoryName: {
    ...style.semiBold,
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: size.micro,
  },
  categorySelectedText: {
    textAlign: 'center',
    alignItems: 'center',
    color: green,
  },
  moreCategory: { alignItems: 'flex-end', width: '100%' },
  locationContainer: {
    justifyContent: 'center',
    paddingHorizontal: baseMargin,
  },
  locationRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: -baseMargin * 1.5,
  },
  locationPicker: {
    minWidth: 133,
  },
  locationTarget: {
    tintColor: green,
    width: '15@ms',
    height: '15@ms',
    resizeMode: 'contain',
  },
  locationButton: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: baseMargin * 1.5,
    paddingTop: baseMargin * 1.25,
    paddingLeft: baseMargin / 2,
  },
  filterButton: {
    alignItems: 'center',
    padding: baseMargin * 1.5,
    paddingTop: baseMargin * 1.25,
  },
  mapPoint: {
    width: '25@ms',
    height: '25@ms',
    resizeMode: 'contain',
    marginRight: baseMargin / 2,
  },
  smallPoint: {
    width: '18@ms',
    height: '18@ms',
    marginTop: 3,
    marginRight: 2,
    marginLeft: 2,
  },
  filters: {
    marginTop: 3,
    width: '21@ms',
    height: '21@ms',
    resizeMode: 'contain',
  },
  locationSetButton: {
    alignSelf: 'center',
    marginVertical: baseMargin * 1.5,
  },
  locationDetails: {},
  newPostContainer: {
    flex: 1,
    padding: doubleBaseMargin,
  },
  newPost: {
    backgroundColor: white,
    width: '100%',
    borderRadius: cornerRadius * 2,
    alignItems: 'center',
    paddingBottom: doubleBaseMargin,
  },
  newPostImage: {
    width: screenWidth * 0.85,
    height: screenWidth * 0.5,
    resizeMode: 'contain',
  },
  newPostButton: {
    marginTop: baseMargin,
  },
  postEmptyText: {
    paddingHorizontal: doubleBaseMargin,
  },
  preLoader: {
    paddingBottom: baseMargin * 1.5,
  },
  switchMode: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: doubleSection,
  },
  row: {
    flexDirection: 'row',
  },
  postLoader: {
    backgroundColor: lightGray,
    flex: null,
    paddingBottom: baseMargin,
  },
  locationSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationName: {
    ...style.bold,
    fontSize: size.h6,
    color: green,
  },
  locationDivider: {
    ...style.semiBold,
    fontSize: size.h7,
    paddingHorizontal: baseMargin / 2,
    color: lighterGray,
  },
})
