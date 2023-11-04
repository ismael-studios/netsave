import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Keyboard,
  Image,
  ScrollView,
  KeyboardEventListener,
} from 'react-native'
import {
  Text,
  ShellButton,
  Button,
  Header,
  ShowAlert,
  HintButton,
  ModalBox,
  CheckBoxLabel,
} from '../../components'
import styles from './Styles'
import { Images, Metrics } from '../../common'
import {
  CardField,
  confirmPayment,
  useApplePay,
  useGooglePay,
} from '@stripe/stripe-react-native'
import { parsePrice } from '../../helpers/PriceHelper'
import { SendSellerOfferMessage } from '../../helpers/ChatHelper'
import currency from 'currency.js'
import CONFIG from 'react-native-config'
import * as Sentry from '@sentry/react-native'
import { useAppSelector } from '../../store/hooks'
import { usePostPaymentRequestMutation } from '../../store/slice/api/features/transaction'
import { TransactionStackScreenProps } from '../../navigation/types'

const { ifIOS, IS_IOS } = Metrics
const {
  // ACCEPTED_CARDS,
  CHECK_CIRCLE_OUTLINED,
  APPLE_PAY,
  GOOGLE_PAY,
} = Images

const OnlinePayment = ({
  navigation,
  route,
}: TransactionStackScreenProps<'OnlinePayment'>) => {
  const { transaction, address, product, offer } = route.params
  const { user } = useAppSelector((state) => state.session)
  const [futurePayment, setFuturePayment] = useState(false)
  const [cardDetails, setCardDetails] = useState({ complete: false })
  const [baseHeight, setBaseHeight] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [paid, setPaid] = useState(false)
  const [showRewardsModal, setShowRewardsModal] = useState(false)
  const [isUseRewards, setIsUseRewards] = useState(false)
  const {
    presentApplePay,
    confirmApplePayPayment,
    isApplePaySupported,
    loading: appleLoading,
  } = useApplePay()
  const {
    initGooglePay,
    presentGooglePay,
    loading: googleLoading,
  } = useGooglePay()
  const [googlePlayInitialized, setGooglePlayInitialized] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)

  const [postPaymentRequest, { isLoading }] = usePostPaymentRequestMutation()

  const enableApplePay = isApplePaySupported && IS_IOS
  const { id: transactionId } = transaction
  const { id: toAddressId } = address || {}
  const {
    userId,
    id: productId,
    previewImageUrl,
    shippingPackage,
    title,
    images,
    user: { username },
  } = product
  const { price } = offer
  const shipping =
    (toAddressId && shippingPackage && shippingPackage.price) || 0
  const canSend = Boolean(cardDetails.complete) && !paid
  const maxPoints = price * 10
  const pointsUsed = user
    ? user.rewardBalance < maxPoints
      ? user.rewardBalance
      : maxPoints
    : 0
  const pointsUsedPrice = 0.5 * pointsUsed
  const total =
    shipping +
    price -
    currency(isUseRewards ? pointsUsedPrice : 0, {
      fromCents: true,
    }).value

  const cardStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    placeholderColor: '#888888',
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    fontSize: 14,
  }
  const cardInput = {
    width: '100%',
    height: 30,
  }
  const cardPlaceHolder = {
    number: '4242 4242 4242 4242',
  }

  useEffect(() => {
    async function initialize() {
      const { error } = await initGooglePay({
        testEnv: !['production'].includes(CONFIG.ENV),
        merchantName: 'Netsave',
        countryCode: 'US',
      })

      if (error) {
        console.log(error)
        handleShowPayError('Google', error)
        return
      }
      setGooglePlayInitialized(true)
    }
    if (!IS_IOS) {
      initialize()
    }
  }, [initGooglePay])

  // effects
  useEffect(() => {
    // heads up money assurance
    setTimeout(
      () =>
        ShowAlert({
          title: 'Stay calm!',
          message:
            "Your payment is safe, and will be securely protected in the Netsave's escrow account. It will not be released to the seller until you confirm receipt of the product.",
          actions: [
            {
              name: 'Got It',
              positive: true,
            },
          ],
        }),
      1e3
    )
    // keyboard events
    const keyboardWillShow = Keyboard.addListener(
      'keyboardWillShow',
      handleKeyboardShow
    )
    const keyboardWillHide = Keyboard.addListener(
      'keyboardWillHide',
      handleKeyboardHide
    )
    return () => {
      // => unmounted
      keyboardWillShow.remove()
      keyboardWillHide.remove()
    }
  }, [])

  // handlers / methods
  const handleKeyboardShow: KeyboardEventListener = (event) => {
    const {
      endCoordinates: { height },
    } = event
    setBaseHeight(height)
  }

  const handleKeyboardHide = () => {
    setBaseHeight(0)
  }

  const handleCheck = (value: boolean) => {
    setFuturePayment(value)
  }

  const handlePayment = async () => {
    setProcessing(true)
    const body = shipping
      ? {
          type: 'SHIPPING' as const,
          toAddressId,
          points: isUseRewards ? pointsUsed : 0,
        }
      : {
          type: 'LOCAL_ONLINE' as const,
          points: isUseRewards ? pointsUsed : 0,
        }
    try {
      const { clientSecret } = await postPaymentRequest({
        userId,
        productId,
        transactionId,
        data: body,
      }).unwrap()

      // Confirm the payment with the card details
      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        type: 'Card',
      })
      if (error) {
        console.log('Payment confirmation error', error)
        ShowAlert({
          title: 'Sorry!',
          message: error.message,
          actions: [
            {
              name: 'Okay',
              positive: true,
              callback: handleViewSellerChat,
            },
          ],
        })
      } else if (paymentIntent) {
        console.log('Success from promise', paymentIntent)
        handleShowSuccess()
      }
    } catch (err) {
      ShowAlert({
        title: 'Sorry!',
        message: err.data.message,
        actions: [
          {
            name: 'Try again.',
            positive: true,
          },
        ],
      })
    }
    setProcessing(false)
    //  ShowAlert({
    //    title:title,
    //    message:'Payment protected. Show code to the seller only',
    //    actions:[{
    //      name:'Show code to seller',
    //      positive:true
    //    }]
    //  })
  }

  const handleGooglePay = async () => {
    if (!googlePlayInitialized) return
    const body = shipping
      ? {
          type: 'SHIPPING' as const,
          toAddressId,
          points: isUseRewards ? pointsUsed : 0,
        }
      : {
          type: 'LOCAL_ONLINE' as const,
          points: isUseRewards ? pointsUsed : 0,
        }
    const { clientSecret } = await postPaymentRequest({
      userId,
      productId,
      transactionId,
      data: body,
    }).unwrap()

    const { error: presentError } = await presentGooglePay({
      clientSecret,
      forSetupIntent: false,
    })

    if (presentError) {
      console.log('Google Pay Error:', presentError)
      if (presentError && !presentError.message.includes('canceled')) {
        handleShowPayError('Google', presentError)
      }
      return
    }

    handleShowSuccess()
    setGooglePlayInitialized(false)
  }

  const handleApplePay = async () => {
    if (!enableApplePay) return
    const { error } = await presentApplePay({
      cartItems: [
        {
          label: `${username} (via Netsave)`,
          amount: currency(total).toString(),
        },
      ],
      country: 'US',
      currency: 'USD',
    })

    if (error) {
      // handle error
      console.log('Apple Pay Error:', error)
      if (error.code !== 'Canceled') {
        handleShowPayError('Apple', error)
      }
    } else {
      // success
      const body = shipping
        ? {
            type: 'SHIPPING' as const,
            toAddressId,
            points: isUseRewards ? pointsUsed : 0,
          }
        : {
            type: 'LOCAL_ONLINE' as const,
            points: isUseRewards ? pointsUsed : 0,
          }
      const { clientSecret } = await postPaymentRequest({
        userId,
        productId,
        transactionId,
        data: body,
      }).unwrap()

      const { error: confirmError } = await confirmApplePayPayment(clientSecret)
      if (confirmError) {
        // handle error
        console.log('Apple Pay Error:', confirmError)
        handleShowPayError('Apple', confirmError)
      } else {
        // success
        console.log('Apple Pay Success!')
        handleShowSuccess()
      }
    }
  }

  const handleShowPayError = (platform: string, error: any) => {
    setTimeout(
      () =>
        ShowAlert({
          title: 'Sorry!',
          message: `There was a problem processing your ${platform} Pay.`,
          actions: [
            {
              name: 'Try again.',
              positive: true,
            },
          ],
        }),
      1e3
    )

    Sentry.captureMessage(JSON.stringify(error), Sentry.Severity.Error)
  }

  const handleShowSuccess = () => {
    SendSellerOfferMessage(
      user,
      offer,
      '[Payment Made] for ' + parsePrice(total)
    )
    setPaid(true)
    setTimeout(
      () =>
        ShowAlert({
          icon: CHECK_CIRCLE_OUTLINED,
          title: 'Payment Successful!',
          message: `Congrats, you've just purchased the product. ${
            toAddressId
              ? "We'll notify you once your product has been shipped."
              : ''
          }`,
          actions: [
            {
              name: 'Okay',
              positive: true,
              callback: handleViewSellerChat,
            },
          ],
        }),
      600
    )
  }

  const handleViewSellerChat = () => {
    navigation.navigate('Main', {
      screen: 'Chat',
    })
  }

  const handleGoToTerms = () =>
    navigation.navigate('WebScreen', {
      uri: 'https://netsave.com/terms?source=webview',
    })

  const handleGoToPrivacy = () =>
    navigation.navigate('WebScreen', {
      uri: 'https://netsave.com/privacy?source=webview',
    })

  const handleToggleRewardsModal = () => {
    setShowRewardsModal(!showRewardsModal)
  }

  return (
    <View style={[styles.container, { paddingBottom: baseHeight }]}>
      <Header
        showBack
        bordered
        avoidMode
        title={'Payment'}
        style={styles.header}
      />
      <View style={styles.scrollerContainer}>
        <ScrollView ref={scrollViewRef}>
          <View style={styles.topSpacer}>
            <View style={styles.paymentContainer}>
              {previewImageUrl ? (
                <Image
                  source={{
                    uri: previewImageUrl,
                  }}
                  style={styles.productImage}
                />
              ) : null}
              <View style={styles.textRow}>
                <Text
                  fontSize="standard"
                  style={styles.productName}
                  numberOfLines={1}
                >
                  {title}
                </Text>
                <Text fontStyle="bold" fontSize="standard">
                  {parsePrice(price)}
                </Text>
              </View>
              <View style={styles.textRow}>
                <Text fontSize="standard">Shipping</Text>
                <Text fontStyle="bold" fontSize="standard">
                  {parsePrice(shipping)}
                </Text>
              </View>
              {price >= 50 ? (
                <>
                  <View style={styles.textRow}>
                    <Text fontSize="standard">Sub total</Text>
                    <Text fontStyle="bold" fontSize="standard">
                      {currency(price + shipping).format()}
                    </Text>
                  </View>
                  <View style={styles.rewardInput}>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <CheckBoxLabel
                        tight
                        small
                        active={isUseRewards}
                        disabled={pointsUsed < 1}
                        onChange={(active) => setIsUseRewards(active)}
                      />
                      {pointsUsed > 0 ? (
                        <>
                          <Text
                            fontSize="standard"
                            fontStyle="bold"
                            color="orange"
                          >
                            -
                            {currency(pointsUsedPrice, {
                              fromCents: true,
                            }).format()}{' '}
                            Off
                          </Text>
                          <Text fontSize="standard">
                            {' '}
                            - Use {pointsUsed} Points
                          </Text>
                        </>
                      ) : (
                        <Text fontSize="standard">0 Points</Text>
                      )}
                    </View>
                    <HintButton
                      hitSize={10}
                      onPress={handleToggleRewardsModal}
                    />
                  </View>
                  <View style={styles.textRow}>
                    <Text fontSize="standard">Reward Savings</Text>
                    <Text fontStyle="bold" fontSize="standard">
                      -
                      {currency(isUseRewards ? pointsUsedPrice : 0, {
                        fromCents: true,
                      }).format()}
                    </Text>
                  </View>
                </>
              ) : null}

              <View style={styles.textRow}>
                <Text fontSize="standard" fontStyle="bold">
                  Total:
                </Text>
                <Text fontSize="h1" color="green" fontStyle="bold">
                  {currency(total).format()}
                </Text>
              </View>
              <View style={styles.paymentActions}>
                <ShellButton
                  disabled={
                    ifIOS(
                      !enableApplePay || appleLoading,
                      !googlePlayInitialized || googleLoading
                    ) || cardDetails.complete
                  }
                  style={styles.payButton}
                  onPress={ifIOS(handleApplePay, handleGooglePay)}
                >
                  <Image
                    source={ifIOS(APPLE_PAY, GOOGLE_PAY)}
                    style={styles.payImage}
                  />
                </ShellButton>
              </View>
              <View style={styles.alternative}>
                <Text style={styles.orPay}>or pay with cards</Text>
                <View style={styles.centerBorder} />
              </View>
              <View style={styles.cardForm}>
                <View style={styles.formRow}>
                  <CardField
                    postalCodeEnabled={false}
                    placeholder={cardPlaceHolder}
                    cardStyle={cardStyle}
                    style={cardInput}
                    onCardChange={setCardDetails}
                    onFocus={(focusedField) => {
                      setTimeout(() => {
                        if (scrollViewRef.current) {
                          scrollViewRef.current.scrollToEnd({ animated: true })
                        }
                      }, 100)
                    }}
                  />
                  {/*
                    <Input
                      style={styles.input}
                      placeholder='Card number'
                      keyboardType='numeric'
                      rightElement={(
                      <Image source={ACCEPTED_CARDS} style={styles.acceptedCards} />
                    )}
                    />
                  */}
                </View>
                {/*
                  <View style={styles.formRow}>
                    <Input
                      style={[styles.inputHalf, styles.inputSpaced]}
                      keyboardType='numeric'
                      placeholder='MM/DD/YYYY'
                    />
                    <Input
                      style={styles.inputHalf}
                      keyboardType='numeric'
                      placeholder='CVC'
                    />
                  </View>
                */}
                {/*
                  <View style={styles.formRow}>
                    <CheckBoxLabel
                      tight
                      small
                      label='Save card for future payment'
                      data='isShipping'
                      active={futurePayment}
                      onChange={handleCheck}
                    />
                  </View>
                */}
                <Button
                  tight
                  disabled={!canSend}
                  loading={
                    isLoading || processing || appleLoading || googleLoading
                  }
                  style={styles.nextButton}
                  onPress={handlePayment}
                >
                  {`Pay ${parsePrice(total)}`}
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={styles.actions}>
        <Text fontSize="small" color="darkgray" style={{ marginBottom: 10 }}>
          Warning: You're about to make a purchase of {title} from {username}{' '}
          through Netsave. Please confirm this transaction by clicking the pay
          button below.
        </Text>
        <View style={styles.footnote}>
          <View style={styles.inline}>
            <Text fontSize="small">{'By proceeding, you agree to our '}</Text>
            <ShellButton onPress={handleGoToTerms}>
              <Text fontSize="small" color="green" fontStyle="bold">
                Terms of Services
              </Text>
            </ShellButton>
          </View>
        </View>
      </View>

      <ModalBox
        onHide={handleToggleRewardsModal}
        visible={showRewardsModal}
        title="Use of Points"
      >
        <View style={styles.pointsInfoView}>
          <Text fontSize="standard" paragraph>
            - Points can only be credited via in-app purchases with electronic
            payments
          </Text>
          <Text fontSize="standard" paragraph>
            - Maximum of 10 points to be credited for each $1.00 of the purchase
            price
          </Text>
          <Text fontSize="standard" paragraph>
            - Transaction eligibility: Minimum purchase amount of $50 is
            required to use the point credits
          </Text>
          <Text fontSize="standard" paragraph>
            - Minimum of 2 points or 1 cent is required for any transaction
            using the point credits
          </Text>
        </View>
        <Button tight block onPress={handleToggleRewardsModal}>
          Got It
        </Button>
      </ModalBox>
    </View>
  )
}

export default OnlinePayment
