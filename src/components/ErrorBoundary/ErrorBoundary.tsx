import React, { Component } from 'react'
import { View, ScrollView, Image, StyleSheet } from 'react-native'
import Button from '../Button'
import Text from '../Text'
import ShellButton from '../ShellButton'
import styles from './Styles'
import { Images } from '../../common'
import * as Sentry from '@sentry/react-native'

const { TRY_AGAIN, LOGO } = Images

export default class ErrorBoundary extends Component {
  state = { hasError: false, viewError: false, error: {}, errorInfo: {} }

  static getDerivedStateFromError(error) {
    return { hasError: true, viewError: false }
  }

  componentDidCatch(error, errorInfo) {
    const { onError } = this.props
    this.error = error
    this.errorInfo = errorInfo
    console.error(error, errorInfo)
    this.setState({ error, errorInfo })
    Sentry.captureMessage(error.message, Sentry.Severity.Error)
    onError && onError(error)
  }

  handleTryAgain = () => this.setState({ hasError: false })

  handleToggleViewError = () =>
    this.setState({ viewError: !this.state.viewError })

  render() {
    const { hasError, viewError, error, errorInfo } = this.state
    const { children } = this.props
    if (hasError) {
      return (
        <View style={styles.container}>
          <Image source={LOGO} style={styles.logo} />
          <Text style={styles.title}>Oops!</Text>
          <Text style={styles.description}>Something went wrong.</Text>
          <View style={styles.actions}>
            <ShellButton style={styles.button} onPress={this.handleTryAgain}>
              <Text style={styles.buttonText}>Try Again</Text>
              <Image source={TRY_AGAIN} style={styles.tryAgain} />
            </ShellButton>
            <ShellButton
              style={[styles.button, styles.buttonOutlined]}
              onPress={this.handleToggleViewError}
            >
              <Text style={styles.buttonTextGreen}>
                {viewError ? 'Hide Error' : 'View Error'}
              </Text>
            </ShellButton>
          </View>
          {viewError && (
            <View style={styles.baseWrapper}>
              <View style={styles.errorBase}>
                <ScrollView
                  scrollerProps={{
                    style: styles.scroller,
                    contentContainerStyle: styles.innerScroller,
                  }}
                >
                  <Text style={styles.errorTitle}>{error.message}</Text>
                  <Text style={styles.errorMessage}>
                    {errorInfo.componentStack}
                  </Text>
                </ScrollView>
              </View>
            </View>
          )}
        </View>
      )
    }

    return children
  }
}
