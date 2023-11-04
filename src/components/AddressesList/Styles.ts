import { ScaledSheet } from 'react-native-size-matters'
import { Colors, Fonts, Metrics } from '../../common'

const { style, size } = Fonts
const { green, borderGray } = Colors

const { baseMargin, doubleBaseMargin } = Metrics

export default ScaledSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  empty: {
    flexDirection: 'row',
    marginBottom: doubleBaseMargin,
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
    // paddingTop: baseMargin / 2
  },
  lastAddress: {
    borderBottomWidth: 0.5,
    borderBottomColor: borderGray,
  },
  radios: {
    alignItems: 'center',
    marginTop: baseMargin,
    marginBottom: baseMargin * 1.5,
  },
  addressRadio: {
    borderTopWidth: 0.5,
    borderTopColor: borderGray,
  },
  radioWrap: {
    marginRight: baseMargin / 2,
  },
})
