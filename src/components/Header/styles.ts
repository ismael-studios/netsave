import { ScaledSheet } from 'react-native-size-matters'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Metrics, Fonts, Colors } from '../../common'

const { ifIOS, baseMargin, doubleBaseMargin, inputRadius, section } = Metrics

export default ScaledSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: baseMargin,
    paddingBottom: baseMargin,
    paddingHorizontal: baseMargin,
  },
  topPadded: {
    paddingTop: doubleBaseMargin,
  },
  bordered: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderGray,
    paddingBottom: 0,
  },
  logoContainer: {
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: '57%',
    height: section * 3,
    resizeMode: 'contain',
    backgroundColor: Colors.white,
    marginTop: ifIphoneX('65@vs', '40@vs'),
  },
  searchBase: {
    alignItems: 'center',
    marginTop: baseMargin / 2,
    paddingHorizontal: baseMargin,
  },
  searchContainer: {
    borderRadius: inputRadius,
    backgroundColor: Colors.lightWhiteGray,
    height: '45@ms',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '5@vs',
    borderWidth: 1,
    borderColor: Colors.blue,
  },
  searchButton: {
    borderTopRightRadius: inputRadius * 0.95,
    borderBottomRightRadius: inputRadius * 0.95,
    backgroundColor: Colors.blue,
    paddingHorizontal: baseMargin * 1.3,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    width: '20@ms',
    height: '20@ms',
    tintColor: Colors.white,
  },
  searchInput: {
    flex: 1,
    justifyContent: 'center',
    borderBottomWidth: 0,
    paddingRight: doubleBaseMargin,
  },
  searchInputText: {
    marginTop: ifIOS(null, 0),
    fontSize: Fonts.size.h5,
    paddingLeft: doubleBaseMargin,
    color: Colors.blue,
    flex: 1,
  },
  clearSearchButton: {
    padding: baseMargin / 2,
    borderRadius: 90,
    backgroundColor: Colors.lightGray,
    marginRight: baseMargin,
  },
  clearSearchIcon: {
    width: '7@ms',
    height: '7@ms',
    tintColor: Colors.blue,
  },
  baseContainer: {
    minHeight: ifIphoneX(50, 40),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: Fonts.size.regular,
    width: '100%',
    textAlign: 'center',
    paddingHorizontal: doubleBaseMargin * 2,
  },
  leftButton: {
    position: 'absolute',
    top: 0,
    left: baseMargin,
    zIndex: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: '14@ms',
    height: '14@ms',
  },
  tight: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  right: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  rightButton: {
    paddingLeft: doubleBaseMargin,
    paddingRight: baseMargin,
    paddingVertical: baseMargin / 2,
  },
  rightButtonText: {
    ...Fonts.style.medium,
    fontSize: Fonts.size.regular,
    color: Colors.blue,
  },
  avoidMode: {
    paddingTop: ifIphoneX(section * 1.5, ifIOS(section, baseMargin)),
  },
  progressBar: {
    height: 5,
    width: '111%',
    alignSelf: 'flex-start',
    borderBottomWidth: 2,
    marginLeft: -doubleBaseMargin,
    borderBottomColor: Colors.paleGreen,
    marginBottom: baseMargin,
  },
})
