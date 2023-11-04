import React, { useState } from 'react'
import { Image, View } from 'react-native'
import { clone } from 'ramda'
import styles from './OfferProductStyles'
import { Text, Button, Loading, ShowAlert, ShellButton } from '../../components'
import { ApiConstants } from '../../services'
import { parsePrice } from '../../helpers/PriceHelper'
import Collapsible from 'react-native-collapsible'
import { Images } from '../../common'
import {
  SendSellerOfferMessage,
  SendBuyerOfferMessage,
} from '../../helpers/ChatHelper'
import {
  Offer,
  ProductTransactionReviewCriteriaType,
  ProductType,
  ShipmentType,
} from '../../types'
import moment from 'moment'
import { useAppSelector } from '../../store/hooks'
import { useNavigation } from '@react-navigation/native'
import { useGetOffersQuery } from '../../store/slice/api/features/offer'
import { ChannelMemberResponse } from 'stream-chat'
import { StreamChatGenerics } from '../../services/Chat'
import {
  useGetTransactionQuery,
  usePutTransactionMutation,
} from '../../store/slice/api/features/transaction'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { OffersModuleConfig } from '../../components/OffersModule/OffersModule'

const { CLOCK, CHECK, CHECK_CIRCLE, CARET_DOWN, EXCLAMATION_TRIANGLE } = Images

const {
  OFFER_PENDING_STATUS,
  OFFER_ACCEPTED_STATUS,
  OFFER_DECLINED_STATUS,
  OFFER_CANCELED_STATUS,
  TRANSACTION_PROBLEM_STATUS,
  TRANSACTION_COMPLETED_STATUS,
  TRANSACTION_PENDING_STATUS,
  TRANSACTION_FAILED_STATUS,
} = ApiConstants

interface OfferProductProps {
  product: ProductType
  members: ChannelMemberResponse<StreamChatGenerics>[]
  setOfferConfig: React.Dispatch<
    React.SetStateAction<OffersModuleConfig | undefined>
  >
}

const OfferProduct = ({
  product,
  members,
  setOfferConfig,
}: OfferProductProps) => {
  const navigation = useNavigation()
  const { user: currentUser } = useAppSelector((state) => state.session)
  const [hide, setHide] = useState(false)

  const { data: offers = [], isLoading: isLoadingOffers } = useGetOffersQuery(
    currentUser.id
  )
  const findProductOffer = () => {
    const { id: productId, userId } = product
    const hasOffer = clone(offers)
      .sort((a, b) => {
        return a.createdAt < b.createdAt ? 1 : -1
      })
      .find((offer) => {
        const { toUserId, fromUserId } = offer
        const isOffer =
          offer.product.id == productId &&
          members.length &&
          ((members[0].user_id === toUserId &&
            members[1].user_id === fromUserId) ||
            (members[0].user_id === fromUserId &&
              members[1].user_id === toUserId))
        return isOffer
      })
    return hasOffer
  }
  const hasOffer = findProductOffer()

  const { data: transaction, isLoading: isLoadingTransaction } =
    useGetTransactionQuery(
      hasOffer
        ? {
            userId: product.userId,
            productId: product.id,
            transactionId: hasOffer.transactionId,
          }
        : skipToken
    )

  const [putTransaction, { isLoading: isLoadingPutTransaction }] =
    usePutTransactionMutation()

  const loading =
    isLoadingOffers || isLoadingTransaction || isLoadingPutTransaction

  // handlers
  const handleToggleCollapse = () => setHide(!hide)

  const handleAcceptOffer = (offer: Offer) => {
    let canAccept = true
    const hasAcceptedOffer = offers.find((offer) => {
      const { id } = product
      const isOffer =
        offer.product.id == id &&
        offer.transactionId != transaction?.id &&
        offer.statusId == OFFER_ACCEPTED_STATUS
      return isOffer
    })

    if (hasAcceptedOffer) {
      // fetch transaction
      canAccept = false
      if (
        transaction &&
        transaction.transactionStatusId == TRANSACTION_FAILED_STATUS
      ) {
        canAccept = true
      }
    }

    if (canAccept) {
      setOfferConfig({
        action: 'accept',
        offerId: offer.id,
        price: offer.price || product.price,
        productId: product.id,
        userId: product.userId,
      })
    } else {
      // alert('You can only accept one offer at a time.')
    }
  }

  const handleRejectOffer = (offer: Offer) => {
    setOfferConfig({
      action: 'decline',
      offerId: offer.id,
      price: offer.price || product.price,
      productId: product.id,
      userId: product.userId,
    })
  }

  const handleWithdrawOffer = (offer: Offer) => {
    setOfferConfig({
      action: 'cancel',
      offerId: offer.id,
      price: offer.price || product.price,
      productId: product.id,
      userId: product.userId,
    })
  }

  const handleCreateOffer = () => {
    setOfferConfig({
      action: 'create',
      price: product.price,
      productId: product.id,
      userId: product.userId,
      isNegotiable: product.isNegotiable || false,
    })
  }

  const handleBuy = () => {
    setOfferConfig({
      action: 'buy',
      price: product.price,
      productId: product.id,
      userId: product.userId,
      isNegotiable: product.isNegotiable || false,
    })
  }

  const handleAccept = (offer: Offer) => {
    const { fromUser } = offer
    const { acceptVerb, offerType } = getVerbs()
    // const { id: productId, userId } = product
    // const hasAcceptedOffer = offers.find((offer) => {
    //   const isOffer =
    //     offer.product.id == productId &&
    //     offer.transactionId != transaction?.id &&
    //     offer.statusId == OFFER_ACCEPTED_STATUS
    //   return isOffer
    // })

    // if (hasAcceptedOffer) {
    //   // dispatch({
    //   //   type: 'GET_TRANSACTION',
    //   //   transactionId: hasAcceptedOffer.transactionId,
    //   //   productId,
    //   //   userId,
    //   // })
    // }

    ShowAlert({
      title: acceptVerb,
      message: `You are about to accept this ${offerType} from ${fromUser.username}. Do you wish to proceed?`,
      actions: [
        {
          ...offer,
          positive: true,
          name: 'Yes, Accept',
          callback: handleAcceptOffer,
        },
        {
          name: 'No',
        },
      ],
    })
  }

  const handleViewProduct = () => {
    navigation.navigate('ProductDetails', {
      userId: product.userId,
      productId: product.id,
      product,
    })
  }

  const handleQRCode = () => {
    if (transaction) {
      navigation.navigate('Transaction', {
        screen: 'BuyerQRCode',
        params: {
          product,
          transaction,
        },
      })
    }
  }
  const handleScanCode = () => {
    if (transaction) {
      navigation.navigate('Transaction', {
        screen: 'SellerQrScanner',
        params: {
          product,
          transaction,
        },
      })
    }
  }
  const handleCounter = (offer: Offer) => {
    setOfferConfig({
      action: 'counter',
      price: offer.price || product.price,
      productId: product.id,
      userId: product.userId,
      offerId: offer.id,
      isNegotiable: product.isNegotiable || false,
      maxPrice: product.price,
    })
  }

  const handleWithdraw = (offer: Offer) => {
    const { offerType } = getVerbs()
    ShowAlert({
      title: `Are you sure you'd like to \nwithdraw your ${offerType}?`,
      message:
        "Seller will receive a notification indicating that you've withdrawn",
      actions: [
        {
          ...offer,
          positive: true,
          name: 'Withdraw',
          callback: handleWithdrawOffer,
        },
        {
          name: 'Cancel',
        },
      ],
    })
  }

  const handleReject = (offer: Offer) => {
    const { offerType } = getVerbs()
    ShowAlert({
      title: `Are you sure you'd like to reject this ${offerType}?`,
      message:
        "Buyer will receive a notification indicating that you've rejected.",
      actions: [
        {
          ...offer,
          name: 'Reject',
          positive: true,
          callback: handleRejectOffer,
        },
        {
          name: 'Cancel',
        },
      ],
    })
  }

  // const handleDispute = () => {
  //   navigation.navigate('Transaction', {
  //     screen: 'Dispute',
  //     params: { Transaction: transaction },
  //   })
  // }

  const handleReportProblem = () => {
    if (transaction) {
      navigation.navigate('Transaction', {
        screen: 'ReportProblem',
        params: {
          transaction,
        },
      })
    }
  }

  const handleRateTransaction = async ({ type }) => {
    const offer = getOffer()
    const { id: productId, userId } = product

    if (transaction) {
      const { id: transactionId, transactionStatusId } = transaction
      const lowerType = type.toLowerCase()
      const RateNow = () => {
        if (
          transaction &&
          [
            ProductTransactionReviewCriteriaType.SELLER,
            ProductTransactionReviewCriteriaType.BUYER,
          ].includes(lowerType)
        ) {
          navigation.navigate('Transaction', {
            screen: 'RateTransaction',
            params: {
              product,
              type:
                lowerType === 'seller'
                  ? ProductTransactionReviewCriteriaType.SELLER
                  : ProductTransactionReviewCriteriaType.BUYER,
              transaction,
            },
          })
        }
      }
      if (transactionStatusId !== TRANSACTION_COMPLETED_STATUS) {
        try {
          await putTransaction({
            userId,
            productId,
            transactionId,
            data: {
              transactionStatusId: TRANSACTION_COMPLETED_STATUS,
            },
          }).unwrap()

          const endMessage = `[Transaction Ended]\nTransaction marked as Completed`
          switch (lowerType) {
            case 'buyer':
              // is seller rating buyer
              SendBuyerOfferMessage(user, offer, endMessage)
              break
            case 'seller':
              // is buyer rating seller
              SendSellerOfferMessage(user, offer, endMessage)
              break
          }
          RateNow()
        } catch (err) {}
      } else {
        RateNow()
      }
    }
  }

  const handleDeliveryOptions = () => {
    const offer = findProductOffer()
    if (offer && transaction) {
      navigation.navigate('Transaction', {
        screen: 'DeliveryOptions',
        params: {
          product,
          offer,
          transaction,
        },
      })
    }
  }

  const handleGenerateShippingLabel = () => {
    const offer = findProductOffer()
    if (offer && transaction) {
      navigation.navigate('Transaction', {
        screen: 'GenerateShippingLabel',
        params: {
          product,
          offer,
          transaction,
        },
      })
    }
  }

  const handleViewShippingLabel = () => {
    if (transaction) {
      navigation.navigate('Transaction', {
        screen: 'ViewShippingLabel',
        params: {
          transaction,
        },
      })
    }
  }

  const handleTrackShippment = () => {
    if (transaction) {
      navigation.navigate('Transaction', {
        screen: 'TrackShipping',
        params: {
          product,
          transaction,
        },
      })
    }
  }

  const getVerbs = () => {
    const { isNegotiable } = product
    const offerTypeCase = isNegotiable ? 'Offer' : 'Buy Request'
    const offerType = isNegotiable ? 'offer' : 'buy request'
    const ctaVerb = isNegotiable ? 'Make a New Offer' : 'Buy Now'
    const acceptVerb = isNegotiable ? 'Accept Offer' : 'Accept Request'
    const declineVerb = isNegotiable ? 'Reject Offer' : 'Decline Request'
    const withdrawVerb = isNegotiable ? 'Withdraw Offer' : 'Withdraw Request'
    const ctaCallback = isNegotiable ? handleCreateOffer : handleBuy

    return {
      offerTypeCase,
      offerType,
      ctaVerb,
      acceptVerb,
      declineVerb,
      withdrawVerb,
      ctaCallback,
    }
  }

  const getOffer = () => {
    return clone(offers)
      .sort((a, b) => {
        return a.createdAt < b.createdAt ? 1 : -1
      })
      .find((offer) => {
        const { id } = product
        const isOffer = offer.product.id == id
        return isOffer
      })
  }

  // renderers

  if (!product || !product.id || product.isPublished === false) {
    return loading ? null : (
      <View style={styles.product}>
        <View style={styles.productUnavailableView}>
          <Text style={styles.productUnavailableText}>
            Product no longer available
          </Text>
        </View>
      </View>
    )
  }

  const {
    id,
    price,
    title,
    images,
    previewImageUrl,
    isSold,
    user,
    userId,
    distance,
    isNegotiable,
    isLocal,
    isLocalOnline,
    isShipping,
  } = product
  const { profileImageUrl, city, region } = user || {}

  const actualOffer = hasOffer != null
  const isMyProduct = product && currentUser?.id === product.userId
  const isPending = actualOffer && hasOffer.statusId === OFFER_PENDING_STATUS
  const isAccepted = actualOffer && hasOffer.statusId === OFFER_ACCEPTED_STATUS
  const isDeclined = actualOffer && hasOffer.statusId === OFFER_DECLINED_STATUS
  const isCanceled = actualOffer && hasOffer.statusId === OFFER_CANCELED_STATUS
  const currentPrice = parsePrice((actualOffer && hasOffer.price) || 0)
  const productPrice = parsePrice(price)
  const isBestOffer = actualOffer ? hasOffer.price === price : false
  const {
    offerTypeCase,
    offerType,
    ctaVerb,
    acceptVerb,
    declineVerb,
    withdrawVerb,
    ctaCallback,
  } = getVerbs()
  const isMyOffer = actualOffer && hasOffer.fromUserId == currentUser?.id
  const toUser = actualOffer ? hasOffer.toUser : null
  const fromUser = actualOffer ? hasOffer.fromUser : null
  const isCounterOffer = actualOffer && hasOffer.previousOfferId
  const {
    transactionStatusId,
    endedUserId,
    reviews = [],
    isPaid,
    shipmentId,
    isCash,
    forceEndAt,
    isPickedUp,
    shipment,
  } = transaction || {}
  const { carrier, isDelivered, isShipped, trackingNumber } = shipment || {}
  const hasShippingLabel = carrier && trackingNumber
  const trackingAvailable = isShipped || isDelivered
  const transactionProblem = transactionStatusId == TRANSACTION_PROBLEM_STATUS
  const transactionCompleted =
    transactionStatusId == TRANSACTION_COMPLETED_STATUS
  const transactionFailed = transactionStatusId == TRANSACTION_FAILED_STATUS
  const transactionEnded = transactionFailed || transactionCompleted
  // const endedBy =
  //   transactionFailed &&
  //   (transaction?.endedUserId === toUser?.id ? toUser : fromUser)
  const rateWho = isMyProduct ? 'Buyer' : 'Seller'
  const didReview = reviews.find(
    ({ reviewUserId }) => reviewUserId === currentUser.id
  )
  const didSave = isAccepted && hasOffer.price < price
  const hasReportTime =
    transactionStatusId === TRANSACTION_PENDING_STATUS &&
    forceEndAt &&
    moment() < moment(forceEndAt)
  let offerActions = null
  let moreActions = null

  // sub renderes
  const renderPrePayment = () =>
    isMyProduct ? renderSellerPrePayment() : renderBuyerPrePayment()

  const renderSellerPrePayment = () => (
    <View style={styles.offerStateSpaced}>
      <View>
        <Image source={CLOCK} style={styles.clockIcon} />
      </View>
      <View style={styles.stateCol}>
        <Text fontSize="small">
          {`Offer accepted, awaiting buyer's payment${
            isLocal && isShipping ? ' and delivery option' : ''
          }.`}
        </Text>
      </View>
    </View>
  )

  const renderBuyerPrePayment = () => (
    <View style={styles.productsActionsSpaced}>
      <Button
        loading={loading}
        data={transaction}
        style={styles.action}
        textStyle={styles.actionText}
        onPress={handleDeliveryOptions}
      >
        Delivery Options
      </Button>
    </View>
  )

  const renderPostPayment = () =>
    isMyProduct ? renderSellerShipment() : renderBuyerShipment()

  const renderSellerShipment = () =>
    hasShippingLabel ? (
      trackingAvailable ? (
        <View style={styles.offerState}>
          <View>
            <Image source={CLOCK} style={styles.clockIcon} />
          </View>
          <View style={styles.stateCol}>
            <Text fontSize="small">Your Product has been shipped.</Text>
            <ShellButton onPress={handleTrackShippment}>
              <Text fontStyle="bold" color="green" fontSize="small">
                Track Your Shipment
              </Text>
            </ShellButton>
          </View>
        </View>
      ) : (
        <View>
          <View style={styles.offerState}>
            <View>
              <Image source={CLOCK} style={styles.clockIcon} />
            </View>
            <View style={styles.stateCol}>
              <Text fontSize="small">
                Shipping label generated. Ship out package from a {carrier}{' '}
                location.
              </Text>
            </View>
          </View>
          <View style={styles.productsActionsSpaced}>
            <Button
              loading={loading}
              data={transaction}
              style={styles.action}
              textStyle={styles.actionText}
              onPress={handleViewShippingLabel}
            >
              View Shipping Label
            </Button>
          </View>
        </View>
      )
    ) : isCash || !shipment ? (
      <React.Fragment>
        <View style={styles.offerState}>
          <View style={styles.stateCol}>
            <Text fontSize="small">
              <Text fontSize="small" fontStyle="bold">
                {isPaid ? 'Payment received. ' : ''}
                Ask buyer to present code
              </Text>
              {' to you after meeting up.'}
            </Text>
          </View>
        </View>
        <View style={styles.productsActionsSpaced}>
          <Button
            loading={loading}
            data={transaction}
            style={styles.action}
            textStyle={styles.actionText}
            onPress={handleScanCode}
          >
            Scan Buyer's Code
          </Button>
        </View>
      </React.Fragment>
    ) : (
      <View style={styles.productsActionsSpaced}>
        <Button
          loading={loading}
          data={transaction}
          style={styles.action}
          textStyle={styles.actionText}
          onPress={handleGenerateShippingLabel}
        >
          Generate Shipping Label
        </Button>
      </View>
    )

  const renderBuyerShipment = () =>
    hasShippingLabel && trackingAvailable ? (
      <View style={styles.offerState}>
        <View>
          <Image source={CLOCK} style={styles.clockIcon} />
        </View>
        <View style={styles.stateCol}>
          <Text fontSize="small">Your Product has been shipped.</Text>
          <ShellButton onPress={handleTrackShippment}>
            <Text fontStyle="bold" color="green" fontSize="small">
              Track Your Shipment
            </Text>
          </ShellButton>
        </View>
      </View>
    ) : isCash || !shipment ? (
      <React.Fragment>
        <View style={styles.offerState}>
          <View style={styles.stateCol}>
            <Text fontSize="small">
              {isPaid ? 'Payment protected. ' : ''}
              {'Show code to the seller '}
              <Text fontStyle="bold" fontSize="small">
                only when you have the product.
              </Text>
            </Text>
          </View>
        </View>
        <View style={styles.productsActionsSpaced}>
          <Button
            loading={loading}
            data={hasOffer}
            style={styles.action}
            textStyle={styles.actionText}
            onPress={handleQRCode}
          >
            Show Code To Seller
          </Button>
        </View>
      </React.Fragment>
    ) : (
      <View style={styles.offerState}>
        <View>
          <Image source={CLOCK} style={styles.clockIcon} />
        </View>
        <View style={styles.stateCol}>
          <Text fontSize="small">
            Payment successful, Product will be shipped soon.
          </Text>
        </View>
      </View>
    )

  const renderPostReviewRating = () => (
    <View style={styles.offerState}>
      <Text fontSize="small">
        You have rated this transaction and experience {didReview.rating}
        /5.
      </Text>
    </View>
  )

  const renderPreReviewRating = () => (
    <React.Fragment>
      {hasReportTime ? (
        isMyProduct ? (
          transactionProblem ? (
            <View style={styles.offerState}>
              <View>
                <Image source={EXCLAMATION_TRIANGLE} style={styles.clockIcon} />
              </View>
              <View style={styles.stateCol}>
                <Text fontSize="small">
                  Buyer has reported problems. Try communicating with the buyer.
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.offerState}>
              <View style={styles.stateCol}>
                <Text fontSize="small">
                  Product delivered. Buyer has{' '}
                  <Text fontStyle="bold" fontSize="small">
                    {moment(forceEndAt).fromNow().replace('in ', '')}
                  </Text>{' '}
                  left to report problems.
                </Text>
              </View>
            </View>
          )
        ) : transactionProblem ? (
          <View style={styles.offerState}>
            <View>
              <Image source={EXCLAMATION_TRIANGLE} style={styles.clockIcon} />
            </View>
            <View style={styles.stateCol}>
              <Text fontSize="small">
                You have reported a problem. Try communicating with the seller.
                We will also be in communication with you.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.offerState}>
            <View style={styles.stateCol}>
              <Text fontSize="small">
                You have{' '}
                <Text fontStyle="bold" fontSize="small">
                  {moment(forceEndAt).fromNow().replace('in ', '')}
                </Text>{' '}
                left to
                <Text
                  fontStyle="bold"
                  fontSize="small"
                  color="green"
                  onPress={handleReportProblem}
                >
                  {' report problems'}
                </Text>
                , or
              </Text>
            </View>
          </View>
        )
      ) : null}
      {(isMyProduct && !hasReportTime) || !isMyProduct ? (
        <View style={styles.productsActionsSpaced}>
          <Button
            loading={loading}
            data={{ transaction, offer: hasOffer, type: rateWho }}
            style={styles.action}
            textStyle={styles.actionText}
            onPress={handleRateTransaction}
          >
            {`${hasReportTime ? 'Skip & ' : ''}Rate ${rateWho}`}
          </Button>
        </View>
      ) : null}
    </React.Fragment>
  )

  const renderPostTransactionEnded = () =>
    didReview ? renderPostReviewRating() : renderPreReviewRating()

  if (isPending) {
    // has offer
    if (isMyOffer) {
      // from me
      moreActions = (
        <View style={[styles.topDivider, styles.actionsRow]}>
          <Button
            color={'white'}
            textColor={'green'}
            loading={loading}
            data={hasOffer}
            style={styles.halfAction}
            textStyle={styles.actionText}
            wrapperStyle={styles.textWrap}
            onPress={handleWithdraw}
          >
            {withdrawVerb}
          </Button>
          {/*
              <Button
                color={'white'}
                textColor={'green'}
                loading={loading}
                data={hasOffer}
                style={styles.halfAction}
                textStyle={styles.actionText}
                wrapperStyle={styles.textWrap}
                onPress={this.handleCounter}>
                Make New Offer
              </Button>
            */}
        </View>
      )
    } else {
      // to me
      offerActions = (
        <View style={styles.productsActionsSpaced}>
          <Button
            loading={loading}
            data={hasOffer}
            style={styles.action}
            textStyle={styles.actionText}
            onPress={handleAccept}
          >
            {acceptVerb}
          </Button>
        </View>
      )
      moreActions = (
        <View style={[styles.topDivider, styles.actionsRow]}>
          {isNegotiable && (!isMyProduct || (isMyProduct && !isBestOffer)) && (
            <Button
              color={'white'}
              textColor={'green'}
              loading={loading}
              data={hasOffer}
              style={styles.halfAction}
              textStyle={styles.actionText}
              wrapperStyle={styles.textWrap}
              onPress={handleCounter}
            >
              Counter Offer
            </Button>
          )}
          <Button
            color={'white'}
            textColor={'green'}
            loading={loading}
            data={hasOffer}
            style={styles.halfAction}
            textStyle={styles.actionText}
            wrapperStyle={styles.textWrap}
            onPress={handleReject}
          >
            {declineVerb}
          </Button>
        </View>
      )
    }
  } else {
    if (isAccepted) {
      // offer is accepted
      offerActions =
        isDelivered || isPickedUp || transactionEnded
          ? renderPostTransactionEnded()
          : isPaid || isCash
          ? renderPostPayment()
          : renderPrePayment()
    } else {
      // no offer
      if (isMyProduct) {
        // seller
        // no action
      } else {
        // buyer
        offerActions = (
          <View style={styles.productsActions}>
            <Button
              loading={loading}
              data={hasOffer}
              style={[styles.action, styles.actionSpaced]}
              textStyle={styles.actionText}
              onPress={ctaCallback}
            >
              {ctaVerb}
            </Button>
          </View>
        )
      }
    }
  }

  return (
    <View style={styles.wrapper}>
      <Collapsible collapsed={hide}>
        <View key={id} style={styles.product}>
          {isAccepted && (
            <React.Fragment>
              <View style={styles.completedBox}></View>
              <Image style={styles.completedCheck} source={CHECK} />
            </React.Fragment>
          )}
          <View style={styles.subWrapper}>
            <ShellButton
              style={styles.productMedia}
              onPress={handleViewProduct}
            >
              <Image
                style={styles.productImage}
                source={{
                  uri:
                    (images && images.length && images[0].url) ||
                    previewImageUrl,
                }}
              />
            </ShellButton>
            <View style={styles.productInfo}>
              <Text
                fontStyle="bold"
                style={styles.productTitle}
                numberOfLines={1}
              >
                {title}
              </Text>
              {/*
                  <Text style={styles.smallGrayText}>
                    {city}, {region}
                    {distance && ` - ${distance}`}
                  </Text>
                */}
              {isPending && (
                <View>
                  <Text style={styles.smallGrayText}>
                    {isNegotiable ? 'Offered Price' : 'Buy Request'}
                  </Text>
                  <Text style={styles.orangeText}>{currentPrice}</Text>
                </View>
              )}
              {isAccepted && (
                <View>
                  <View style={styles.actionsRow}>
                    <Image style={styles.checkCircle} source={CHECK_CIRCLE} />
                    <Text style={styles.smallGrayText}>
                      {offerTypeCase} Accepted At
                    </Text>
                  </View>
                  <Text style={styles.listPrice}>{currentPrice}</Text>
                </View>
              )}
              <View>
                <Text style={styles.smallGrayText}>Listed At</Text>
                <Text>
                  <Text
                    style={[
                      isAccepted ? styles.listPriceSmall : styles.listPrice,
                      didSave && styles.strikethrough,
                    ]}
                  >
                    {productPrice}
                  </Text>
                  {didSave && !isMyProduct ? (
                    <Text style={styles.savePercent}>
                      {'  Saved '}
                      {100 - Math.round((hasOffer.price / price) * 100)}
                      {'%!'}
                    </Text>
                  ) : null}
                </Text>
              </View>
            </View>
          </View>
          <Loading show={loading} style={styles.loader}>
            <React.Fragment>
              {isPending && isMyOffer ? (
                <View style={styles.offerState}>
                  <View>
                    <Image source={CLOCK} style={styles.clockIcon} />
                  </View>
                  <View style={styles.stateCol}>
                    <Text fontSize="small">
                      Offer submitted, awaiting seller's response.
                    </Text>
                  </View>
                </View>
              ) : null}
              {
                /*isSold && !hasOffer ? null :*/ offerActions ? (
                  <View style={styles.productsActions}>{offerActions}</View>
                ) : null
              }
              <View style={styles.moreActions}>{moreActions}</View>
            </React.Fragment>
          </Loading>
        </View>
      </Collapsible>

      <View style={styles.footer}>
        <ShellButton
          style={styles.collapseButton}
          onPress={handleToggleCollapse}
        >
          <Text style={styles.collapseText}>
            {hide ? 'Show Product Info' : 'Collapse'}
          </Text>
          <Image
            source={CARET_DOWN}
            style={[styles.collapseCaret, hide && styles.collapsed]}
          />
        </ShellButton>
      </View>
    </View>
  )
}

export default OfferProduct
