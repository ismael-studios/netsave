import { ScaledSheet } from 'react-native-size-matters'
import { Metrics, Colors, Fonts } from '../../../common'

const { baseMargin, doubleBaseMargin } = Metrics
const { lightGray, green, borderGray } = Colors
const { size } = Fonts

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
  wrapper: {
    flex: 1,
    padding: doubleBaseMargin,
    paddingBottom: 0,
  },
  drafts: {
    marginTop: -baseMargin * 1.5,
  },
  draft: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: lightGray,
    paddingVertical: baseMargin * 1.5,
  },
  draftTitle: {
    flex: 1,
  },
  draftImage: {
    width: '60@ms',
    height: '60@ms',
    borderWidth: 0.5,
    borderColor: borderGray,
    marginRight: baseMargin * 1.5,
  },
  draftActions: {
    padding: doubleBaseMargin,
    paddingRight: 0,
  },
  priceText: {
    fontSize: size.standard,
    marginVertical: 4,
  },
  floatingMenu: {
    bottom: -baseMargin * 0.5,
  },
})
