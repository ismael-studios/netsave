import React, { Component } from 'react'
import styles from './Styles'
import Text from '../Text'
import Button from '../Button'

export default class ActionButton extends Component {
  handlePress = () => {
    const { action, onPress } = this.props
    onPress(action)
  }
  render() {
    const {
      index,
      disabled,
      action: { name, positive, block, danger },
    } = this.props
    return (
      <Button
        tight
        block={block}
        outlined={!positive && !danger}
        blueGradient={positive}
        key={index}
        disabled={disabled}
        style={[
          styles.actionButton,
          positive && styles.positiveButton,
          danger && styles.dangerButton,
        ]}
        onPress={this.handlePress}
      >
        <Text color={!positive && !danger ? 'blue' : 'white'}>{name}</Text>
      </Button>
    )
  }
}
