import { ScaledSheet } from 'react-native-size-matters'
import { Colors, Fonts, Metrics } from '../../common'

const { style, size } = Fonts
const { gray, orange, green, borderGray, white, textBlack, lightGray } = Colors

const { baseMargin, section, buttonRadius, doubleBaseMargin, cornerRadius } =
  Metrics

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
  nextButton: {},
  checkDescription: {
    fontSize: size.small,
    color: gray,
    paddingBottom: baseMargin,
    // marginBottom: baseMargin
  },
  checkMargin: {
    marginLeft: section * 1.2,
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
  productImage: {
    width: '90@ms',
    height: '90@ms',
    borderRadius: cornerRadius,
    marginTop: baseMargin,
    marginBottom: doubleBaseMargin,
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
    position: 'absolute',
    top: doubleBaseMargin,
    zIndex: -1,
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
    flexDirection: 'row',
    marginBottom: doubleBaseMargin,
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
    marginBottom: -baseMargin / 2,
  },
  inline: {
    flexDirection: 'row',
  },
  productName: {
    maxWidth: '70%',
  },
  rewardInput: {
    backgroundColor: lightGray,
    borderWidth: 1,
    borderColor: borderGray,
    borderRadius: cornerRadius,
    padding: doubleBaseMargin,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: baseMargin,
    marginBottom: doubleBaseMargin,
  },
  pointsInfoView: { flexDirection: 'column', marginVertical: 20 },
})
