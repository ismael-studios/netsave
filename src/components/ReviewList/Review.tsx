import React from 'react'
import { View, Image } from 'react-native'
import Text from '../Text'
import ShellButton from '../ShellButton'
import RatingStars from '../RatingStars'
import OptionsButton from '../MiscButtons/OptionsButton'
import { Images } from '../../common'
import styles from './styles'
import moment from 'moment'
import { parsePrice } from '../../helpers/PriceHelper'
import { useNavigation } from '@react-navigation/native'
import { ProductType, ReviewType, UserType } from '../../types'

const { ELLIPSIS, IMAGE_PLACEHOLDER, USER_PROFILE_CIRCLE } = Images

interface ReviewProps {
  review: ReviewType
  showActions: boolean
  showOptions: (review: ReviewType) => void
}
const Review = ({
  review,
  showActions,
  showOptions,
}: ReviewProps): JSX.Element => {
  const navigation = useNavigation()
  const handleProfile = (user: UserType) => {
    navigation.navigate('UserProfile', {
      userId: user.id,
    })
  }

  const handleProduct = (product: ProductType) => {
    navigation.navigate('ProductDetails', {
      product,
      productId: product.id,
      userId: product.userId,
    })
  }

  const {
    rating,
    product,
    product: { price, title, previewImageUrl },
    description,
    createdAt,
    reviewUser,
    reviewUser: { profileImageUrl, username },
  } = review
  const profileImage = profileImageUrl
    ? { uri: profileImageUrl }
    : USER_PROFILE_CIRCLE
  const productImage = previewImageUrl
    ? { uri: previewImageUrl }
    : IMAGE_PLACEHOLDER
  const dollarPrice = parsePrice(price)
  return (
    <View style={styles.review}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <ShellButton
          data={reviewUser}
          onPress={handleProfile}
          style={styles.reviewerMedia}
        >
          <Image source={profileImage} style={styles.reviewerPic} />
          <Text style={styles.reviewerFrom}>From @{username}</Text>
        </ShellButton>
        {showActions && (
          <OptionsButton
            data={review}
            size={30}
            image={ELLIPSIS}
            style={styles.optionsButton}
            iconStyle={styles.optionsIcon}
            onPress={showOptions}
          />
        )}
      </View>

      <View style={styles.reviewDetails}>
        {/* <ShellButton data={reviewUser} onPress={this.handleProfile}>
            <Text style={styles.reviewerFrom}>From @{username}</Text>
          </ShellButton> */}
        <View style={styles.reviewMeta}>
          <View style={styles.reviewTime}>
            {/*<Text style={styles.rating}>4.5</Text>*/}
            <RatingStars score={rating} size={15} style={styles.reviewStars} />
            <Text style={styles.timeText}>{moment(createdAt).fromNow()}</Text>
          </View>
        </View>
        <ShellButton
          data={product}
          style={styles.product}
          onPress={handleProduct}
        >
          <Image source={productImage} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {title}
            </Text>
            <Text style={styles.productPrice}>{dollarPrice}</Text>
          </View>
        </ShellButton>
        <Text style={styles.reviewText}>{description}</Text>
      </View>
    </View>
  )
}

export default Review
