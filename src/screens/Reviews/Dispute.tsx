import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Keyboard, View } from 'react-native'
import styles from './Styles'
import { Text, Button, ShowAlert, Header, Input } from '../../components'
import Collapsible from 'react-native-collapsible'
import { TransactionStackScreenProps } from '../../navigation/types'
import { useDisputeTransactionMutation } from '../../store/slice/api/features/transaction'

const Dispute = ({
  navigation,
  route,
}: TransactionStackScreenProps<'Dispute'>) => {
  const { transaction } = route.params
  const { id: transactionId, sellerUserId, productId } = transaction

  const [viewingKeyboard, setViewingKeyboard] = useState(false)
  const [dispute, setDispute] = useState('')

  const [disputeTransaction, { isSuccess, isLoading, isError, error }] =
    useDisputeTransactionMutation()

  useEffect(() => {
    if (isSuccess) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'DisputeSuccess',
            params: {
              userId: sellerUserId,
            },
          },
        ],
      })
    }
  }, [isSuccess])

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

  const handleDispute = () => {
    disputeTransaction({
      userId: sellerUserId,
      productId,
      transactionId,
      data: {
        description: dispute,
      },
    })
  }

  const handleCancel = () => {
    navigation.goBack()
  }

  const cantSend = dispute.length < 25
  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ width: '100%', height: '100%' }}
    >
      <View style={styles.container}>
        <Header
          showBack
          avoidMode
          bordered
          title={'Dispute'}
          style={styles.header}
        />
        <View style={styles.container}>
          <View style={styles.wrapper}>
            <Text fontSize="regular">
              Please provide as much information as possible to support your
              dispute:
            </Text>
            <View style={styles.row}>
              <Input
                multiline
                style={[styles.input, styles.inputLarge]}
                inputStyle={styles.inputText}
                value={dispute}
                placeholder="Tell us what happened"
                onChangeText={setDispute}
              />
              {cantSend && (
                <Text notop padded color="red" fontSize="tiny">
                  -{25 - dispute.length}
                </Text>
              )}
            </View>
          </View>
        </View>
        <View style={styles.actions}>
          <Button
            tight
            onPress={handleDispute}
            loading={isLoading}
            disabled={cantSend}
            style={!viewingKeyboard && styles.button}
          >
            Submit Dispute
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

export default Dispute
