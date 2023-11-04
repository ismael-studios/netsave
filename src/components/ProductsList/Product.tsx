import React, { Component } from 'react'
import { View, Image } from 'react-native'
import Text from '../Text'
import ShellButton from '../ShellButton'
import CachedImage from '../CachedImage'
import styles from './styles'
import FastImage from 'react-native-fast-image'
import { parsePrice } from '../../helpers/PriceHelper'
import { Images } from '../../common'

const { IMAGE_PLACEHOLDER, USER_PROFILE_CIRCLE } = Images

export default class Product extends Component {
  handleOnPress = (product) => {
    const { onPress } = this.props
    onPress && onPress(product)
  }

  render() {
    const {
      product = {},
      product: {
        distance,
        isSold,
        isPublished,
        title,
        discount,
        description,
        price,
        retailPrice,
        previewImageUrl,
        user,
      },
    } = this.props
    const { profileImageUrl, city, region } = user || {}
    const productTitle = title || 'No Title'
    const productDescription = description || 'No Product Description.'
    const tooLong = productDescription.length > 50
    const productPrice = parsePrice(price)
    const storePrice = parsePrice(retailPrice)

    const discountPercent = retailPrice
      ? retailPrice - price > 0
        ? Math.floor(((retailPrice - price) / retailPrice) * 100)
        : 0
      : 0
    const userProfileImage = profileImageUrl
      ? { uri: profileImageUrl }
      : USER_PROFILE_CIRCLE
    return (
      <ShellButton
        data={product}
        style={styles.product}
        onPress={this.handleOnPress}
      >
        {!isSold && discountPercent ? (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discountPercent}% Off</Text>
          </View>
        ) : null}
        {isSold ? (
          <View style={styles.soldBadge}>
            <Text style={styles.soldText}>SOLD</Text>
          </View>
        ) : null}
        <View style={styles.imageContainer}>
          {previewImageUrl ? (
            <Image
              source={{ uri: previewImageUrl }}
              style={styles.productImage}
            />
          ) : (
            <FastImage
              source={IMAGE_PLACEHOLDER}
              style={styles.productImage}
              resizeMode="contain"
            />
          )}
        </View>
        <View style={styles.productBase}>
          <View style={styles.summaryContainer}>
            <Text style={styles.productTitle} numberOfLines={1}>
              {productTitle}
              {!isPublished ? (
                <Text color="red" fontSize="tiny">
                  {'  (UNPUBLISHED)'}
                </Text>
              ) : (
                ''
              )}
            </Text>
          </View>
          <View style={styles.productMeta}>
            <Image source={userProfileImage} style={styles.profileImage} />
            {city ? (
              <View style={styles.location}>
                <Text
                  style={[styles.locationText, styles.flexLocation]}
                  numberOfLines={1}
                >
                  {city}
                </Text>
                {city ? <Text style={styles.locationText}>, </Text> : null}
                {distance ? (
                  <Text style={styles.locationText}>{distance}</Text>
                ) : null}
              </View>
            ) : null}
          </View>
          <View style={[styles.productMeta, styles.spaced]}>
            <Text style={styles.price}>{productPrice}</Text>
            {discountPercent && retailPrice < 100000 ? (
              <View style={styles.retail}>
                <View style={styles.strikethrough} />
                <Text style={styles.storePrice} numberOfLines={1}>
                  {storePrice}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </ShellButton>
    )
  }
}
