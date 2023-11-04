import React from 'react'
import {
  Keyboard,
  ScrollView as RNScrollView,
  ScrollViewProps,
  TouchableWithoutFeedbackProps,
  TouchableWithoutFeedback,
  ViewProps,
  KeyboardAvoidingView,
  View,
} from 'react-native'
import { Metrics } from '../common'

const { ifIOS } = Metrics

interface Props {
  hideScroller?: boolean
  scrollerProps?: ScrollViewProps
  touchableProps?: TouchableWithoutFeedbackProps
  viewProps?: ViewProps
  avoidKeyboard?: boolean
  behavior?: string
  children: React.ReactNode
}

const ScrollView = React.forwardRef<RNScrollView, Props>(
  (props: Props, ref) => {
    const {
      hideScroller,
      scrollerProps = {},
      touchableProps = {},
      viewProps = {},
      avoidKeyboard,
      behavior,
      children,
    } = props
    const scroller = (
      <RNScrollView
        ref={ref}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={hideScroller}
        {...scrollerProps}
      >
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          {...touchableProps}
        >
          <View {...viewProps}>{children}</View>
        </TouchableWithoutFeedback>
      </RNScrollView>
    )
    return avoidKeyboard ? (
      <KeyboardAvoidingView behavior={behavior || ifIOS('padding', 'height')}>
        {scroller}
      </KeyboardAvoidingView>
    ) : (
      scroller
    )
  }
)

export default ScrollView
