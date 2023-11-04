import React, { Component, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SessionActions from '../../../store/redux/SessionRedux'
import OffersActions from '../../../store/redux/OffersRedux'
import { View, Linking, Image } from 'react-native'
import {
  Text,
  ShowAlert,
  FloatingMenu,
  Button,
  ShellButton,
  CachedImage,
  ErrorBoundary,
  Header,
  Loading,
  EmptyContent,
  ScrollView,
} from '../../../components'
import { ApiConstants } from '../../../services'
import FastImage from 'react-native-fast-image'
import { Images } from '../../../common'
import styles from './styles'
import OffersData from './OffersData'
import SwiperFlatList from 'react-native-swiper-flatlist'
import Collapsible from 'react-native-collapsible'
import moment from 'moment'
import { MessageBuyer, MessageSeller } from '../../../helpers/ChatHelper'
import { parsePrice } from '../../../helpers/PriceHelper'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { MainStackScreenProps } from '../../../navigation/types'
import { Offer, ProductType, UserType } from '../../../types'
import { useGetOffersQuery } from '../../../store/slice/api/features/offer'
import OffersModule from '../../../components/OffersModule'
import { OffersModuleConfig } from '../../../components/OffersModule/OffersModule'
import { resetOffers } from '../../../store/slice/offersSlice'

const { SLIDERS, ELLIPSIS, EXCLAMATION, MESSAGING } = Images
const {
  OFFER_PENDING_STATUS,
  OFFER_ACCEPTED_STATUS,
  OFFER_DECLINED_STATUS,
  OFFER_CANCELED_STATUS,
} = ApiConstants
const STATUS_CODE = {
  [OFFER_PENDING_STATUS]: 'PENDING',
  [OFFER_ACCEPTED_STATUS]: 'ACCEPTED',
  [OFFER_DECLINED_STATUS]: 'DECLINED',
  [OFFER_CANCELED_STATUS]: 'CANCELED',
}

const menu = [
  { id: 1, name: 'Pending', types: [OFFER_PENDING_STATUS] },
  {
    id: 2,
    name: 'Completed',
    types: [OFFER_ACCEPTED_STATUS, OFFER_DECLINED_STATUS],
  },
  { id: 3, name: 'Canceled', types: [OFFER_CANCELED_STATUS] },
]

const MyOffers = ({ navigation, route }: MainStackScreenProps<'MyOffers'>) => {
  const dispatch = useAppDispatch()
  const { offer: routeOffer } = route.params || {}
  const { user, sub } = useAppSelector((state) => state.session)
  const [index, setIndex] = useState(0)

  const [viewingOffer, setViewingOffer] = useState<Offer>()
  const [showOfferOptions, setShowOfferOptions] = useState(false)
  const [offerConfig, setOfferConfig] = useState<OffersModuleConfig>()

  const swiper = useRef<SwiperFlatList>(null)
  const { data: offers = [], isLoading: isLoadingOffers } =
    useGetOffersQuery(sub)
  const loading = isLoadingOffers

  useEffect(() => {
    if (routeOffer) {
      const { statusId } = routeOffer
      let value = 0
      menu.some(({ types }, i) => {
        const isIndex = types.indexOf(statusId) !== -1
        if (isIndex) {
          value = i
        }
        return isIndex
      })
      setViewingOffer(routeOffer)
      setIndex(value)
    }
  }, [routeOffer])

  const handleMessageSeller = () => {
    if (viewingOffer) {
      const { product } = viewingOffer
      MessageSeller(user, product)
    }
  }

  const handleMessageBuyer = () => {
    if (viewingOffer && user) {
      const { product } = viewingOffer
      MessageBuyer(user, product)
    }
  }

  const handleReport = () => {
    ShowAlert({
      title: 'Report Seller',
      message: "Are you sure you want to \nreport this seller's offer?",
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

  const handleMenuPress = ({ index }) => {
    setIndex(index)
    swiper.current?.scrollToIndex({ index })
  }

  const handleChangeIndex = ({ index }) => {
    setIndex(index)
  }

  const handleOfferOption = () => {
    setShowOfferOptions(!showOfferOptions)
  }

  const handleViewProduct = (product: ProductType) => {
    navigation.navigate('ProductDetails', { product })
  }

  const handleViewUser = ({ id }: UserType) => {
    navigation.navigate('UserProfile', { userId: id })
  }

  const toggleViewOffer = (value: Offer) => {
    const isOffer = viewingOffer && viewingOffer.id === value.id
    setViewingOffer(isOffer ? undefined : value)
  }

  const renderFilterButton = () => {
    return 1 ? null : (
      <ShellButton style={styles.filterButton}>
        <Text style={styles.filterText}>Filter</Text>
        <View style={styles.filterCount}>
          <Text style={styles.filterCountText}>3</Text>
        </View>
        <Image source={SLIDERS} style={styles.filterImage} />
      </ShellButton>
    )
  }

  const renderMenu = (menu, i) => {
    return (
      <ShellButton
        key={i}
        style={styles.menuButton}
        data={{ ...menu, index: i }}
        onPress={handleMenuPress}
      >
        <Text style={[styles.menuText, i == index && styles.menuActive]}>
          {menu.name}
        </Text>
      </ShellButton>
    )
  }

  const renderList = (menu) => {
    const { types } = menu
    const offersList = offers.filter(
      (data) => types.indexOf(data.statusId) > -1
    )
    const isEmpty = offersList.length == 0
    return (
      <ScrollView key={menu.id}>
        <View style={styles.offers}>
          <Loading show={loading && isEmpty}>
            {offersList.map(renderOffer)}
            <EmptyContent show={isEmpty} message="You have no offers" />
          </Loading>
        </View>
      </ScrollView>
    )
  }

  const handleAccept = (offer) => {
    const { product } = offer
    console.log('offer', offer)
    setOfferConfig({
      action: 'accept',
      offerId: offer.id,
      price: offer.price || product.price,
      productId: product.id,
      userId: product.userId,
    })
  }

  const handleDecline = (offer) => {
    const { product } = offer
    console.log('offer', offer)
    setOfferConfig({
      action: 'decline',
      offerId: offer.id,
      price: offer.price || product.price,
      productId: product.id,
      userId: product.userId,
    })
  }

  const handleCancel = (offer) => {
    const { product } = offer
    console.log('offer', offer)
    setOfferConfig({
      action: 'cancel',
      offerId: offer.id,
      price: offer.price || product.price,
      productId: product.id,
      userId: product.userId,
    })
  }

  const handleCrashError = () => {
    dispatch(resetOffers())
  }

  const renderButtons = (offer) => {
    const {
      product: { userId },
    } = offer
    const isMyProduct = userId === user?.id

    return isMyProduct ? (
      <View style={styles.buttons}>
        <Button
          tight
          loading={loading}
          data={offer}
          style={styles.button}
          onPress={handleAccept}
        >
          Accept Offer
        </Button>
        <Button
          tight
          loading={loading}
          data={offer}
          style={styles.button}
          outlined
          onPress={handleDecline}
        >
          Decline Offer
        </Button>
      </View>
    ) : (
      <View style={styles.buttons}>
        <Button
          tight
          outlined
          loading={loading}
          data={offer}
          style={styles.button}
          onPress={handleCancel}
        >
          Withdraw Offer
        </Button>
      </View>
    )
  }

  const renderOffer = (offer) => {
    const {
      id,
      price,
      description,
      response,
      createdAt,
      fromUser = {},
      fromUserId,
      toUser = {},
      location,
      status,
      product,
    } = offer
    const isViewing = viewingOffer && viewingOffer.id === id
    const { title, previewImageUrl, user: seller } = product
    const { id: statusId } = status
    const isPending = statusId === OFFER_PENDING_STATUS
    const isDeclined = statusId === OFFER_DECLINED_STATUS
    const isCancelled = statusId === OFFER_CANCELED_STATUS
    const isMyOffer = fromUserId === user?.id
    const oppositeUser = isMyOffer ? toUser : fromUser
    const { username, city, region } = oppositeUser
    const verbText = isMyOffer ? 'to: ' : 'from: '
    const PrintPrice = parsePrice(price)
    const statusColor = isDeclined || isCancelled ? 'red' : 'darkgreen'
    const offerUser = isMyOffer ? 'You' : fromUser.username
    const responseUser = isCancelled
      ? isMyOffer
        ? 'You'
        : fromUser.username
      : toUser.username
    return (
      <ErrorBoundary key={offer.id} onError={handleCrashError}>
        <View style={styles.offer}>
          <ShellButton
            data={offer}
            style={styles.offerButton}
            onPress={toggleViewOffer}
          >
            <View style={styles.offerTitle}>
              <CachedImage
                source={{ uri: previewImageUrl }}
                style={styles.offerImage}
              />
              <Text
                numberOfLines={isViewing ? 5 : 2}
                style={[styles.titleText, isViewing && styles.selectedTitle]}
              >
                {title}
              </Text>
            </View>
            <View style={styles.offerPrice}>
              <Text style={styles.priceText}>{PrintPrice}</Text>
            </View>
            <View style={styles.offerDate}>
              <Text style={styles.dateText}>
                {moment(createdAt).format('MM/DD/YYYY')}
              </Text>
            </View>
          </ShellButton>
          <Collapsible collapsed={!isViewing}>
            <View style={styles.offerDetails}>
              {isMyOffer && (
                <ShellButton
                  data={offer}
                  style={styles.detailOptionButton}
                  onPress={handleOfferOption}
                >
                  <Image source={ELLIPSIS} style={styles.detailOption} />
                </ShellButton>
              )}
              <View style={styles.dashed} />
              <View style={styles.detailTop}>
                <ShellButton data={product} onPress={handleViewProduct}>
                  <CachedImage
                    source={{ uri: previewImageUrl }}
                    style={styles.detailImage}
                  />
                </ShellButton>
                <View style={styles.detailInfo}>
                  <ShellButton data={oppositeUser} onPress={handleViewUser}>
                    <Text fontSize="standard" fontStyle="bold">
                      <Text fontSize="standard">{verbText}</Text>@
                      {oppositeUser.username}
                    </Text>
                  </ShellButton>
                  <Text fontSize="standard">
                    {city}, {region}
                  </Text>
                  <Text fontSize="standard">
                    {moment(createdAt).format('ddd, MMMM D, YYYY')}
                  </Text>
                  <Text color="orange" fontStyle="bold">
                    {PrintPrice}
                  </Text>
                  <Text fontSize={'tiny'} color={statusColor}>
                    [{STATUS_CODE[statusId]}]
                  </Text>
                </View>
              </View>
              {description ? (
                <View style={styles.detailNote}>
                  <Text fontSize="standard" fontStyle="bold">
                    {`${offerUser}: `}
                    <Text fontSize="standard">{description}</Text>
                  </Text>
                </View>
              ) : null}
              {response ? (
                <View style={styles.detailNote}>
                  <Text fontSize="standard" fontStyle="bold">
                    {`${responseUser}: `}
                    <Text fontSize="standard">{response}</Text>
                  </Text>
                </View>
              ) : null}
              {isPending && renderButtons(offer)}
            </View>
          </Collapsible>
        </View>
      </ErrorBoundary>
    )
  }

  const offerBuyerActions = [
    {
      name: 'Message Seller',
      icon: MESSAGING,
      callback: handleMessageSeller,
    },
    { name: 'Report', icon: EXCLAMATION, callback: handleReport },
  ]

  const offerSellerActions = [
    {
      name: 'Message Buyer',
      icon: MESSAGING,
      callback: handleMessageBuyer,
    },
  ]

  const myProductOffer = viewingOffer && viewingOffer.product.userId == user?.id
  const offerActions = myProductOffer ? offerSellerActions : offerBuyerActions
  return (
    <View style={styles.container}>
      <Header
        avoidMode
        showBack
        title="My Offers"
        rightElement={renderFilterButton()}
      />
      <View style={styles.menu}>{menu.map(renderMenu)}</View>
      <SwiperFlatList
        index={index}
        ref={swiper}
        onChangeIndex={handleChangeIndex}
        style={styles.offersSwiper}
      >
        {menu.map(renderList)}
      </SwiperFlatList>
      {showOfferOptions && (
        <FloatingMenu
          title="Offer Options"
          menu={offerActions}
          closeCallBack={handleOfferOption}
        />
      )}
      {offerConfig && <OffersModule config={offerConfig} />}
    </View>
  )
}

export default MyOffers
