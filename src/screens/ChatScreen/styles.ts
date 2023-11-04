import { ScaledSheet } from 'react-native-size-matters'
import { Colors, Metrics } from '../../common'

const { baseMargin, screenHeight } = Metrics
const { lightWhiteGray, borderGray } = Colors

export default ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  wrapper: {
    flex: 1,
    borderTopWidth: 0.5,
    borderTopColor: borderGray,
    backgroundColor: lightWhiteGray,
  },
  header: { paddingHorizontal: 0, paddingBottom: 0 },
  chatList: {
    flex: 1,
    backgroundColor: lightWhiteGray,
  },
  sendButton: {
    flex: 1,
    paddingRight: baseMargin / 4,
    paddingTop: baseMargin,
  },
})
