import { StyleSheet } from 'react-native'
import { Colors } from '../common'
const { green } = Colors

export default StyleSheet.create({
  questionCircle: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: green,
    borderRadius: 10,
  },
  questionMark: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
    tintColor: green,
  },
})
