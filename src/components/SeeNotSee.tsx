import React, { Component } from 'react'
import { Image, View, ViewProps, ViewStyle } from 'react-native'
import ShellButton from './ShellButton'
import styles from './SeeNotSeeStyles'
import { Images } from '../common'

const { SEE, SEE_NOT } = Images

export interface Props extends ViewProps {
  style?: ViewStyle | ViewStyle[]
  seeing?: boolean
}

export default class SeeNotSee extends Component {
  render() {
    const { seeing = false, style, ...otherProps }: Props = this.props
    return (
      <ShellButton {...otherProps} style={[styles.container, style]}>
        <View>
          {seeing ? (
            <Image source={SEE} style={styles.seeImage} />
          ) : (
            <Image source={SEE_NOT} style={styles.seeNotImage} />
          )}
        </View>
      </ShellButton>
    )
  }
}
