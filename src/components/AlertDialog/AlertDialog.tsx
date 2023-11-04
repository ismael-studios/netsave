// created by arian deqyd hendricks © 2020

import React, { Component } from 'react'
import { View, Image, Keyboard } from 'react-native'
import styles from './Styles'
import * as Animatable from 'react-native-animatable'
import Text from '../Text'
import { CloseButton } from '../MiscButtons'
import Input from '../Input'
import ActionButton from './ActionButton'

let MasterAlert: AlertDialog | null

type Action = {
  name: string
  positive?: boolean
  input?: string
  callback?: (data: Action) => void
}
type Actions = Action[]
export type Config = {
  icon?: any
  title?: string
  message?: string
  actions?: Actions
  isInput?: boolean
  inputText?: string
  inputConfig?: { validation?: (data: string) => void }
}
type KeyboardEvent = {
  endCoordinates: { height: number }
}

export const ShowAlert = (config: Config) => {
  Keyboard.dismiss()
  MasterAlert && MasterAlert.show(config)
}

export const ShowInputAlert = (config: Config) => {
  Keyboard.dismiss()
  MasterAlert && MasterAlert.showInput(config)
}

export const HideAlert = () => {
  MasterAlert && MasterAlert.hide()
}

export default class AlertDialog extends Component {
  input: Input | null = null
  state = {
    initial: true,
    visible: false,
    isInput: false,
    inputText: '',
    inputConfig: {},
    icon: null,
    title: '',
    message: '',
    actions: [],
    shadeBase: 0,
    keyboardDidShow: null,
    keyboardDidHide: null,
  }

  componentDidMount() {
    MasterAlert = this
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
    MasterAlert = null
  }

  show = ({ title, message, icon, actions = [] }: Config) => {
    this.setState({
      icon,
      initial: false,
      title: title || 'Netsave',
      isInput: false,
      message: message || title,
      visible: true,
      shadeBase: 0,
      actions,
    })
  }

  showInput = ({
    title,
    message,
    actions = [],
    inputText = '',
    inputConfig = { validation: undefined },
  }: Config) => {
    this.setState(
      {
        initial: false,
        title: message ? title : 'Netsave',
        message: message || title,
        inputText,
        inputConfig,
        isInput: true,
        visible: true,
        shadeBase: 0,
        actions,
      },
      () => {
        setTimeout(() => this.input && this.input.focus(), 300)
      }
    )
  }

  hide = () => {
    Keyboard.dismiss()
    this.setState({
      visible: false,
    })
  }

  handleKeyboardShow = (event: KeyboardEvent) => {
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
    const { actions } = this.state
    this.hide()
    const negativeCallback = actions.filter(
      (action) => action.positive === false
    )[0]
    if (negativeCallback) negativeCallback.callback()
  }

  handleActionPress = (action: Action) => {
    const { callback } = action
    if (callback) callback(action)
    this.hide()
  }

  handleInputText = (inputText: string) => this.setState({ inputText })

  handleInputRef = (ref: Input) => (this.input = ref)

  renderActionButton = (action: Action, i: number) => {
    if (action.positive === false) return
    const {
      inputText,
      isInput,
      inputConfig: { validation },
    } = this.state
    const validated = validation ? validation(inputText) : true
    const disabled = action.positive
      ? isInput && !(inputText && validated)
      : false
    return (
      <ActionButton
        key={i}
        index={i}
        action={{ ...action, input: inputText }}
        onPress={this.handleActionPress}
        disabled={disabled}
      />
    )
  }

  renderInput(inputText: string) {
    const { inputConfig } = this.state
    return (
      <Input
        center
        autoFocus
        selectTextOnFocus
        value={inputText}
        style={styles.input}
        inputStyle={styles.inputText}
        ref={this.handleInputRef}
        onChangeText={this.handleInputText}
        {...inputConfig}
      />
    )
  }

  render() {
    const {
      icon,
      actions = [],
      visible,
      initial,
      isInput,
      shadeBase,
      inputText,
      title = '',
      message = '',
    } = this.state
    const shadeStyles = [
      styles.shade,
      { opacity: visible ? 1 : 0 },
      { paddingBottom: shadeBase },
    ]
    return initial && !visible ? null : (
      <Animatable.View
        transition={['opacity', 'paddingBottom']}
        delay={visible ? 0 : 100}
        duration={600}
        easing={'ease-out-expo'}
        pointerEvents={visible ? 'auto' : 'none'}
        style={shadeStyles}
      >
        <Animatable.View
          style={styles.dialogBox}
          animation={visible ? 'zoomIn' : 'zoomOut'}
          delay={visible ? 100 : 0}
          duration={600}
          easing={'ease-out-expo'}
        >
          <CloseButton
            style={styles.closeButton}
            onPress={this.handleOnClose}
          />
          {icon && (
            <View style={styles.dialogIcon}>
              <Image source={icon} style={styles.dialogIconImage} />
            </View>
          )}
          <View style={styles.dialogTitle}>
            <Text
              style={styles.titleText}
              fontSize="h4"
              fontStyle="bold"
              center
            >
              {title}
            </Text>
          </View>
          <View style={styles.dialogBody}>
            <Text center style={styles.bodyText}>
              {message}
            </Text>
            {isInput && this.renderInput(inputText)}
          </View>
          <View style={styles.dialogActions}>
            {actions.map(this.renderActionButton)}
            {actions.length === 0 && (
              <ActionButton
                positive={true}
                key={'close'}
                action={{ name: 'Close' }}
                onPress={this.handleOnClose}
              />
            )}
          </View>
        </Animatable.View>
      </Animatable.View>
    )
  }
}
