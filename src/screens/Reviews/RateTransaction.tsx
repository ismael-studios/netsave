import React, { useState } from 'react'
import { Image, View } from 'react-native'
import styles from './Styles'
import {
  Text,
  Button,
  ScrollView,
  ShellButton,
  Loading,
  Header,
} from '../../components'
import { Images, Metrics } from '../../common'
import { TransactionStackScreenProps } from '../../navigation/types'
import { useGetReviewCriteriasQuery } from '../../store/slice/api/features/review'
import { ProductTransactionReviewCriteria } from '../../types'

const MAX_RATING = 5
const { STAR_OUTLINE, STAR_SOLID } = Images
const { ifIOS } = Metrics

const RateTransaction = ({
  navigation,
  route,
}: TransactionStackScreenProps<'RateTransaction'>) => {
  const { transaction, product, type } = route.params
  const [rating, setRating] = useState<{ [key: number]: number }>({})

  const { data: reviewCriterias = [], isLoading } =
    useGetReviewCriteriasQuery(type)

  const handleSetRating = ({ score, rateId }) => {
    const newRating = { ...rating }
    newRating[rateId] = score
    setRating(newRating)
  }

  const handleNext = () => {
    navigation.navigate('Feedback', {
      transaction,
      product,
      type,
      rating,
    })
  }

  const renderStarRater = (criteria: ProductTransactionReviewCriteria) => {
    const { id, type, name } = criteria
    const score = rating[id] || 0
    const stars = []
    for (let i = 0; i < MAX_RATING; i++) {
      stars.push(
        <ShellButton
          key={`${i}${id}`}
          hitSize={15}
          data={{ score: i + 1, rateId: id }}
          onPress={handleSetRating}
        >
          <Image
            source={i < score ? STAR_SOLID : STAR_OUTLINE}
            style={styles.star}
          />
        </ShellButton>
      )
    }
    return (
      <View key={id} style={styles.rater}>
        <Text style={styles.label}>{name}</Text>
        <View style={styles.rating}>
          <View style={styles.stars}>{stars}</View>
        </View>
      </View>
    )
  }

  const criteriaType = type
  const canNext = Object.keys(rating).length === reviewCriterias.length
  return (
    <View style={styles.container}>
      <Header
        showBack
        avoidMode
        title={`Transaction Completed`}
        style={styles.header}
      />
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Please rate the {criteriaType}</Text>
        <ScrollView hideScroller={false}>
          <Loading show={isLoading && !reviewCriterias.length}>
            <View style={styles.subWrapper}>
              {reviewCriterias.map(renderStarRater)}
            </View>
          </Loading>
        </ScrollView>
      </View>
      <View style={styles.actions}>
        <Text style={styles.footnote}>
          This rating will be shared publicly only after {criteriaType} has left
          rating for you.
        </Text>
        <Button disabled={!canNext} tight onPress={handleNext}>
          Next
        </Button>
      </View>
    </View>
  )
}

export default RateTransaction
