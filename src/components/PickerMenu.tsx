import React, { Component } from 'react'
import { View } from 'react-native'
import PickerSelect from 'react-native-picker-select'
import styles from './PickerMenuStyles'
import Text from './Text'

export default class PickerMenu extends Component {
  renderIcon = () => {}
  render() {
    const {
      menu,
      onChange,
      value,
      placeholder,
      placeholderValue,
      disabled,
      darkMode,
      style,
    } = this.props
    return (
      <View style={[style, styles.viewContainer]}>
        <PickerSelect
          disabled={disabled}
          value={value}
          placeholder={
            placeholder
              ? { label: placeholder, value: placeholderValue || '' }
              : null
          }
          useNativeAndroidPickerStyle={false}
          style={{
            // viewContainer: styles.viewContainer,
            inputIOS: styles.input,
            inputAndroid: styles.input,
            placeholder: styles.input,
          }}
          Icon={this.renderIcon}
          onValueChange={onChange}
          items={menu}
        >
          <View style={styles.container}>
            <Text style={styles.input}>
              {(value && (value.label || value)) || placeholder}
            </Text>
            <View style={styles.arrow} />
          </View>
        </PickerSelect>
      </View>
    )
  }
}
