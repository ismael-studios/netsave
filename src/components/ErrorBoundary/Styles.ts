import React from 'react'
import { ScaledSheet } from 'react-native-size-matters'
import { Metrics, Colors, Fonts } from '../../common'

const { baseMargin, doubleBaseMargin, doubleSection, buttonRadius } = Metrics
const { white, red, green, darkGreen } = Colors
const { style, size } = Fonts

export default ScaledSheet.create({
  container: {
    flex: 1,
    paddingTop: doubleSection + doubleBaseMargin,
    padding: doubleBaseMargin,
    alignItems: 'center',
  },
  logo: {
    height: 25,
    resizeMode: 'contain',
    marginBottom: doubleBaseMargin,
  },
  title: {
    ...style.semiBold,
    fontSize: size.h1,
  },
  description: {
    // ...style.semiBold,
    fontSize: size.standard,
  },
  actions: {
    flexDirection: 'row',
    paddingTop: doubleBaseMargin,
  },
  button: {
    padding: baseMargin,
    paddingHorizontal: doubleBaseMargin,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: green,
    borderRadius: buttonRadius,
    marginBottom: doubleBaseMargin,
  },
  buttonOutlined: {
    marginLeft: doubleBaseMargin,
    backgroundColor: white,
    borderWidth: 1,
    borderColor: green,
  },
  buttonText: {
    ...style.semiBold,
    color: white,
  },
  buttonTextGreen: {
    ...style.semiBold,
    color: green,
  },
  tryAgain: {
    marginLeft: baseMargin / 2,
    resizeMode: 'contain',
    tintColor: white,
    width: 18,
    height: 18,
  },
  scroller: {
    // flex: 1
  },
  innerScroller: {
    padding: baseMargin,
  },
  errorBase: {
    padding: doubleBaseMargin,
    backgroundColor: red,
  },
  baseWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  errorTitle: {
    fontSize: size.h5,
    ...style.bold,
    color: white,
  },
  errorMessage: {
    fontSize: size.h6,
    color: white,
  },
})
