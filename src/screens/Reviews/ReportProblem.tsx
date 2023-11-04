import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Keyboard, View } from 'react-native'
import styles from './Styles'
import { Text, Button, ShowAlert, Header, Input } from '../../components'
import { ApiConstants } from '../../services'
import Collapsible from 'react-native-collapsible'
import { ifIOS } from '../../common/Metrics'
import { TransactionStackScreenProps } from '../../navigation/types'
import { usePutTransactionMutation } from '../../store/slice/api/features/transaction'

const { TRANSACTION_PROBLEM_STATUS, TRANSACTION_STATUS_ID_KEY } = ApiConstants

const ReportProblem = ({
  navigation,
  route,
}: TransactionStackScreenProps<'ReportProblem'>) => {
  const { transaction } = route.params

  const [report, setReport] = useState('')
  const [viewingKeyboard, setViewingKeyboard] = useState(false)

  const [putTransaction, { isLoading, isSuccess, isError, error }] =
    usePutTransactionMutation()

  useEffect(() => {
    const handleKeyboardShow = () => setViewingKeyboard(true)

    const handleKeyboardHide = () => setViewingKeyboard(false)

    const keyboardDidShow = Keyboard.addListener(
      'keyboardDidShow',
      handleKeyboardShow
    )
    const keyboardDidHide = Keyboard.addListener(
      'keyboardDidHide',
      handleKeyboardHide
    )

    return () => {
      keyboardDidShow.remove()
      keyboardDidHide.remove()
    }
  }, [])

  useEffect(() => {
    if (isSuccess) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'ReportProblemSuccess',
          },
        ],
      })
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError && error) {
      ShowAlert({
        message:
          error.data.message ||
          'There was an error submitting your report. Try again.',
      })
    }
  }, [isError, error])

  const handleReportProblem = () => {
    const { id: transactionId, sellerUserId, productId } = transaction
    putTransaction({
      userId: sellerUserId,
      productId,
      transactionId,
      data: {
        [TRANSACTION_STATUS_ID_KEY]: TRANSACTION_PROBLEM_STATUS,
        info: report,
      },
    })
  }

  const handleCancel = () => {
    navigation.goBack()
  }

  const cantSend = report.length < 25
  return (
    <KeyboardAvoidingView
      behavior={ifIOS('padding', 'height')}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Header
          showBack
          avoidMode
          bordered
          title={'Report Problems'}
          style={styles.header}
        />
        <View style={styles.container}>
          <View style={styles.wrapper}>
            <Text fontSize="regular">
              {
                'Report any problems you may have with the transaction. Once received, our '
              }
              <Text fontSize="regular" fontStyle="bold">
                {'customer care team'}
              </Text>
              {
                ' will look into the issue as soon as possible and get back to you.'
              }
            </Text>
            <View style={styles.row}>
              <Input
                multiline
                style={[styles.input, styles.inputLarge]}
                inputStyle={styles.inputText}
                value={report}
                placeholder="Provide a detailed description of the issue."
                onChangeText={setReport}
              />
              {cantSend && (
                <Text notop padded color="red" fontSize="tiny">
                  -{25 - report.length}
                </Text>
              )}
            </View>
          </View>
        </View>
        <View style={styles.actions}>
          <Collapsible collapsed={viewingKeyboard}>
            <Button
              tight
              onPress={handleReportProblem}
              loading={isLoading}
              disabled={cantSend}
              style={!viewingKeyboard && styles.button}
            >
              Report
            </Button>
            <Button loading={isLoading} outlined tight onPress={handleCancel}>
              Cancel
            </Button>
          </Collapsible>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default ReportProblem
