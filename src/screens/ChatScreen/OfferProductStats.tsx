import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { clone } from 'ramda'
import styles from './OfferProductStyles'
import { Text, Button, Loading } from '../../components'
import { ApiConstants } from '../../services'
import { parsePrice } from '../../helpers/PriceHelper'
import { ProductType, ShipmentType } from '../../types'
import chatClient, { StreamChatGenerics } from '../../services/Chat'
import { useAppSelector } from '../../store/hooks'
import { ChannelMemberResponse } from 'stream-chat'
import { useGetOffersQuery } from '../../store/slice/api/features/offer'
import { skipToken } from '@reduxjs/toolkit/dist/query'

const {
  OFFER_PENDING_STATUS,
  OFFER_ACCEPTED_STATUS,
  OFFER_DECLINED_STATUS,
  OFFER_CANCELED_STATUS,
  TRANSACTION_FAILED_STATUS,
  TRANSACTION_PENDING_STATUS,
  TRANSACTION_COMPLETED_STATUS,
} = ApiConstants
let sub: {
  unsubscribe: () => void
}

interface OfferProductStatsProps {
  product: ProductType
  members: ChannelMemberResponse<StreamChatGenerics>[]
  onOfferAction: (action, params) => void
}

const OfferProductStats = ({
  product,
  members,
  onOfferAction,
}: OfferProductStatsProps) => {
  const { transactions } = useAppSelector((state) => state.offers)
  const { user: currentUser } = useAppSelector((state) => state.session)
  const [transactionId, setTransactionId] = useState<string>()
  const [initialized, setInitialized] = useState(false)

  const { data: offers = [] } = useGetOffersQuery(
    currentUser ? currentUser.id : skipToken
  )

  useEffect(() => {
    if (!initialized && offers.length > 0) {
      const { id: productId, userId } = product
      const offer = findProductOffer()
      if (offer) {
        setTransactionId(offer.transactionId)
        sub = chatClient.on((event) => {
          if (['message.new'].includes(event.type)) {
            // this.props.getTransaction(userId, productId, transactionId)
            // this.props.getOffers()
          }
        })
        setInitialized(true)
      }
    }
  }, [offers, initialized])

  useEffect(() => {
    return () => {
      if (sub) {
        sub.unsubscribe()
      }
    }
  }, [])

  const handleOfferAction = ({ action, params }) => {
    onOfferAction(action, params)
  }

  const getProductOffer = (offer) => {
    const { id } = product || {}
    const isOffer = offer.product.id == id
    return isOffer
  }

  const getOfferTransaction = () => {
    const productTransactions = transactions[product.id] || []
    const transaction = productTransactions.length
      ? productTransactions.find(({ id }) => id === transactionId)
      : productTransactions
    return transaction || { id: transactionId }
  }

  const getVerbs = () => {
    const { isNegotiable } = product
    const offerType = isNegotiable ? 'offer' : 'buy request'

    return {
      offerType,
    }
  }

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

  const firstUpper = (string: string) =>
    `${string[0].toUpperCase()}${string.substring(1)}`

  if (!product || !product.id || product.isPublished === false) {
    return null
  }

  const {
    id,
    price,
    title,
    images,
    previewImageUrl,
    user,
    isSold,
    userId,
    distance,
    isNegotiable,
  } = product
  const { profileImageUrl, city, region } = user || {}
  const hasOffer = findProductOffer()
  const actualOffer = hasOffer != null
  const isPending = actualOffer && hasOffer.statusId === OFFER_PENDING_STATUS
  const isAccepted = actualOffer && hasOffer.statusId === OFFER_ACCEPTED_STATUS
  const isDeclined = actualOffer && hasOffer.statusId === OFFER_DECLINED_STATUS
  const isCanceled = actualOffer && hasOffer.statusId === OFFER_CANCELED_STATUS
  const currentPrice = parsePrice((actualOffer && hasOffer.price) || 0)
  const productPrice = parsePrice(price)
  const offerType = isNegotiable ? 'offer' : 'buy request'
  const typePre = isNegotiable ? 'an' : 'a'
  const isMyOffer = actualOffer && hasOffer.fromUserId == currentUser?.id
  const isMyProduct = currentUser?.id === userId
  const toUser = actualOffer ? hasOffer.toUser : null
  const fromUser = actualOffer ? hasOffer.fromUser : null
  const isCounterOffer = actualOffer && hasOffer.previousOfferId
  const transaction = getOfferTransaction()

  const {
    transactionStatusId,
    endedUserId,
    reviews = [],
    isPaid,
    isCash,
    isPickedUp,
    shipmentId,
    shipment = { carrier: null, trackingNumber: null },
  } = transaction
  const { carrier, isDelivered, isShipped, trackingNumber }: ShipmentType =
    shipment || {}
  const trackingAvailable = isShipped || isDelivered
  const hasShippingLabel = carrier && trackingNumber
  const transactionCompleted =
    transactionStatusId == TRANSACTION_COMPLETED_STATUS
  const transactionFailed = transactionStatusId == TRANSACTION_FAILED_STATUS
  const transactionEnded = transactionFailed || transactionCompleted
  const endedBy =
    transactionEnded && (endedUserId === toUser?.id ? toUser : fromUser)
  const endedByMe = endedBy && endedBy.id === currentUser?.id
  const transactionStatus = `Transaction ${
    transactionStatusId == TRANSACTION_FAILED_STATUS ? 'failed' : 'completed'
  }`
  const rateWho = isMyProduct ? 'Buyer' : 'Seller'
  const didReview = reviews.find(
    ({ reviewUserId }) => reviewUserId === currentUser?.id
  )
  let offerActions = null
  let moreActions = null
  let statHeading = null
  let statBody = null

  // sub-renders
  const renderTrackingAvailableBody = () => {
    if (trackingAvailable) {
      return (
        <View style={styles.textRow}>
          <Text style={styles.normalText}>
            Congrats, your product has been shipped! We’ll notify you once it
            has arrived. You can{' '}
            <Text
              data={{
                action: 'handleTrackShippment',
              }}
              onPress={handleOfferAction}
              style={styles.normalGreenText}
              fontStyle="bold"
            >
              track your shipment here.
            </Text>
          </Text>
        </View>
      )
    }

    return isMyProduct ? (
      <View style={styles.textRow}>
        <Text style={styles.normalText}>
          Shipping label has been generated.
          <Text
            data={{
              action: 'handleViewShippingLabel',
            }}
            onPress={handleOfferAction}
            style={styles.normalGreenText}
            fontStyle="bold"
          >
            {' View Shipping Label '}
          </Text>
          <Text style={styles.normalText}>
            {
              'and follow the instructions to ship the product. You’ll be able to track the shipment afterwards.'
            }
          </Text>
        </Text>
      </View>
    ) : (
      <View style={styles.textRow}>
        <Text style={styles.normalText}>
          Your payment is now in Netsave’s escrow secure account and will not be
          released until you receive the product. We’ll notify you once your
          product has been shipped.
        </Text>
      </View>
    )
  }

  const renderShipmentBody = () => {
    if (isMyProduct) {
      return shipment ? (
        <View style={styles.textRow}>
          <Text style={styles.normalText}>
            Buyer has made the payment and selected shipping as the delivery
            option.
            <Text
              data={{
                action: 'handleGenerateShippingLabel',
              }}
              onPress={handleOfferAction}
              style={styles.normalGreenText}
              fontStyle="bold"
            >
              {' Generate shipping label '}
            </Text>
            <Text style={styles.normalText}>and follow the instructions.</Text>
          </Text>
        </View>
      ) : (
        <View style={styles.textRow}>
          <Text style={styles.normalText}>
            Buyer selected to pay via Cash or Other payment method when meeting
            up with you. Please proceed by planning a meetup location in a safe
            public environment where you will
            <Text
              data={{
                action: 'handleScanCode',
              }}
              onPress={handleOfferAction}
              fontStyle="bold"
              style={styles.normalGreenText}
            >
              {' Scan Code '}
            </Text>
            to confirm payment receipt and product delivery.
          </Text>
        </View>
      )
    } else {
      return shipment ? (
        <View style={styles.textRow}>
          <Text style={styles.normalText}>
            Your payment has been received and secured by Netsave. It will not
            be released to the seller until you confirm receipt of the product.
          </Text>
        </View>
      ) : (
        <View style={styles.textRow}>
          <Text style={styles.normalText}>
            {isCash
              ? ''
              : 'Your payment has been received & secured in our escrow account. It’ll only be released to the seller after you confirm receipt of the product. '}
            Arrange a safe location to meetup with the seller, and
            <Text
              onPress={handleOfferAction}
              data={{
                action: 'handleQRCode',
              }}
              style={styles.normalGreenText}
              fontStyle="bold"
            >
              {' present the code '}
            </Text>
            <Text style={styles.normalText} fontStyle="bold">
              only when you have the product.
            </Text>
          </Text>
        </View>
      )
    }
  }

  if (hasOffer) {
    // has offer
    if (isMyOffer) {
      // from me
      switch (hasOffer.statusId) {
        case OFFER_PENDING_STATUS:
          statHeading = isCounterOffer ? (
            <Text style={styles.headingText}>
              Counter {firstUpper(offerType)} Submitted!
            </Text>
          ) : (
            <Text style={styles.headingText}>
              {firstUpper(offerType)} Submitted!
            </Text>
          )
          statBody = isCounterOffer ? (
            <View style={styles.textRow}>
              <Text style={styles.normalText}>
                You've made a counter {offerType}{' '}
              </Text>
              <Text style={styles.normalText}>
                at {currentPrice} and {toUser?.username} has been notified.
              </Text>
            </View>
          ) : (
            <View style={styles.textRow}>
              <Text style={styles.normalText}>
                You've made {typePre} {offerType} at {currentPrice},
              </Text>
              <Text style={styles.normalText}>
                {' '}
                and {toUser?.username} has been notified.{' '}
              </Text>
            </View>
          )
          break
        case OFFER_ACCEPTED_STATUS:
          if (transactionEnded) {
            statHeading = (
              <Text style={styles.headingText}>The transaction has ended</Text>
            )
            statBody = (
              <View>
                <View style={styles.textRow}>
                  <Text style={styles.normalText}>
                    {endedByMe ? 'You have' : `${toUser?.username} has`} ended
                    this transaction and
                  </Text>
                  <Text style={styles.normalText}> marked it as{'  '}</Text>
                  <Text
                    style={
                      endedByMe
                        ? styles.normalGreenText
                        : styles.normalOrangeText
                    }
                  >
                    {transactionStatus}.
                  </Text>
                </View>
                {/*!didReview && (
                    <View style={styles.statActions}>
                      <Button
                        data={{
                          action: 'handleRateTransaction',
                          params: {
                            transaction,
                            offer: hasOffer,
                            type: rateWho.toLowerCase()
                          }
                        }}
                        style={styles.action}
                        textStyle={styles.actionText}
                        onPress={handleOfferAction}>
                        {`Proceed To Rate ${rateWho}`}
                      </Button>
                    </View>
                  )*/}
              </View>
            )
          } else {
            statHeading =
              isPaid || isCash ? (
                trackingAvailable ? (
                  <Text style={styles.headingText}>
                    Your product has been shipped!
                  </Text>
                ) : shipment ? (
                  <Text style={styles.headingText}>Payment Successful!</Text>
                ) : (
                  <Text style={styles.headingText}>
                    {isCash ? 'Arrange Meetup' : 'Payment Protected!'}
                  </Text>
                )
              ) : (
                <Text style={styles.headingText}>
                  {firstUpper(offerType)} Accepted!
                </Text>
              )
            statBody =
              isPaid || isCash ? (
                hasShippingLabel ? (
                  renderTrackingAvailableBody()
                ) : (
                  renderShipmentBody()
                )
              ) : (
                <View style={styles.textRow}>
                  <Text style={styles.normalText}>
                    {toUser?.username} has accepted your {offerType}
                    <Text style={styles.normalText}>
                      {' at'} {currentPrice}!
                    </Text>
                  </Text>
                </View>
              )
          }
          break
        case OFFER_DECLINED_STATUS:
          statHeading = (
            <Text style={styles.headingText}>
              {firstUpper(offerType)} Rejected
            </Text>
          )
          statBody = (
            <View style={styles.textRow}>
              <Text style={styles.normalText}>
                {`${toUser?.username} has rejected your ${offerType} at ${currentPrice}.`}
              </Text>
            </View>
          )
          break
        case OFFER_CANCELED_STATUS:
          statHeading = (
            <Text style={styles.headingText}>
              {firstUpper(offerType)} Withdrawn.
            </Text>
          )
          statBody = (
            <View style={styles.textRow}>
              <Text style={styles.normalText}>
                You've withdrawn your {offerType} at {currentPrice}.
              </Text>
            </View>
          )
          break
      }
    } else {
      // to me
      switch (hasOffer.statusId) {
        case OFFER_PENDING_STATUS:
          statHeading = isCounterOffer ? (
            <Text style={styles.headingText}>
              You have received a counter {offerType}!
            </Text>
          ) : (
            <Text style={styles.headingText}>
              Awesome! You've received a new {offerType}!
            </Text>
          )
          statBody = isCounterOffer ? (
            <View style={styles.textRow}>
              <Text style={styles.normalText}>
                {`${fromUser?.username} has made you a counter offer at ${currentPrice}. Proceed to `}
                <Text
                  data={{
                    action: 'handleAccept',
                    params: hasOffer,
                  }}
                  onPress={handleOfferAction}
                  style={styles.normalGreenText}
                  fontStyle="bold"
                >
                  accept it
                </Text>
                {' or '}
                <Text
                  data={{
                    action: 'handleCounter',
                    params: hasOffer,
                  }}
                  onPress={handleOfferAction}
                  style={styles.normalGreenText}
                  fontStyle="bold"
                >
                  counter it
                </Text>
                {' from the top product box.'}
              </Text>
            </View>
          ) : (
            <View style={styles.textRow}>
              <Text style={styles.normalText}>
                {fromUser?.username} has made {typePre} {offerType} for{' '}
                {currentPrice}.
              </Text>
            </View>
          )
          break
        case OFFER_ACCEPTED_STATUS:
          if (transactionEnded) {
            // transaction ended
            statHeading = (
              <Text style={styles.headingText}>The transaction has ended</Text>
            )
            statBody = (
              <View>
                <View style={styles.textRow}>
                  <Text style={styles.normalText}>
                    {endedByMe ? 'You have' : `${toUser?.username} has`} ended
                    this transaction and
                  </Text>
                  <Text style={styles.normalText}> marked it as{'  '}</Text>
                  <Text
                    style={
                      endedByMe
                        ? styles.normalGreenText
                        : styles.normalOrangeText
                    }
                  >
                    {transactionStatus}.
                  </Text>
                </View>
                {!didReview && (
                  <View style={styles.statActions}>
                    {/*<Button
                        data={{
                          action: 'handleRateTransaction',
                          params: {
                            transaction,
                            offer: hasOffer,
                            type: rateWho.toLowerCase()
                          }
                        }}
                        style={styles.action}
                        textStyle={styles.actionText}
                        onPress={handleOfferAction}>
                        {`Proceed To Rate ${rateWho}`}
                      </Button>*/}
                    {!endedByMe && (
                      <Button
                        outlined
                        data={{
                          action: 'handleDispute',
                          params: { transaction },
                        }}
                        style={[styles.action, styles.topSpaced]}
                        textStyle={styles.actionText}
                        onPress={handleOfferAction}
                      >
                        Dispute
                      </Button>
                    )}
                  </View>
                )}
              </View>
            )
          } else {
            statHeading =
              isPaid || isCash ? (
                hasShippingLabel ? (
                  trackingAvailable ? (
                    <Text style={styles.headingText}>
                      Your product has been shipped!
                    </Text>
                  ) : shipment ? (
                    <Text style={styles.headingText}>Ready To Ship!</Text>
                  ) : (
                    <Text style={styles.headingText}>
                      Payment Has Been Made!
                    </Text>
                  )
                ) : (
                  <Text style={styles.headingText}>Payment Confirmation</Text>
                )
              ) : (
                <Text style={styles.headingText}>
                  Congrats! You have accepted the {offerType}!
                </Text>
              )
            statBody =
              isPaid || isCash ? (
                hasShippingLabel ? (
                  renderTrackingAvailableBody()
                ) : (
                  renderShipmentBody()
                )
              ) : (
                <View style={styles.textRow}>
                  <Text style={styles.normalText}>
                    Now that you've approved the offer, look out for important
                    notifications coming up to complete the transaction.
                  </Text>
                </View>
              )
          }
          break
        case OFFER_DECLINED_STATUS:
          statHeading = (
            <Text style={styles.headingText}>
              Your have rejected this {offerType}!
            </Text>
          )
          statBody = (
            <View style={styles.textRow}>
              <Text style={styles.normalText}>
                You have rejected {fromUser?.username}'s {offerType}
                {' at'} {currentPrice}. Provide an explanation so a better{' '}
                {offerType} can be arranged!
              </Text>
            </View>
          )
          break
        case OFFER_CANCELED_STATUS:
          statHeading = (
            <Text style={styles.headingText}>
              The {offerType} has been withdrawn.
            </Text>
          )
          statBody = (
            <View style={styles.textRow}>
              <Text style={styles.normalText}>
                {fromUser?.username} has withdrawn their {offerType} at{' '}
                {currentPrice}. Send them a mesage and ask if they're still
                interested.
              </Text>
            </View>
          )
          break
      }
    }

    return isSold && !hasOffer ? null : (
      <Loading show={!initialized}>
        {initialized ? (
          <View key={'stat'} style={styles.offerStat}>
            {statHeading}
            {statBody}
          </View>
        ) : null}
      </Loading>
    )
  }

  return null
}

export default OfferProductStats
