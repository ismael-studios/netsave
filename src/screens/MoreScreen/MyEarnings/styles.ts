import { ScaledSheet } from 'react-native-size-matters'
import { Metrics, Colors, Fonts } from '../../../common'
import { ifIOS } from '../../../common/Metrics'

const { baseMargin, doubleBaseMargin, screenWidth } = Metrics
const { lightGray, gray88, green, darkGray } = Colors
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
    backgroundColor: lightGray,
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
  balanceTransactionsView: {
    width: screenWidth,
    borderTopWidth: 1,
    borderTopColor: lightGray,
  },
  balanceTransaction: {
    borderBottomWidth: 1,
    borderBottomColor: gray88,
    paddingHorizontal: doubleBaseMargin,
    paddingVertical: baseMargin * 1.3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    marginHorizontal: baseMargin,
  },
  balanceView: {
    alignItems: 'center',
    paddingHorizontal: doubleBaseMargin,
    paddingVertical: doubleBaseMargin * 1.5,
  },
  availableBalanceView: {
    alignItems: 'center',
  },
  pendingBalanceView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: baseMargin,
  },
  withdrawView: { flex: 1, padding: 20 },
  withdrawWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  withdrawButton: {
    marginTop: doubleBaseMargin,
  },
  form: {
    marginTop: doubleBaseMargin,
    paddingHorizontal: doubleBaseMargin,
  },
  formRow: {
    marginBottom: doubleBaseMargin,
  },
  hintText: {
    fontSize: size.standard,
    textAlign: 'center',
    marginVertical: baseMargin,
  },
  descriptionView: { flex: 1, marginRight: doubleBaseMargin * 2 },
  netView: { flexDirection: 'row', alignItems: 'center' },
  exclamationButton: { marginLeft: 10 },
  exclamationImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  placeholderAction: {
    marginLeft: 10,
    height: 20,
    width: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: baseMargin / 2,
  },
  serviceFeeView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailView: {
    borderTopWidth: 1,
    borderTopColor: gray88,
    paddingVertical: doubleBaseMargin,
  },
  totalEarningView: { padding: doubleBaseMargin, marginTop: doubleBaseMargin },
  topSection: {
    flex: 1,
    padding: doubleBaseMargin,
  },
  imageContainer: {
    width: '100%',
    height: screenWidth - 125,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  detailImageView: { marginBottom: 0 },
  titleView: {
    alignItems: 'center',
  },
  profileImage: {
    width: 20,
    height: 20,
    borderRadius: 20,
    resizeMode: 'cover',
    marginRight: baseMargin / 1.5,
  },
  userView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dollarSign: {
    marginTop: ifIOS(0, 3),
    marginRight: 10,
  },
  usdText: {
    marginTop: ifIOS(0, 3),
  },
  input: { height: ifIOS('28@ms', '34@ms'), marginTop: 8 },
  inputText: {
    fontSize: size.standard,
  },
  label: {
    fontSize: size.input,
  },
  checkHintView: {
    marginVertical: baseMargin * 1.5,
  },
  checkHintImage: {
    height: '135@ms',
    resizeMode: 'contain',
  },
  hintLabelView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  nameInputView: {
    flexDirection: 'row',
  },
  nameInput: {
    flex: 1,
    marginRight: 10,
  },
  addAccountButton: {
    marginTop: doubleBaseMargin * 2,
  },
  calendarView: { width: '100%', height: 350 },
})
