import React, { useEffect, useRef, useState } from 'react'
import {
  KeyboardAvoidingView,
  Keyboard,
  View,
  ScrollView as RNScrollView,
} from 'react-native'
import styles from './Styles'
import {
  Text,
  Button,
  ScrollView,
  ShowAlert,
  Header,
  Input,
} from '../../components'
import { Colors } from '../../common'
import Collapsible from 'react-native-collapsible'
import {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button'
import { ifIOS } from '../../common/Metrics'
import { useReportReviewMutation } from '../../store/slice/api/features/review'
import { ReportReviewStackScreenProps } from '../../navigation/types'

const OPTIONS = [
  'This review is note relevant to this transaction',
  'This review contains false claims or information',
  'Offensive or sexually explicit',
  'Privacy concern',
  'Other',
]

const Report = ({
  navigation,
  route,
}: ReportReviewStackScreenProps<'ReportReviewInfo'>) => {
  const { review } = route.params
  const { sellerUserId, productId, transactionId, id, reviewUser } = review

  const scrollerRef = useRef<RNScrollView>(null)
  const [viewingKeyboard, setViewingKeyboard] = useState(false)
  const [selected, setSelected] = useState<number>()
  const [other, setOther] = useState('')
  const [reportReview, { isLoading, isSuccess, isError, error }] =
    useReportReviewMutation()

  useEffect(() => {
    if (isSuccess) {
      if (reviewUser) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'ReportSuccess',
              params: {
                userId: reviewUser.id,
              },
            },
          ],
        })
      }
    }
  }, [isSuccess, navigation, reviewUser])

  useEffect(() => {
    if (isError) {
      ShowAlert({
        message:
          error.data.message ||
          'There was an error submitting your report. Try again.',
      })
    }
  }, [isError, error])

  useEffect(() => {
    const handleKeyboardShow = () => setViewingKeyboard(true)
    const handleKeyboardHide = () => setViewingKeyboard(false)
    const keyboardWillShow = Keyboard.addListener(
      'keyboardWillShow',
      handleKeyboardShow
    )
    const keyboardWillHide = Keyboard.addListener(
      'keyboardWillHide',
      handleKeyboardHide
    )

    return () => {
      keyboardWillShow.remove()
      keyboardWillHide.remove()
    }
  }, [])

  const handleReport = () => {
    if (selected) {
      let report = OPTIONS[selected]
      if (report === 'Other') report = other
      reportReview({
        userId: sellerUserId,
        productId,
        transactionId,
        reviewId: id,
        data: {
          description: report,
        },
      })
    }
  }

  const handleCancel = () => {
    navigation.goBack()
  }
  const handleSelect = (value: number) => {
    setSelected(value)
  }

  const cantSend =
    selected === null || (selected === OPTIONS.length - 1 && other.length < 25)
  return (
    <KeyboardAvoidingView
      behavior={ifIOS('padding', 'height')}
      style={{ width: '100%', height: '100%' }}
    >
      <View style={styles.container}>
        <Header
          showBack
          avoidMode
          bordered
          title={'Report Review'}
          style={styles.header}
        />
        <View style={styles.container}>
          <ScrollView ref={scrollerRef} hideScroller={false}>
            <View style={styles.wrapper}>
              <Text fontSize="standard">What's wrong with this review?</Text>
              <View style={styles.radios}>
                {OPTIONS.map((label, value) => (
                  <View key={value} style={styles.radioRow}>
                    <RadioButton labelHorizontal={true} style={styles.radio}>
                      <RadioButtonInput
                        obj={{ label, value }}
                        index={value}
                        isSelected={selected === value}
                        borderWidth={2}
                        buttonColor={Colors.green}
                        selectedButtonColor={Colors.green}
                        selectedLabelColor={Colors.green}
                        buttonSize={9}
                        buttonOuterSize={18}
                        onPress={handleSelect}
                      />
                      <RadioButtonLabel
                        obj={{ label, value }}
                        index={value}
                        labelHorizontal={true}
                        labelColor={Colors.darkGray}
                        labelStyle={{
                          ...styles.radioLabel,
                          ...((selected === value &&
                            styles.radioLabelSelected) ||
                            {}),
                        }}
                        onPress={handleSelect}
                      />
                    </RadioButton>
                    {label === 'Other' && selected === value ? (
                      <React.Fragment>
                        <Input
                          multiline
                          style={styles.input}
                          inputStyle={styles.inputText}
                          placeholder="Reason"
                          value={other}
                          onFocus={() => scrollerRef.current?.scrollToEnd()}
                          onChangeText={setOther}
                        />
                        {cantSend && (
                          <Text notop padded color="red" fontSize="tiny">
                            -{25 - other.length}
                          </Text>
                        )}
                      </React.Fragment>
                    ) : null}
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={styles.actions}>
          <Button
            tight
            onPress={handleReport}
            loading={isLoading}
            disabled={cantSend}
            style={!viewingKeyboard && styles.button}
          >
            Report
          </Button>
          <Collapsible collapsed={viewingKeyboard}>
            <Button loading={isLoading} outlined tight onPress={handleCancel}>
              Cancel
            </Button>
          </Collapsible>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default Report
