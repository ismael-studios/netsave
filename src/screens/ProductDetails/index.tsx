import React, { useEffect, useRef, useState } from 'react'
import { Image, View, Modal, ActivityIndicator } from 'react-native'
import {
  Text,
  Header,
  Button,
  Loading,
  ShowAlert,
  BackButton,
  ScrollView,
  CloseButton,
  ShellButton,
  RatingStars,
  CachedImage,
  FloatingMenu,
  OptionsButton,
} from '../../components'
import styles from './styles'
import { ApiConstants } from '../../services'
import { Images } from '../../common'
import MapView, { Circle, PROVIDER_GOOGLE } from 'react-native-maps'
import moment from 'moment'
import { path, clone } from 'ramda'
import { GOOGLE_MAPS_API_KEY } from '../../constants/constants'
import Share from 'react-native-share'
import SwiperFlatList from 'react-native-swiper-flatlist'
import FastImage from 'react-native-fast-image'
import { MessageBuyer, MessageSeller } from '../../helpers/ChatHelper'
import { Colors } from '../../common'
import ImageViewer from 'react-native-image-zoom-viewer'
import { parsePrice } from '../../helpers/PriceHelper'
import { trim } from 'ramda'
import Collapsible from 'react-native-collapsible'
import R from 'ramda'
import { WEB_URL } from '../../services/ApiConstants'
import short from 'short-uuid'
import { useAppSelector } from '../../store/hooks'
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
} from '../../store/slice/api/features/product'
import { SwiperFlatListRefProps } from 'react-native-swiper-flatlist/src/components/SwiperFlatList/SwiperFlatListProps'
import { MainStackScreenProps } from '../../navigation/types'
import { Offer, ProductTransactionReviewCriteriaType } from '../../types'
import OffersModule from '../../components/OffersModule'
import { useGetOffersQuery } from '../../store/slice/api/features/offer'
import { OffersModuleConfig } from '../../components/OffersModule/OffersModule'
import {
  useGetProductLikesQuery,
  useLikeProductMutation,
  useUnlikeProductMutation,
} from '../../store/slice/api/features/user'
import { useGetReviewsQuery } from '../../store/slice/api/features/review'

const average = R.converge(R.divide, [R.sum, R.length])

const {
  SECURE,
  PACKAGE,
  MEETUP,
  USER_PROFILE_CIRCLE,
  GREEN_BADGE,
  ELLIPSIS,
  HEART,
  HEARTED,
  PENCIL_O,
  CHECK_CIRCLE,
  CLOSE_CRICLE,
  MESSAGING,
  SHARE,
  IMAGE_PLACEHOLDER,
  EXCLAMATION,
} = Images
const { OFFER_PENDING_STATUS, OFFER_ACCEPTED_STATUS } = ApiConstants

// TODO: Refactor component into smaller components
const ProductDetails = ({
  navigation,
  route,
}: MainStackScreenProps<'ProductDetails'>) => {
  const {
    productId: routeProductId,
    userId: routeUserId,
    product,
    isEditing,
    previewMode,
  } = route.params
  const {
    user: currentUser,
    signedIn,
    sub,
  } = useAppSelector((state) => state.session)
  const { loading } = useAppSelector((state) => state.app)

  const [fetching, setFetching] = useState(false)
  const [productLocation, setProductLocation] = useState(null)
  const [showOptions, setShowOptions] = useState(false)
  const [lightBoxIndex, setLightBoxIndex] = useState(-1)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hideMap, setHideMap] = useState(true)
  const [offerConfig, setOfferConfig] = useState<OffersModuleConfig>()

  const { data: offers = [], isLoading: isLoadingOffers } =
    useGetOffersQuery(sub)

  const handleReport = () => {
    if (!signedIn) {
      return goToAuth()
    }
    ShowAlert({
      title: 'Report Seller',
      message: 'Are you sure you want to \nreport this product?',
      actions: [
        {
          name: 'Report Seller',
          positive: true,
        },
        {
          name: 'Cancel',
        },
      ],
    })
  }
  const [menuActions, setMenuActions] = useState([
    { name: 'Report', icon: EXCLAMATION, callback: handleReport },
  ])
  const [showMap, setShowMap] = useState(false)
  const [showOffers, setShowOffers] = useState(false)

  const { data: productData, isLoading: isLoadingProduct } =
    useGetProductDetailsQuery({
      userId: routeUserId,
      productId: routeProductId,
    })

  const { data: likes = [], isLoading: isLoadingLikes } =
    useGetProductLikesQuery({
      userId: sub,
    })

  const { data: sellerReviews = [] } = useGetReviewsQuery({
    userId: routeUserId,
    type: ProductTransactionReviewCriteriaType.SELLER,
  })
  const { data: buyerReviews = [] } = useGetReviewsQuery({
    userId: routeUserId,
    type: ProductTransactionReviewCriteriaType.BUYER,
  })

  const [updateProduct, { isLoading: isLoadingUpdateProduct }] =
    useUpdateProductMutation()

  const [likeProduct, { isLoading: isLoadingLikeProduct }] =
    useLikeProductMutation()

  const [unlikeProduct, { isLoading: isLoadingUnlikeProduct }] =
    useUnlikeProductMutation()
  const circle = useRef<Circle>(null)
  const swiper = useRef<SwiperFlatListRefProps>(null)

  const likeLoading = isLoadingLikeProduct || isLoadingUnlikeProduct

  useEffect(() => {
    if (productData) {
      navigation.setParams({ product: productData })
    }
  }, [productData, navigation])

  useEffect(() => {
    if (currentUser?.id !== routeUserId) {
      setMenuActions([
        {
          name: 'Contact Seller',
          icon: MESSAGING,
          callback: handleContactSeller,
        },
        ...menuActions,
      ])
    }
  }, [])

  useEffect(() => {
    if (!fetching) {
      const parseLocation = () => {
        if (product) {
          const { user } = product
          const { city, region, postalCode } = user || {}

          let location = ''
          if (city) location += `${city}, `
          if (region) location += `${region} `
          if (postalCode) location += `${postalCode}`
          // TODO: write a strong logic for a fallback location
          // fetch location
          if (location && !fetching && !productLocation) {
            setFetching(true)
            const geocode = 'https://maps.google.com/maps/api/geocode/json'
            fetch(
              `${geocode}?key=${GOOGLE_MAPS_API_KEY}&address=${encodeURI(
                location
              )}`
            )
              .then((res) => res.json())
              .then((data) => {
                const location = path(
                  ['results', '0', 'geometry', 'location'],
                  data
                )
                setFetching(true)
                setProductLocation(location)
              })
          }
        }
      }

      parseLocation()
    }
    setTimeout(() => {
      circle.current?.setNativeProps({ fillColor: `${Colors.green}40` })
    }, 100)
  }, [fetching, product, productLocation])

  const handleToggleMap = () => {
    setHideMap(!hideMap)
    setTimeout(() => {
      setShowMap(hideMap)
    })
  }

  const handleIndexChange = ({ index }: { index: number }) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (product) {
      const { images = [] } = product
      const hasImages = images.length >= currentIndex
      if (hasImages) {
        swiper.current?.scrollToIndex({ index: currentIndex })
      }
    }
  }, [currentIndex, product])

  const handleChangeIndex = (index: number) => {
    setCurrentIndex(index)
  }

  const handleLikeUnlike = () => {
    if (!signedIn) {
      return goToAuth()
    }
    if (product) {
      const { id: productId, userId } = product
      if (liked) {
        unlikeProduct({ userId, productId })
      } else {
        likeProduct({ userId, productId })
      }
    }
  }

  const handleShareProduct = () => {
    if (!product) {
      return
    }
    const { price, title, id } = product
    const PrintPrice = parsePrice(price)
    const translator = short()

    Share.open({
      title: 'Tell Friends',
      subject: title || '',
      message: `Check out this Netsave product, ${title} ${PrintPrice} ${WEB_URL}/p/${translator.fromUUID(
        id
      )}`,
      failOnCancel: false,
    })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        err && console.log(err)
        ShowAlert({ message: 'There was an error while sharing.' })
      })
  }

  const handleEditProduct = () => {
    if (!product) {
      return
    }
    const {
      id,
      categoryId,
      category: { name: longName },
      title,
      description,
      productConditionId,
      price,
      isNegotiable,
      images,
    } = product
    navigation.navigate('PostListing', {
      screen: 'AddProduct',
      params: {
        isEditMode: true,
        categoryId,
        productId: id,
      },
    })
  }

  const handleTogglePublish = () => {
    if (!product) {
      return
    }
    const {
      id,
      images,
      isPublished,
      price,
      title,
      productConditionId,
      description,
    } = product
    const productToUpdate = {
      id,
      isPublished: !isPublished,
    }
    const hasPhotos = (images || []).length > 0
    const canPublish =
      Boolean(parsePrice(price, true)) &&
      title &&
      trim(title) &&
      description &&
      trim(description) &&
      productConditionId &&
      hasPhotos
    const shouldPublish = (!isPublished && canPublish) || isPublished

    if (shouldPublish) {
      updateProduct({
        userId: currentUser?.id,
        product: productToUpdate,
      })
    } else {
      // not fit to publish
      ShowAlert({
        message:
          'Before publishing a product, ensure your product has at least one image, title, reasonable description and a price. Please edit your product to continue.',
      })
    }
  }

  const handleBuyNow = () => {
    if (!signedIn) {
      return goToAuth()
    }
    if (!product) {
      return
    }
    setOfferConfig({
      action: 'create',
      price: product.price,
      productId: product.id,
      userId: product.userId,
      isNegotiable: product.isNegotiable || false,
    })
  }

  const handleContactSeller = (offer: Offer) => {
    if (!signedIn) {
      return goToAuth()
    }
    if (!product || !currentUser) {
      return
    }
    const isMyProduct = product.userId === currentUser.id
    if (isMyProduct) {
      const { fromUserId, toUserId } = offer || {}
      const buyerUserId = fromUserId !== currentUser.id ? fromUserId : toUserId
      MessageBuyer(currentUser, { ...product, buyerUserId })
    } else {
      MessageSeller(currentUser, product)
    }
  }

  const handleGoToUserProfile = () => {
    if (!product) {
      return
    }
    navigation.push('UserProfile', { userId: product.user.id })
  }

  const handleViewOffer = (offer: Offer) => {
    navigation.navigate('MyOffers', {
      offer,
    })
  }

  const handleShowLightbox = (index: number) => {
    setLightBoxIndex(index)
  }

  const handleHideLightbox = () => {
    setLightBoxIndex(-1)
  }

  const handlePublish = async () => {
    if (!product || !currentUser) {
      return
    }
    const { id, price, retailPrice, isNegotiable } = product
    try {
      const updatedProduct = await updateProduct({
        userId: currentUser.id,
        product: {
          id,
          price: parsePrice(price, true),
          retailPrice: parsePrice(retailPrice, true),
          isNegotiable,
          isPublished: true,
          images: [],
        },
      }).unwrap()

      if (isEditing) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'PreviewProductDetails',
              params: {
                product: updatedProduct,
                productId: updatedProduct.id,
                userId: updatedProduct.userId,
              },
            },
          ],
        })
      } else {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'AddProductSuccess',
              params: {
                product: updatedProduct,
                productId: updatedProduct.id,
                userId: updatedProduct.userId,
              },
            },
          ],
        })
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const handleToggleShowOffers = () => {
    setShowOffers(!showOffers)
  }

  const handleAcceptOffer = (offer: Offer) => {
    if (!product) {
      return
    }
    setOfferConfig({
      action: 'accept',
      offerId: offer.id,
      price: offer.price || product.price,
      productId: product.id,
      userId: product.userId,
    })
  }

  // methods
  const goToAuth = () => {
    navigation.navigate('Login', {
      IntentScreen: 'ProductDetails',
      IntentData: { Product: product },
    })
  }

  const toggleOptions = () => {
    setShowOptions(!showOptions)
  }

  const goBack = () => {
    navigation.goBack()
  }

  const getProductOffer = (offer: Offer) => {
    const { id } = product || {}
    const isOffer = offer.productId == id
    return isOffer
  }

  const isLiked = () => {
    return likes.some((row) => row.productId === routeProductId)
  }

  const renderProductImage = ({ url }, i) => {
    return (
      <ShellButton key={i} data={i} untouchable onPress={handleShowLightbox}>
        <View style={styles.productImageContainer}>
          <CachedImage
            source={{ uri: url }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>
      </ShellButton>
    )
  }

  const renderOfferSection = () => {
    if (!product) {
      return
    }
    const { isNegotiable, userId } = product
    const hasOffers = [...offers]
      .sort((a, b) => {
        return a.createdAt < b.createdAt ? 1 : -1
      })
      .filter(getProductOffer)

    const hasOffer = hasOffers[0]
    const isMyProduct = userId === currentUser?.id
    if (!isMyProduct) {
      const offerPending = hasOffer && hasOffer.statusId == OFFER_PENDING_STATUS
      const offerAccepted =
        hasOffer && hasOffer.statusId == OFFER_ACCEPTED_STATUS
      // no my product
      return offerAccepted || offerPending ? (
        <View style={styles.currentOfferContainer}>
          <View style={styles.currentOffer}>
            <Text style={styles.currentOfferText}>{`${
              offerAccepted ? 'Accepted' : 'Current'
            } Offer: `}</Text>
            <Text style={styles.offerPrice}>{parsePrice(hasOffer.price)}</Text>
          </View>
          <View style={styles.offerButtons}>
            <Button
              tight
              data={hasOffer}
              style={styles.offerButton}
              onPress={handleViewOffer}
            >
              {'View Offer'}
            </Button>
            <Button
              tight
              outlined
              data={hasOffer}
              style={styles.offerButton}
              onPress={handleContactSeller}
            >
              View Message
            </Button>
          </View>
        </View>
      ) : (
        <View style={styles.offerContainer}>
          <Button tight style={styles.offerButton} onPress={handleBuyNow}>
            {isNegotiable ? 'Make Offer' : 'Buy Now'}
          </Button>
          <Button
            tight
            outlined
            data={hasOffer}
            style={styles.offerButton}
            onPress={handleContactSeller}
          >
            Contact Seller
          </Button>
        </View>
      )
    } else {
      // my product
      const pendingOffers = hasOffers.filter(
        (offer) => offer.statusId === OFFER_PENDING_STATUS
      )
      const hasMultiple = pendingOffers.length
      const signularOffer = pendingOffers[0] || hasOffers[0]
      const offerAccepted =
        signularOffer && signularOffer.statusId == OFFER_ACCEPTED_STATUS

      return hasMultiple > 1 ? (
        <View style={styles.currentOfferContainer}>
          <View style={styles.currentOffer}>
            <Text style={styles.multiOfferText}>
              You have {hasMultiple} pending offers
            </Text>
          </View>
          <View style={styles.offerButtons}>
            <Button
              tight
              block
              style={styles.offerButton}
              onPress={handleToggleShowOffers}
            >
              View Offers
            </Button>
          </View>
        </View>
      ) : hasMultiple ? (
        <View style={styles.currentOfferContainer}>
          <View style={styles.currentOffer}>
            <Text style={styles.currentOfferText}>{`${
              offerAccepted ? 'Accepted' : 'Current'
            } Offer: `}</Text>
            <Text style={styles.offerPrice}>
              {parsePrice(signularOffer.price)}
            </Text>
          </View>
          <View style={styles.offerButtons}>
            <Button
              tight
              data={signularOffer}
              style={styles.offerButton}
              onPress={handleViewOffer}
            >
              {'View Offer'}
            </Button>
            <Button
              tight
              outlined
              data={signularOffer}
              style={styles.offerButton}
              onPress={handleContactSeller}
            >
              View Message
            </Button>
          </View>
        </View>
      ) : null
    }
  }

  const renderPreviewSection = () => {
    return (
      <View style={styles.actionsRow}>
        <Button
          tight
          outlined
          loading={loading}
          style={styles.editButton}
          onPress={goBack}
        >
          Edit
        </Button>
        <Button
          tight
          loading={loading}
          style={styles.postButton}
          onPress={handlePublish}
        >
          {isEditing ? 'Update' : 'Post'}
        </Button>
      </View>
    )
  }

  const renderLikeButton = () => {
    const { userId } = product
    const isMine = userId == currentUser?.id
    return isMine ? null : likeLoading ? (
      <OptionsButton shadowed style={styles.bookmarkButton}>
        <ActivityIndicator color={Colors.green} />
      </OptionsButton>
    ) : (
      <OptionsButton
        shadowed
        image={liked ? HEARTED : HEART}
        style={styles.bookmarkButton}
        onPress={handleLikeUnlike}
      />
    )
  }

  const renderLightBox = () => {
    const { previewImageUrl, images } = product
    const productImage = previewImageUrl || 'https://via.placeholder.com/150'
    const productImages = (images && images[0] && clone(images)) || [
      { url: productImage },
    ]

    return (
      <Modal visible={true} transparent={true}>
        <ImageViewer
          index={lightBoxIndex}
          enableSwipeDown
          swipeDownThreshold={50}
          onSwipeDown={handleHideLightbox}
          imageUrls={productImages}
        />
        <CloseButton
          float
          floatRight
          color="white"
          hitSize={15}
          style={styles.lightboxClose}
          onPress={handleHideLightbox}
        />
      </Modal>
    )
  }

  const renderSwipeIndicators = (amount = 0) => {
    const indicators = []
    let index = 0

    while (index < amount) {
      const isActive = index === currentIndex
      indicators.push(
        <ShellButton
          key={index}
          data={index}
          hitSize={2}
          currentIndex={currentIndex}
          onPress={handleChangeIndex}
        >
          <View style={[styles.swipeDot, isActive && styles.activeDot]} />
        </ShellButton>
      )
      index++
    }
    return indicators
  }

  const renderPendingOffers = () => {
    const { id } = product

    const hasOffers = [...offers]
      .sort((a, b) => {
        return a.createdAt < b.createdAt ? 1 : -1
      })
      .filter(getProductOffer)

    const printOffers = hasOffers.map((offer, i) => {
      const isOffer =
        offer.product.id == id && offer.statusId == OFFER_PENDING_STATUS
      const { fromUser, toUser, fromUserId, createdAt } = offer
      const inActionable = fromUserId === currentUser?.id
      const buyerUser = inActionable ? toUser : fromUser
      const { username } = buyerUser
      return isOffer ? (
        <View key={i} style={styles.offer}>
          <ShellButton style={styles.offerUser}>
            <Image
              style={styles.offerUserImage}
              source={
                !buyerUser.profileImageUrl
                  ? USER_PROFILE_CIRCLE
                  : { uri: buyerUser.profileImageUrl }
              }
            />
            <Text style={styles.offerUsername}>@{username}</Text>
          </ShellButton>
          <View style={styles.offerPriceContainer}>
            <Text style={styles.offerPrice}>{parsePrice(offer.price)}</Text>
            <Text style={styles.offerTime}>
              Offered {moment(createdAt).fromNow()}
            </Text>
          </View>
          <View style={styles.offerActions}>
            {!inActionable && (
              <Button
                tight
                data={offer}
                style={[styles.offerAction, styles.acceptButton]}
                onPress={handleAcceptOffer}
              >
                Accept Offer
              </Button>
            )}
            <Button
              tight
              outlined
              data={offer}
              style={styles.offerAction}
              onPress={handleContactSeller}
            >
              View Message
            </Button>
          </View>
        </View>
      ) : null
    })
    return printOffers
  }

  if (!product) {
    return null
  }

  const {
    user,
    price,
    title,
    isSold,
    images,
    userId,
    distance,
    updatedAt,
    createdAt,
    retailPrice,
    description,
    isPublished,
    previewImageUrl,
    productCondition,
    isShipping,
    isLocal,
    isLocalOnline,
    // isLocalCash
  } = product
  const {
    city,
    rating = 4,
    maxRating = 5,
    region,
    username,
    profileImageUrl,
  } = user || {}
  const { name: condition, color: conditionColor } = productCondition || {}
  const conditionState = condition || 'New'
  const productImage = previewImageUrl || 'https://via.placeholder.com/150'
  const productImages = images || [{ url: productImage }]
  const moreThanOneImage = productImages.length > 1
  const productTitle = title || 'No Title'
  const productDescription = description || 'No Product Description.'
  const productPrice = parsePrice(price)
  const storePrice = parsePrice(retailPrice, true) && parsePrice(retailPrice)
  const lastUpdated = moment(updatedAt || createdAt).fromNow()
  const { lat = 0, lng = 0 } = productLocation || {}
  const { latitude = lat, longitude = lng } = {}
  const isMine = currentUser?.id === userId
  const delta = 0.015
  const mapRegion = {
    latitudeDelta: delta,
    longitudeDelta: delta,
    longitude,
    latitude,
  }
  const markerCoordination = { longitude, latitude }
  const userImage = profileImageUrl
  const liked = isLiked()
  let location = ''
  if (city) location += `${city}`
  const shareMenu = isPublished
    ? [
        {
          name: 'Share via...',
          icon: SHARE,
          callback: handleShareProduct,
        },
      ]
    : []

  const averageRating =
    rating ||
    average([
      ...sellerReviews.map(({ rating }) => rating),
      ...buyerReviews.map(({ rating }) => rating),
    ])

  return (
    <View style={styles.wrapper}>
      {previewMode && (
        <Header
          tight
          bordered
          showBack
          title="Listing Preview"
          style={styles.header}
        />
      )}
      <Loading show={isLoadingProduct && !previewImageUrl} minHeight={200}>
        <ScrollView bounces={false} style={styles.scroller}>
          <View style={styles.container}>
            <View style={styles.productMedia}>
              <View style={styles.floatingToolbar}>
                {!previewMode && (
                  <BackButton
                    shadowed
                    style={styles.backButton}
                    onPress={goBack}
                  />
                )}
                {renderLikeButton()}
                {isPublished && !previewMode && (
                  <OptionsButton
                    shadowed
                    image={SHARE}
                    style={styles.shareButton}
                    onPress={handleShareProduct}
                  />
                )}
              </View>
              {productImages.length ? (
                <SwiperFlatList
                  key={'swiper'}
                  ref={swiper}
                  autoplay={moreThanOneImage}
                  autoplayLoop={moreThanOneImage}
                  // TODO INSPECT SWIPER INDEX FOR MULTI IMAGES VS ONE IMAGE
                  // showPagination={moreThanOneImage}
                  autoplayDelay={5}
                  paginationStyle={styles.dots}
                  paginationStyleItem={styles.dot}
                  style={styles.productMediaSwiper}
                  onChangeIndex={handleIndexChange}
                >
                  {productImages.map(renderProductImage)}
                </SwiperFlatList>
              ) : (
                <View style={styles.productImageContainer}>
                  <Image
                    source={IMAGE_PLACEHOLDER}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                </View>
              )}
              {moreThanOneImage && (
                <View key={'indicators'} style={styles.swipeIndicators}>
                  {renderSwipeIndicators(productImages.length)}
                </View>
              )}
            </View>
            <View style={styles.titleContainer}>
              <View style={styles.titleSection}>
                <Text style={styles.titleText}>
                  {productTitle}
                  {!isPublished && !previewMode ? (
                    <Text color="red" fontSize="tiny">
                      {'  (UNPUBLISHED)'}
                    </Text>
                  ) : (
                    ''
                  )}{' '}
                </Text>
              </View>
              {!previewMode && (
                <OptionsButton
                  shadowed
                  image={ELLIPSIS}
                  iconStyle={styles.optionsIcon}
                  onPress={toggleOptions}
                />
              )}
            </View>
            <View style={styles.priceContainer}>
              <View style={styles.priceSection}>
                <Text style={styles.priceText}>{productPrice}</Text>
                {isSold && (
                  <View style={styles.soldContainer}>
                    <Text style={styles.soldText}>{'SOLD'}</Text>
                  </View>
                )}
              </View>
              <View
                style={[
                  styles.productCondition,
                  conditionColor && {
                    backgroundColor: `${conditionColor}40`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.conditionText,
                    conditionColor && { color: `${conditionColor}` },
                  ]}
                >
                  {conditionState}
                </Text>
              </View>
            </View>
            <View style={styles.postInfo}>
              {storePrice ? (
                <View style={styles.retailInfo}>
                  <Text style={styles.retailText}>Retail Value:</Text>
                  <View style={styles.retail}>
                    <View style={styles.strikethrough} />
                    <Text style={styles.storePrice} numberOfLines={1}>
                      {storePrice}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
            <View style={styles.postInfo}>
              <Text style={styles.postedTime} paragraph>
                Last Updated {lastUpdated}
              </Text>
            </View>
            <View style={styles.attributes}>
              {isLocalOnline && (
                <View style={styles.attribute}>
                  <Image source={SECURE} style={styles.attributeIcon} />
                  <Text style={styles.attributeText}>
                    Secure online payment
                  </Text>
                </View>
              )}
              {isShipping && (
                <View style={styles.attribute}>
                  <Image source={PACKAGE} style={styles.attributeIcon} />
                  <Text style={styles.attributeText}>
                    Product can be shipped
                  </Text>
                </View>
              )}
              {isLocal && (
                <View style={styles.attribute}>
                  <Image source={MEETUP} style={styles.attributeIcon} />
                  <Text style={styles.attributeText}>
                    Local meetup available
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.summaryContainer}>
              <View style={styles.summaryColumn}>
                <Text style={styles.summaryText}>{productDescription}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        {username && !previewMode ? (
          <View style={styles.authorContainer}>
            <ShellButton
              style={styles.authorMedia}
              onPress={handleGoToUserProfile}
            >
              {userImage ? (
                <CachedImage
                  style={styles.authorPic}
                  source={{ uri: userImage }}
                />
              ) : (
                <FastImage
                  style={styles.authorPic}
                  source={USER_PROFILE_CIRCLE}
                />
              )}
              <Image style={styles.authBadge} source={GREEN_BADGE} />
            </ShellButton>
            <View style={styles.authorInfo}>
              <ShellButton
                style={styles.authorName}
                onPress={handleGoToUserProfile}
              >
                <Text style={styles.authorAlias}>@{username}</Text>
                <RatingStars score={averageRating} base={maxRating} />
              </ShellButton>
              <View style={styles.metaInfo}>
                <ShellButton style={styles.mapButton} onPress={handleToggleMap}>
                  <Text style={styles.mapButtonText}>
                    {hideMap ? 'Show' : 'Hide'} Map
                  </Text>
                  {location ? (
                    <Text
                      style={styles.locationText}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {location}
                      {distance ? ` - ${distance}` : ''}
                    </Text>
                  ) : null}
                </ShellButton>
              </View>
            </View>
          </View>
        ) : null}
        <Collapsible collapsed={hideMap}>
          <View style={styles.mapContainer}>
            {showMap ? (
              <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                region={mapRegion}
              >
                <Circle
                  ref={circle}
                  key="circle"
                  title={'Product Location'}
                  description={`Available for Pickup at ${city || region}`}
                  center={markerCoordination}
                  radius={650}
                  // strokeWidth={20}
                  strokeColor={`${Colors.green}10`}
                  fillColor={`${Colors.green}40`}
                />
              </MapView>
            ) : (
              <ActivityIndicator color={Colors.green} />
            )}
          </View>
        </Collapsible>
        {signedIn && !previewMode && !isSold && renderOfferSection()}
        {previewMode && renderPreviewSection()}
        {lightBoxIndex >= 0 && renderLightBox()}
        {showOffers && (
          <FloatingMenu title="Offers" closeCallBack={handleToggleShowOffers}>
            <ScrollView>
              <View style={styles.offersContainer}>
                {renderPendingOffers()}
              </View>
            </ScrollView>
          </FloatingMenu>
        )}
        {showOptions && (
          <FloatingMenu
            title="Options"
            menu={
              !isMine
                ? [
                    {
                      name: likeLoading
                        ? liked
                          ? 'Unliking...'
                          : 'Liking...'
                        : liked
                        ? 'Unlike'
                        : 'Like',
                      icon: liked ? HEARTED : HEART,
                      loading: likeLoading,
                      callback: likeLoading ? null : handleLikeUnlike,
                    },
                    ...shareMenu,
                    ...menuActions,
                  ]
                : isSold
                ? [...shareMenu]
                : [
                    {
                      name: 'Edit Product',
                      icon: PENCIL_O,
                      callback: handleEditProduct,
                    },
                    {
                      name: `${isPublished ? 'Unpublish' : 'Publish'}${
                        isLoadingUpdateProduct ? '...' : ' Product'
                      }`,
                      icon: isPublished ? CLOSE_CRICLE : CHECK_CIRCLE,
                      loading: isLoadingUpdateProduct,
                      callback: handleTogglePublish,
                    },
                    ...shareMenu,
                  ]
            }
            closeCallBack={toggleOptions}
            style={styles.floatingMenu}
          />
        )}
        {offerConfig && <OffersModule config={offerConfig} />}
      </Loading>
    </View>
  )
}

export default ProductDetails
