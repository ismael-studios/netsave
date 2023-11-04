import React, { Component } from 'react'
import { View } from 'react-native'
import Text from '../Text'
import ShellButton from '../ShellButton'
import styles from './styles'

export default class FeaturedBar extends Component {
  state = {
    selections: [
      {
        id: 1,
        name: 'New',
      },
      {
        id: 2,
        name: 'For Sale',
      },
      {
        id: 3,
        name: 'Free Stuff',
      },
    ],
    currentSelection: { id: 1 },
  }

  handleSelection = (currentSelection) => {
    const { onSelectionChange } = this.props
    this.setState({
      currentSelection,
    })
    onSelectionChange && onSelectionChange(currentSelection)
  }

  renderSelection = ({ id, name }, i) => {
    const {
      currentSelection: { id: currentId },
    } = this.state
    const isSelected = id == currentId
    return (
      <ShellButton
        transition={['borderBottomWidth']}
        style={[styles.selectionButton, isSelected && styles.buttonSelected]}
        key={id}
        data={{ id, name }}
        onPress={this.handleSelection}
      >
        <Text color="white" fontStyle="bold" fontSize="h5">
          {name}
        </Text>
      </ShellButton>
    )
  }

  render() {
    const { selections } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.titleBar}>
          <Text
            fontSize="medium"
            fontStyle="bold"
            color="white"
            style={styles.title}
          >
            Shop & Save with Convenience
          </Text>
        </View>
        <View style={styles.selectionsBar}>
          {selections.map(this.renderSelection)}
        </View>
      </View>
    )
  }
}
