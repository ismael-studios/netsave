import { ScaledSheet } from 'react-native-size-matters'
import { Colors, Metrics } from '../../common'

export default ScaledSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  float: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9,
  },
  floatRight: {
    left: undefined,
    right: 0,
  },
  icon: {
    // marginTop: 1,
    width: '18@ms',
    height: '18@ms',
    resizeMode: 'contain',
    tintColor: Colors.blue,
  },
  backStyle: {
    marginLeft: 0,
  },
  rounded: {
    padding: 0,
    backgroundColor: Colors.boneWhite,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  caret: {
    width: '17@ms',
    height: '17@ms',
    resizeMode: 'contain',
    tintColor: Colors.blue,
  },
  shadowed: {
    backgroundColor: Colors.white,
    width: '30@ms',
    height: '30@ms',
    padding: 0,
    borderRadius: 50,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 9,
  },
})
