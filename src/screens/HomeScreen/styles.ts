import { ScaledSheet } from 'react-native-size-matters'
import { Colors } from '../../common'

const { lightGray, white } = Colors

export default ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightGray,
  },
  scroller: {
    backgroundColor: white,
  },
})
