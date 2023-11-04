import { ScaledSheet } from 'react-native-size-matters'
import { Colors, Fonts, Metrics } from '../../common'
import { BLOCK_STYLE } from '../../components/AddProduct/ImageBlockStyles'

const { style, size } = Fonts
const { gray, orange, green, lightGray, borderGray, white } = Colors

const {
  ifIOS,
  baseMargin,
  section,
  doubleBaseMargin,
  cornerRadius,
  screenHeight,
} = Metrics

const hintStyle = {
  position: 'absolute',
  left: '150@ms',
  top: ifIOS(0, 2),
  zIndex: 9,
}
export const stylesObject = {
  avoidView: {
    height: screenHeight,
  },
  container: {
    flex: 1,
  },
  base: {
    backgroundColor: white,
    flex: 1,
  },
  header: {
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  subContainer: {
    flex: 1,
    padding: doubleBaseMargin,
    paddingTop: 0,
  },
  topSpacer: {
    paddingTop: baseMargin * 1.5,
  },
  wrapper: {
    flex: 1,
    padding: doubleBaseMargin,
  },
  subWrapper: {
    flex: 1,
    paddingHorizontal: doubleBaseMargin,
  },
  scrollWrap: {
    flex: 1,
    paddingBottom: doubleBaseMargin,
  },
  center: {
    alignItems: 'center',
    paddingBottom: baseMargin,
  },
  titleHead: {
    paddingHorizontal: doubleBaseMargin,
    paddingBottom: baseMargin,
  },
  categoryIcon: {
    width: '19@ms',
    height: '19@ms',
    resizeMode: 'contain',
    tintColor: green,
  },
  categoryIconWrap: {
    width: '40@ms',
    height: '40@ms',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: green,
  },
  categoryContainer: {
    width: '100%',
    paddingBottom: 1,
    borderBottomWidth: 0.8,
    borderBottomColor: borderGray,
  },
  categoryTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: baseMargin,
    paddingBottom: baseMargin / 2,
    paddingRight: baseMargin / 2,
  },
  categoryButton: {
    marginBottom: doubleBaseMargin,
  },
  input: {
    // marginBottom: doubleBaseMargin
  },
  inputNote: {
    marginTop: baseMargin / 2,
    marginBottom: doubleBaseMargin,
  },
  conditionContainer: {
    width: '100%',
    height: '50@ms',
    paddingBottom: 1,
    marginBottom: doubleBaseMargin,
  },
  multiLineInput: { height: 100 },
  label: {
    ...style.bold,
    fontSize: size.input,
  },
  spacedLabel: {
    ...style.bold,
    fontSize: size.input,
    marginBottom: baseMargin,
  },
  arrow: {
    zIndex: 9,
    transform: [{ rotate: '-45deg' }],
    borderBottomColor: green,
    borderBottomWidth: 1.5,
    borderRightColor: green,
    borderRightWidth: 1.5,
    width: 12,
    height: 12,
  },
  arrowDown: {
    top: ifIOS('30@mvs', '27@mvs'),
    right: 0,
    position: 'absolute',
  },
  arrowImage: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e2e2e',
    marginBottom: 8,
  },
  locationView: {
    backgroundColor: '#ececec',
    height: 56,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 10,
    marginVertical: 10,
  },
  hintText: {
    fontSize: size.standard,
    textAlign: 'center',
  },
  hintGreenText: {
    color: green,
    fontSize: size.standard,
    textAlign: 'center',
  },
  locationText: {
    fontSize: size.h6,
  },
  closeButton: {
    position: 'absolute',
    right: -10,
    top: 40,
    height: 50,
    width: 50,
  },
  formRow: {
    marginBottom: doubleBaseMargin,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  textRow: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  addButton: {
    ...BLOCK_STYLE,
    borderRadius: cornerRadius / 1.5,
    borderColor: green,
    borderWidth: 2,
  },
  addButtonPlus: {
    width: 20,
    height: 20,
    tintColor: green,
  },
  images: {
    marginLeft: -baseMargin,
    marginRight: -baseMargin,
    marginBottom: doubleBaseMargin,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: doubleBaseMargin,
  },
  imageIntent: {
    ...BLOCK_STYLE,
    borderRadius: cornerRadius / 1.5,
    borderWidth: 3,
    borderColor: `${green}90`,
    borderStyle: 'dashed',
  },
  noBase: {
    marginBottom: 0,
  },
  conditionHint: {
    ...hintStyle,
    left: '75@ms',
  },
  draftButton: {
    marginHorizontal: baseMargin,
    marginTop: baseMargin * 1.5,
  },
  nextButton: {
    flex: 1,
    marginHorizontal: baseMargin,
    marginTop: baseMargin * 1.5,
  },
  hintTitle: {
    fontSize: size.standard,
    marginBottom: baseMargin,
    textAlign: 'center',
  },
  hintTag: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: baseMargin,
    paddingHorizontal: baseMargin / 4,
  },
  hintList: {
    width: '100%',
  },
  hintScroll: {
    height: screenHeight * 0.5,
  },
  tags: {
    flex: 1,
    width: '100%',
  },
  nameColumn: {
    flex: 1,
  },
  descriptionColumn: {
    flex: 3,
    paddingLeft: baseMargin,
  },
  tagName: {
    marginTop: ifIOS(0, baseMargin / 4),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: baseMargin,
    borderRadius: cornerRadius / 2,
    height: 30,
  },
  nameText: {
    ...style.bold,
    fontSize: size.micro,
  },
  tagDescription: {
    flexDirection: 'row',
  },
  descriptionText: {
    flex: 1,
    flexGrow: 1,
    flexWrap: 'wrap',
    fontSize: size.h6,
    width: '100%',
  },
  instructions: {
    width: '100%',
    paddingHorizontal: baseMargin,
  },
  inputText: {
    fontSize: size.standard,
  },
  dollarSign: {
    marginTop: ifIOS(0, 3),
  },
  radios: {
    marginTop: baseMargin,
    marginBottom: baseMargin * 1.5,
  },
  radioLabel: { fontSize: 15 },
  radioButton: {
    marginLeft: 20,
  },
  retailHint: {
    ...hintStyle,
    left: '150@ms',
  },
  pickupHint: {
    ...hintStyle,
    left: '110@ms',
  },
  visibilityHint: {
    ...hintStyle,
    left: '118@ms',
  },
  actions: {
    justifyContent: 'flex-end',
    paddingHorizontal: doubleBaseMargin,
    marginVertical: doubleBaseMargin,
  },
  actionsRow: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: baseMargin,
    paddingBottom: doubleBaseMargin,
  },
  button: {
    marginBottom: doubleBaseMargin,
  },
  buttonHalf: {
    width: '47%',
    marginBottom: baseMargin * 0.2,
  },
  scroller: {
    flex: 1,
  },
  scrollerContent: {
    minHeight: screenHeight,
  },
  last: {
    marginBottom: baseMargin * 0.2,
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
  congratsText: {
    marginVertical: baseMargin,
    fontSize: size.h2,
    ...style.bold,
  },
  checkDescription: {
    fontSize: size.small,
    color: gray,
  },
  checkMargin: {
    marginTop: baseMargin,
    marginLeft: section * 1.6,
  },
  caution: {
    borderRadius: cornerRadius / 2,
    backgroundColor: orange,
    padding: baseMargin * 1.5,
    paddingBottom: doubleBaseMargin,
    paddingHorizontal: doubleBaseMargin,
  },
  cautionText: {
    color: white,
    fontSize: size.small,
  },
  powered: {
    resizeMode: 'contain',
    width: '120@ms',
    height: '26@ms',
  },
  // packages
  sizePackage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: baseMargin / 2,
  },
  sizeIcon: {
    marginLeft: doubleBaseMargin,
    marginRight: doubleBaseMargin,
  },
  sizeIconImage: {
    width: '70@ms',
    height: '70@ms',
    resizeMode: 'contain',
  },
  sizeLabel: {},
  packageDescription: {
    fontSize: size.small,
    marginTop: baseMargin / 2,
  },
  packageTitle: {
    fontSize: size.standard,
  },
  sizeChangeButton: {
    position: 'absolute',
    top: '45%',
    right: 0,
  },
  inline: {
    flexDirection: 'row',
  },
}

export default ScaledSheet.create(stylesObject)
