import React, { Component } from 'react'
import { Image, View, TouchableOpacity } from 'react-native'
import Text from './Text'
import styles from './CheckBoxLabelStyles'
import { Images } from '../common'

const { CHECK } = Images
type callback = (param: boolean, data?: any, index?: number) => void

interface Props {
  onChange: callback
  active: boolean
  onCheck?: callback
  data?: any
  offerIndex?: number
  style?: object
  label?: string
  textProps?: object
  small?: boolean
  tight?: boolean
  transparent?: boolean
  children?: any
  disabled?: boolean
  nonInteractive?: boolean
}

export default class CheckBoxLabel extends Component<Props> {
  handlePress = () => {
    const { onCheck, onChange, active, data, offerIndex } = this.props
    if (onCheck) onCheck(active, data, offerIndex)
    if (onChange) onChange(!active, data, offerIndex)
  }

  render() {
    const {
      style,
      active,
      label,
      textProps = {},
      small,
      tight,
      transparent = true,
      children,
      disabled,
      nonInteractive,
    } = this.props
    const tickStyles = [styles.checkTick]
    const textStyles: {}[] = [styles.text]
    const checkBoxStyles: {}[] = [styles.checkBox]
    const checkStyles = [style]
    if (transparent) checkBoxStyles.push(styles.transparent)
    if (disabled) checkStyles.push({ opacity: 0.5 })
    if (active) {
      textStyles.push(styles.activeText)
      checkBoxStyles.push(styles.activeCheckbox)
    }
    if (tight) checkBoxStyles.push(styles.tightCheckbox)
    if (small) textStyles.push(styles.smallText)
    return (
      <TouchableOpacity
        style={checkStyles}
        onPress={this.handlePress}
        disabled={disabled || nonInteractive}
      >
        <View style={styles.wrapper}>
          <View style={checkBoxStyles}>
            {active && <Image source={CHECK} style={tickStyles} />}
          </View>
          {children || (
            <Text style={textStyles} {...textProps}>
              {label}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    )
  }
}
