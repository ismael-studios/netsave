import { ScaledSheet } from 'react-native-size-matters'
import { Colors, Fonts, Metrics } from '../../common'

const { style, size } = Fonts
const {
  gray,
  orange,
  green,
  borderGray,
  red,
  white,
  textBlack,
  lighterBlueGray,
} = Colors

const {
  ifIOS,
  baseMargin,
  section,
  buttonRadius,
  doubleBaseMargin,
  cornerRadius,
} = Metrics

export default ScaledSheet.create({
  container: {
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
  scrollerContainer: {
    flex: 1,
  },
  topSpacer: {
    paddingTop: baseMargin * 1.5,
  },
  titleHead: {
    paddingHorizontal: doubleBaseMargin,
    paddingBottom: baseMargin,
  },
  label: {
    ...style.bold,
    fontSize: size.input,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  radios: {
    alignItems: 'center',
    marginTop: baseMargin,
    marginBottom: baseMargin * 1.5,
  },
  radioLabel: {
    ...style.regular,
    color: textBlack,
    fontSize: 15,
  },
  radioButton: {
    marginLeft: 20,
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
  spacedButton: {
    marginBottom: baseMargin * 1.5,
  },
  checkDescription: {
    fontSize: size.small,
    color: gray,
    minHeight: 50,
  },
  checkMargin: {
    marginLeft: section * 1.2,
    marginRight: baseMargin / 2,
  },
  caution: {
    marginTop: baseMargin / 1.5,
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
  cautionNote: {
    color: white,
    fontSize: size.small,
    marginTop: baseMargin,
  },
  secure: {
    marginLeft: 3,
    width: '28@ms',
    height: '28@ms',
    resizeMode: 'contain',
  },
  paymentContainer: {
    paddingHorizontal: section,
    alignItems: 'center',
    marginBottom: baseMargin,
  },
  paymentActions: {
    marginTop: baseMargin,
    width: '100%',
    flex: 1,
  },
  payButton: {
    flexDirection: 'row',
    backgroundColor: 'black',
    borderRadius: buttonRadius,
    justifyContent: 'center',
  },
  payImage: {
    resizeMode: 'contain',
    width: '50@ms',
    height: '40@ms',
  },
  textRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: baseMargin,
  },
  alternative: {
    width: '100%',
    alignItems: 'center',
    marginTop: baseMargin,
  },
  orPay: {
    ...style.semiBold,
    fontSize: size.small,
    color: gray,
    backgroundColor: white,
    paddingVertical: baseMargin,
    paddingHorizontal: doubleBaseMargin,
  },
  centerBorder: {
    zIndex: -1,
    marginTop: -baseMargin * 0.9,
    borderTopWidth: 1,
    opacity: 0.5,
    borderTopColor: borderGray,
    width: '100%',
  },
  acceptedCards: {
    width: '85@ms',
    height: '21@ms',
  },
  cardForm: {
    marginTop: baseMargin,
    width: '100%',
  },
  formRow: {
    marginBottom: doubleBaseMargin,
  },
  formRowNarrow: {
    paddingHorizontal: baseMargin,
  },
  input: {
    height: '28@ms',
  },
  inputHalf: {
    flex: 1,
    height: '28@ms',
  },
  inputSpaced: {
    marginRight: baseMargin * 1.5,
  },
  secondaryAddButton: {
    marginTop: doubleBaseMargin,
    marginBottom: doubleBaseMargin,
  },
  removeButton: {
    flex: 1,
    right: 0,
    alignItems: 'flex-end',
  },
  removeText: {
    ...style.bold,
    fontSize: size.small,
    color: green,
  },
  addresses: {
    paddingTop: baseMargin / 2,
    // borderBottomWidth: 0.5,
    // borderBottomColor: borderGray
  },
  addressRadio: {
    borderTopWidth: 0.5,
    borderTopColor: borderGray,
  },
  radioWrap: {
    marginRight: baseMargin / 2,
  },
  footnote: {
    alignItems: 'center',
  },
  inline: {
    flexDirection: 'row',
  },
  inlineCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currency: {
    alignSelf: 'center',
  },
  priceInput: {
    borderBottomWidth: 0,
    marginBottom: baseMargin,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: lighterBlueGray,
    paddingLeft: baseMargin * 1.5,
    borderRadius: cornerRadius,
  },
  priceInputText: {
    marginTop: ifIOS(null, baseMargin / 4),
    alignSelf: 'center',
    borderRadius: cornerRadius,
    // paddingLeft: baseMargin / 2
  },
  descriptionText: {
    fontSize: size.h6,
    marginBottom: baseMargin,
  },
  product: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: '70@ms',
    height: '80@ms',
    borderRadius: cornerRadius,
  },
  productInfo: {
    flex: 1,
    paddingLeft: doubleBaseMargin,
  },
  productName: {
    ...style.bold,
    fontSize: size.standard,
    paddingTop: baseMargin / 4,
    marginBottom: baseMargin / 4,
  },
  metadata: {
    fontSize: size.h6,
    marginBottom: baseMargin / 4,
  },
  checkCricle: {
    width: '21@ms',
    height: '21@ms',
    marginRight: baseMargin,
  },
  trackingHeader: {
    backgroundColor: `${orange}30`,
    padding: doubleBaseMargin,
    paddingHorizontal: section,
    borderRadius: cornerRadius,
  },
  deliveredHeader: {
    backgroundColor: `${green}30`,
  },
  trackingStatement: {
    fontSize: size.h6,
  },
  trackingDate: {
    ...style.bold,
    fontSize: size.medium,
    paddingTop: baseMargin / 4,
  },
  events: {
    flex: 1,
  },
  event: {
    height: 'auto',
    width: '100%',
    flexDirection: 'row',
  },
  eventTimeline: {
    alignItems: 'center',
  },
  eventDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: green,
  },
  dotFail: {
    backgroundColor: red,
  },
  eventLine: {
    width: 2,
    minHeight: 80,
    backgroundColor: green,
  },
  eventInfo: {
    flex: 1,
    paddingLeft: baseMargin * 1.5,
  },
  eventName: {
    ...style.bold,
    fontSize: size.h6,
    marginBottom: baseMargin / 2,
  },
  eventTime: {
    fontSize: size.h6,
    marginBottom: baseMargin / 2,
  },
  eventLocation: {
    fontSize: size.h6,
    marginBottom: baseMargin / 2,
  },
})
