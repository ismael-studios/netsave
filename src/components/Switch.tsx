import React, { Component } from 'react'
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import Text from './Text'
import styles from './SwitchStyles'
import * as Animatable from 'react-native-animatable'

interface Props {
  active: boolean
  disabled?: boolean
  style?: typeof StyleSheet
  data?: any
  onCheck?: (active: boolean, data: any) => void
  onChange?: (active: boolean, data: any) => void
}

export default class Switch extends Component<Props> {
  handlePress = () => {
    const { onCheck, onChange, active, data } = this.props
    if (onCheck) onCheck(active, data)
    if (onChange) onChange(!active, data)
  }
  render() {
    const { style, active, disabled } = this.props
    const switchStyles = [styles.container, style]
    const bgStyles = [styles.switchBG]
    const notchStyles = [styles.notch]
    if (disabled) switchStyles.push({ opacity: 0.5 })
    if (!active) {
      bgStyles.push(styles.switchOffBG)
      notchStyles.push(styles.notchOff)
    }
    return (
      <TouchableWithoutFeedback
        style={switchStyles}
        onPress={this.handlePress}
        disabled={disabled}
      >
        <View style={bgStyles}>
          <Text style={[styles.onText, { opacity: Number(active) }]}>ON</Text>
          <Text style={[styles.offText, { opacity: Number(!active) }]}>
            OFF
          </Text>
          <Animatable.View style={notchStyles} />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
