import { ScaledSheet } from 'react-native-size-matters'
import { Colors, Fonts, Metrics } from '../../common'

import { stylesObject } from './Styles'

const { style, size } = Fonts
const { white, gray, green, lightGray, borderGray } = Colors
const { baseMargin, section, doubleBaseMargin } = Metrics

export default ScaledSheet.create({
  ...stylesObject,
  wrapper: {
    ...stylesObject.wrapper,
    paddingBottom: 0,
  },
  labelTitle: {
    ...stylesObject.label,
    marginBottom: baseMargin,
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
    width: '50@ms',
    height: '50@ms',
    borderWidth: 0.5,
    borderColor: borderGray,
    marginRight: baseMargin * 1.5,
  },
  draftActions: {
    padding: doubleBaseMargin,
    paddingRight: 0,
  },
  titleText: {
    ...style.bold,
    fontSize: size.standard,
  },
  priceText: {
    fontSize: size.standard,
  },
  floatingMenu: {
    bottom: -baseMargin * 1.5,
  },
})
