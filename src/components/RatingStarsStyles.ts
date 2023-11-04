import { ScaledSheet } from 'react-native-size-matters'
import { Colors, Metrics } from '../common'

export default ScaledSheet.create({
  container: {},
  stars: {
    position: 'absolute',
    top: Metrics.baseMargin / 2,
    left: 2,
    flexDirection: 'row',
  },
  outlineStars: {
    position: 'relative',
  },
  solidStars: {},
  star: {
    width: '10.5@ms',
    height: '10.5@ms',
    marginRight: 3,
  },
  empty: {},
  solid: {},
})
