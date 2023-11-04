import { ScaledSheet } from 'react-native-size-matters'
import { Colors, Fonts, Metrics } from '../../common'
import { ifIOS } from '../../common/Metrics'

const { style, size } = Fonts
const { gray, orange, borderGray, white } = Colors

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
  labelRow: {
    // marginTop: baseMargin / 2,
    marginBottom: baseMargin,
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
  radioLabel: { fontSize: 15 },
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
    marginBottom: baseMargin,
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
  form: {
    marginTop: doubleBaseMargin,
    paddingHorizontal: doubleBaseMargin,
  },
  formRow: {
    marginBottom: doubleBaseMargin,
  },
  input: {
    height: ifIOS('28@ms', '34@ms'),
  },
  inputHalf: {
    flex: 1,
    height: '28@ms',
  },
  inputSpaced: {
    marginRight: baseMargin * 1.5,
  },
  arrowImage: {
    width: '17@ms',
    height: '17@ms',
    resizeMode: 'contain',
  },
})
