import React, { Component } from 'react'
import {
  ActivityIndicator,
  View,
  Image,
  TouchableWithoutFeedback,
} from 'react-native'
import * as Animatable from 'react-native-animatable'
import styles from './FloatingMenuStyles'
import ShellButton from './ShellButton'
import { Images, Colors } from '../common'
import Text from './Text'

const { CLOSE_CRICLE } = Images

export default class FloatingMenu extends Component {
  handlePressMenu = (item) => {
    const { callback } = item
    const { closeCallBack } = this.props
    callback && callback(item)
    closeCallBack && closeCallBack()
  }

  renderMenuEntry = (item, i) => {
    const { name, loading, icon, callback } = item
    return (
      <ShellButton
        key={i}
        data={item}
        onPress={loading ? null : this.handlePressMenu}
        style={styles.menu}
      >
        <Animatable.View
          // delay={i * 80}
          // duration={400}
          // animation='slideInUp'
          // easing='ease-out-back'
          style={styles.wrapper}
        >
          {icon && !loading && <Image source={icon} style={styles.icon} />}
          {loading && (
            <ActivityIndicator color={Colors.orange} style={styles.loading} />
          )}
          {name && (
            <Text style={[styles.text, loading && { color: Colors.orange }]}>
              {name}
            </Text>
          )}
        </Animatable.View>
      </ShellButton>
    )
  }

  render() {
    const { style, menu, closeCallBack, title = 'Share', children } = this.props
    const stylesArray = [styles.container, style]
    return (
      <TouchableWithoutFeedback onPress={closeCallBack}>
        <Animatable.View
          animation="fadeIn"
          duration={300}
          easing="ease-out-expo"
          style={styles.shade}
        >
          <Animatable.View
            duration={500}
            animation="slideInUp"
            easing="ease-out-expo"
            style={stylesArray}
          >
            <View style={styles.header}>
              <ShellButton onPress={closeCallBack}>
                <View style={styles.notch} />
              </ShellButton>
              <ShellButton style={styles.closeButton} onPress={closeCallBack}>
                <Image source={CLOSE_CRICLE} style={styles.closeIcon} />
              </ShellButton>
              <Text>{title}</Text>
            </View>
            {children || (
              <View style={styles.menues}>
                {menu.map(this.renderMenuEntry)}
              </View>
            )}
          </Animatable.View>
        </Animatable.View>
      </TouchableWithoutFeedback>
    )
  }
}
