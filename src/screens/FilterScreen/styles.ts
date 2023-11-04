import { ScaledSheet } from 'react-native-size-matters'
import { Colors, Fonts, Metrics } from '../../common'

const { style, size } = Fonts
const { white, gray, green, lightGray, borderGray } = Colors
const { baseMargin, section, doubleBaseMargin } = Metrics

export default ScaledSheet.create({
  container: {
    flex: 1,
  },
  filters: {
    paddingHorizontal: doubleBaseMargin,
  },
  filterRow: {
    marginBottom: baseMargin * 1.5,
  },
  radios: {
    marginTop: baseMargin * 1.5,
    paddingLeft: baseMargin / 4,
  },
  radio: {
    paddingLeft: baseMargin / 4,
  },
  radioLabel: { fontSize: size.regular, marginBottom: baseMargin },
  radioButton: {
    marginLeft: doubleBaseMargin,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    ...style.semiBold,
    fontSize: size.regular,
  },
  spacedLabel: {
    ...style.semiBold,
    fontSize: size.regular,
    marginBottom: baseMargin,
  },
  actions: {
    borderTopWidth: 0.5,
    borderTopColor: borderGray,
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
  flipCaret: {
    transform: [{ rotate: '180deg' }],
  },
  radiusRow: {
    marginTop: -baseMargin * 1.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  radiusColumn: {
    justifyContent: 'center',
    paddingLeft: section + baseMargin * 1.5,
    paddingBottom: baseMargin / 2,
    width: '130@ms',
  },
  sliderColumn: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: baseMargin / 2,
  },
})
