import React, { Component } from 'react'
import { View } from 'react-native'
import Text from '../Text'
import styles from './styles'
import * as Animatable from 'react-native-animatable'

interface Props {
  current: number
  total: number
}

export default class ProgressSteps extends Component<Props> {
  render() {
    const { current, total } = this.props
    const progress: number = Math.round((current / total) * 100)

    return (
      <Animatable.View
        transition={['height', 'marginTop', 'paddingBottom']}
        easing="ease-out-expo"
        duration={1e3}
        style={styles.container}
      >
        <View style={styles.info}>
          <Text style={styles.infoText}>
            Step {current} of {total}
          </Text>
        </View>
        <View style={styles.progress}>
          <View style={styles.base}>
            <View style={[styles.bar, { width: `${progress}%` }]} />
          </View>
        </View>
      </Animatable.View>
    )
  }
}
