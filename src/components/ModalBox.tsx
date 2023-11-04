import React, { Component } from 'react'
import {
  View,
  Keyboard,
  TouchableWithoutFeedback,
  EmitterSubscription,
} from 'react-native'
import styles from './ModalBoxStyles'
import * as Animatable from 'react-native-animatable'
import Text from './Text'
import CloseButton from './MiscButtons/CloseButton'

interface ModalBoxProps {
  disableOutsideClose?: boolean
  title?: string
  visible?: boolean
  uncentered?: boolean
  onShow?: () => void
  onHide: () => void
}

interface ModalBoxState {
  initial: boolean
  shadeBase: number
  visible: boolean
  keyboardDidShow: EmitterSubscription | null
  keyboardDidHide: EmitterSubscription | null
}

export default class ModalBox extends Component<ModalBoxProps, ModalBoxState> {
  constructor(props: ModalBoxProps) {
    super(props)
    this.state = {
      initial: true,
      shadeBase: 0,
      visible: false,
      keyboardDidShow: null,
      keyboardDidHide: null,
    }
  }

  componentDidMount() {
    const keyboardDidShow = Keyboard.addListener(
      'keyboardDidShow',
      this.handleKeyboardShow
    )
    const keyboardDidHide = Keyboard.addListener(
      'keyboardDidHide',
      this.handleKeyboardHide
    )
    this.setState({
      keyboardDidShow,
      keyboardDidHide,
    })
  }

  componentWillUnmount() {
    const { keyboardDidShow, keyboardDidHide } = this.state
    if (keyboardDidShow) {
      keyboardDidShow.remove()
    }
    if (keyboardDidHide) {
      keyboardDidHide.remove()
    }
  }

  show = () => {
    const { onShow } = this.props
    this.setState({
      initial: false,
      visible: true,
      shadeBase: 0,
    })
    onShow && onShow()
  }

  hide = () => {
    const { onHide } = this.props
    Keyboard.dismiss()
    this.setState({
      visible: false,
    })
    onHide && onHide()
  }

  handleKeyboardShow = (event) => {
    const { visible } = this.state
    const {
      endCoordinates: { height },
    } = event
    if (visible)
      this.setState({
        shadeBase: height,
      })
  }

  handleKeyboardHide = () => {
    const { visible } = this.state
    if (visible)
      this.setState({
        shadeBase: 0,
      })
  }

  handleOnClose = () => {
    if (!this.props.disableOutsideClose) {
      this.hide()
    }
  }

  render() {
    const { shadeBase, initial, visible: visibleState } = this.state
    const { visible, title, children, uncentered } = this.props
    const isVisible = visible === undefined ? visibleState : visible
    const shadeStyles = [
      styles.shade,
      { opacity: isVisible ? 1 : 0 },
      { paddingBottom: shadeBase },
    ]
    return initial && !isVisible ? null : (
      <TouchableWithoutFeedback onPress={this.handleOnClose}>
        <Animatable.View
          transition={['opacity', 'paddingBottom']}
          delay={isVisible || !initial ? 0 : 100}
          duration={600}
          easing={'ease-out-expo'}
          pointerEvents={isVisible ? 'auto' : 'none'}
          style={shadeStyles}
        >
          <Animatable.View
            style={styles.dialogBox}
            animation={isVisible ? 'zoomIn' : 'zoomOut'}
            delay={isVisible ? 100 : 0}
            easing={'ease-out-expo'}
            duration={600}
          >
            <CloseButton
              style={styles.closeButton}
              iconStyle={styles.closeIcon}
              onPress={this.hide}
            />
            <View style={styles.dialogTitle}>
              {!!title && (
                <Text
                  style={styles.titleText}
                  fontStyle="bold"
                  fontSize="h3"
                  center
                >
                  {title}
                </Text>
              )}
            </View>
            <View style={[styles.dialogBody, uncentered && styles.uncentered]}>
              {children}
            </View>
          </Animatable.View>
        </Animatable.View>
      </TouchableWithoutFeedback>
    )
  }
}
