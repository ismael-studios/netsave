import { ScaledSheet } from 'react-native-size-matters'
import { Colors, Fonts, Metrics } from '../../common'

const { style, size } = Fonts
const { lightGray, borderGray, green } = Colors
const { baseMargin, section, doubleBaseMargin, doubleSection, ifIOS } = Metrics

export default ScaledSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    flex: 1,
    paddingHorizontal: doubleBaseMargin,
    paddingTop: baseMargin * 1.5,
  },
  switchContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    zIndex: 10000,
  },
  formCol: {
    marginBottom: doubleBaseMargin,
  },
  formMinCol: {
    marginBottom: baseMargin / 2,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: doubleBaseMargin,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeDetails: {
    alignItems: 'center',
    paddingVertical: '30@vs',
    paddingHorizontal: section,
  },
  details: {
    alignItems: 'center',
    paddingHorizontal: doubleBaseMargin * 0.9,
  },
  features: {
    paddingTop: doubleSection,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feature: {
    width: '33.33%',
    marginHorizontal: baseMargin / 2,
    alignItems: 'center',
  },
  featureRound: {
    borderRadius: 50,
    backgroundColor: lightGray,
    width: '68@ms',
    height: '68@ms',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: baseMargin,
  },
  featureIcon: {
    width: '33@ms',
    height: '33@ms',
  },
  label: {
    ...style.bold,
    fontSize: size.standard,
  },
  spacedLabel: {
    ...style.semiBold,
    fontSize: size.regular,
    marginBottom: baseMargin,
  },
  actions: {
    // borderTopWidth: 0.5,
    // borderTopColor: borderGray,
    justifyContent: 'flex-end',
    paddingHorizontal: doubleBaseMargin,
    paddingVertical: doubleBaseMargin,
    paddingBottom: baseMargin * 1.5,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    marginBottom: doubleBaseMargin,
  },
  locationSharingText: {
    width: '70%',
  },
  locationImage: {
    tintColor: green,
    resizeMode: 'contain',
    width: '20@ms',
    height: '20@ms',
  },
  input: {
    width: '100%',
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
})
