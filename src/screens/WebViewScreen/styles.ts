import { ScaledSheet } from 'react-native-size-matters'
import { Metrics } from '../../common'

const { footerHeight, headerHeight } = Metrics

export default ScaledSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    flex: 1,
    top: headerHeight * 1.5,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9,
  },
})
