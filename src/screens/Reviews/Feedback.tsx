import React, { useEffect, useState } from 'react'
import {
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  View,
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
import { Metrics } from '../../common'
import { usePostReviewMutation } from '../../store/slice/api/features/review'
import { TransactionStackScreenProps } from '../../navigation/types'

const { ifIOS } = Metrics
const PLACE_HOLDERS = {
  seller:
    'Say something nice to encourage seller to post more quality products!',
  buyer:
    'Say something nice to encourage buyer to make better offers next time!',
}

const Feedback = ({
  navigation,
  route,
}: TransactionStackScreenProps<'Feedback'>) => {
  const { type: criteriaType, rating, product, transaction } = route.params

  const [feedback, setFeedback] = useState('')

  const [postReview, { isSuccess, isError, error, isLoading }] =
    usePostReviewMutation()

  useEffect(() => {
    if (isSuccess) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'ReviewSuccess',
            params: {
              product,
            },
          },
        ],
      })
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError) {
      const message = error.data.message
      ShowAlert({
        message:
          message || 'There was a problem posting your review. Try again.',
      })
    }
  }, [isError, error])

  const handleSubmit = () => {
    const { id: transactionId } = transaction
    const { id: productId, userId } = product
    const details = Object.keys(rating).map((id) => ({
      id: Number(id),
      rating: rating[+id],
    }))

    postReview({
      userId,
      productId,
      transactionId,
      data: {
        details,
        description: feedback,
      },
    })
  }

  const canSend = !isLoading && feedback && feedback.length + 1 > 10

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={ifIOS('padding', 'height')}
        style={styles.container}
      >
        <View style={styles.container}>
          <Header
            showBack
            avoidMode
            title={`Transaction Completed`}
            style={styles.header}
          />
          <View style={styles.container}>
            <Text style={styles.pageTitle}>Feedback to {criteriaType}</Text>
            <ScrollView hideScroller={false}>
              <View style={styles.subWrapper}>
                <Input
                  multiline
                  value={feedback}
                  placeholder={PLACE_HOLDERS[criteriaType]}
                  onChangeText={setFeedback}
                />
                {feedback.length >= 10 ? null : (
                  <Text color="red" fontSize="tiny">
                    -{10 - feedback.length}
                  </Text>
                )}
              </View>
            </ScrollView>
          </View>
          <View style={styles.actions}>
            <Text style={styles.footnote}>
              Your feedback will be shared on the {criteriaType} public profile
              after the {criteriaType}'s feedback to you or in 7 days if the{' '}
              {criteriaType} doesn't provide any feedback.
            </Text>
            <Button
              tight
              onPress={handleSubmit}
              loading={isLoading}
              disabled={!canSend}
            >
              Submit
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

export default Feedback
