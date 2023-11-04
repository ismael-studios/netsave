import React, { useState } from 'react'
import { Image, View } from 'react-native'
import Text from '../Text'
import ShellButton from '../ShellButton'
import EmptyContent from '../EmptyContent'
import styles from './styles'
import Review from './Review'
import { Button, ScrollView } from '..'
import { Images } from '../../common'
import { useNavigation } from '@react-navigation/native'
import {
  ProductTransactionReviewCriteriaType,
  PublicUser,
  ReviewType,
} from '../../types'
import { useGetReviewsQuery } from '../../store/slice/api/features/review'
import { useAppSelector } from '../../store/hooks'

const { CATEGORY_DISPLAY } = Images

interface ReviewListProps {
  user: PublicUser
  showReviewOptions: (review: ReviewType) => void
}
const ReviewList = ({
  user,
  showReviewOptions,
}: ReviewListProps): JSX.Element => {
  const navigation = useNavigation()
  const { user: currentUser, signedIn } = useAppSelector(
    (state) => state.session
  )
  const [activeTab, setActiveTab] = useState<'seller' | 'buyer'>('seller')
  const { id: userId } = user

  const { data: reviewsAsSeller = [] } = useGetReviewsQuery({
    userId,
    type: ProductTransactionReviewCriteriaType.SELLER,
  })
  const { data: reviewsAsBuyer = [] } = useGetReviewsQuery({
    userId,
    type: ProductTransactionReviewCriteriaType.BUYER,
  })

  const handleTabPress = (activeTab: 'seller' | 'buyer') =>
    setActiveTab(activeTab)

  const handlePostItem = () => {
    navigation.navigate(signedIn ? 'Sell' : 'Login')
  }

  const handleBrowseProducts = () => {
    navigation.navigate(signedIn ? 'Home' : 'AuthScreen')
  }

  const tabseller = activeTab === 'seller'
  const tabbuyer = activeTab === 'buyer'
  const [sellerCount, buyerCount] = [
    reviewsAsSeller.length,
    reviewsAsBuyer.length,
  ]
  const totalReviews = sellerCount + buyerCount
  const activeReviews =
    activeTab === 'seller' ? reviewsAsSeller : reviewsAsBuyer
  const isMine = currentUser?.id === user.id

  return (
    <View key={'reviews'} style={styles.container}>
      {/* <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Reviews</Text>
        </View> */}
      <View style={styles.tabsContainer}>
        <ShellButton
          data={'seller'}
          style={[
            styles.tabButton,
            styles.tabLeft,
            tabseller && styles.selectedTab,
          ]}
          onPress={handleTabPress}
        >
          <Text
            style={[styles.tabText, tabseller && styles.selectedText]}
            center
          >
            As Seller ({sellerCount})
          </Text>
        </ShellButton>
        <ShellButton
          data={'buyer'}
          style={[styles.tabButton, tabbuyer && styles.selectedTab]}
          onPress={handleTabPress}
        >
          <Text
            style={[styles.tabText, tabbuyer && styles.selectedText]}
            center
          >
            As Buyer ({buyerCount})
          </Text>
        </ShellButton>
      </View>
      <ScrollView>
        {activeReviews.map((review) => (
          <Review
            key={review.id}
            review={review}
            showOptions={showReviewOptions}
            showActions={
              review.type === 'seller'
                ? currentUser?.id === review.sellerUserId
                : review.type === 'buyer'
                ? currentUser?.id === review.buyerUserId
                : false
            }
          />
        ))}
        {activeReviews.length === 0 &&
          (isMine ? (
            <View style={styles.newPost}>
              <Image source={CATEGORY_DISPLAY} style={styles.categoryDisplay} />
              <Text fontSize="standard" paragraph2x center>
                You currently don't have any reviews as a {activeTab}.
              </Text>
              {activeTab === 'seller' ? (
                <Button
                  style={styles.newPostButton}
                  color="orange"
                  block
                  onPress={handlePostItem}
                >
                  Post an Item & Earn 1000 Points!
                </Button>
              ) : (
                <Button
                  style={styles.newPostButton}
                  block
                  onPress={handleBrowseProducts}
                >
                  Browse Products
                </Button>
              )}
            </View>
          ) : (
            <EmptyContent
              style={styles.empty}
              minHeight={50}
              show={activeReviews.length === 0}
              message={`${user.username} hasn't received any reviews as a ${activeTab}`}
            />
          ))}
      </ScrollView>
    </View>
  )
}

export default ReviewList
