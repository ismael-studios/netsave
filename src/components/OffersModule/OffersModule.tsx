import React, { Fragment, useState, useRef, useEffect } from 'react'
import { TextInput, View } from 'react-native'
import styles from './Styles'
import Text from '../Text'
import Button from '../Button'
import Input from '../Input'
import ModalBox from '../ModalBox'
import { ApiConstants } from '../../services'
import {
  SendSellerOfferMessage,
  SendBuyerOfferMessage,
} from '../../helpers/ChatHelper'
import { formatPrice, parsePrice } from '../../helpers/PriceHelper'
import { useAppSelector } from '../../store/hooks'
import {
  usePostOfferMutation,
  usePutOfferMutation,
} from '../../store/slice/api/features/offer'

const {
  OFFER_PENDING_STATUS,
  OFFER_ACCEPTED_STATUS,
  OFFER_DECLINED_STATUS,
  OFFER_CANCELED_STATUS,
} = ApiConstants

const initialState = {
  action: null,
  userId: null,
  productId: null,
  offerId: null,
  inputText: '',
  priceText: '$0.00',
  isNegotiable: true,
  offerPrice: 0,
  maxPrice: 0,
}

export interface OffersModuleConfig {
  action: 'create' | 'buy' | 'accept' | 'decline' | 'cancel' | 'counter'
  price: number
  userId: string
  productId: string
  offerId?: string
  isNegotiable?: boolean
  maxPrice?: number
}
interface OffersModuleProps {
  config: OffersModuleConfig
}

const OffersModule = ({ config }: OffersModuleProps) => {
  const { user } = useAppSelector((state) => state.session)

  const [inputText, setInputText] = useState('')
  const [priceText, setPriceText] = useState('$0.00')
  const [offerPrice, setOfferPrice] = useState(0)

  const input = useRef<TextInput>(null)
  const priceInput = useRef<TextInput>(null)
  const buyModal = useRef()
  const createModal = useRef()
  const acceptModal = useRef()
  const declineModal = useRef()
  const cancelModal = useRef()
  const counterModal = useRef()

  const [postOffer, { isLoading: isLoadingPostOffer }] = usePostOfferMutation()
  const [putOffer, { isLoading: isLoadingPutOffer }] = usePutOfferMutation()
  const loading = isLoadingPostOffer || isLoadingPutOffer

  const { userId, productId, offerId, isNegotiable, maxPrice } = config

  useEffect(() => {
    if (config) {
      const { action, price } = config
      setInputText('')
      setPriceText(parsePrice(price))
      setOfferPrice(price)

      switch (action) {
        case 'create':
          createModal.current?.show()
          break
        case 'buy':
          buyModal.current?.show()
          break
        case 'accept':
          acceptModal.current?.show()
          break
        case 'decline':
          declineModal.current?.show()
          break
        case 'cancel':
          cancelModal.current?.show()
          break
        case 'counter':
          counterModal.current?.show()
          break
      }
    }
  }, [config])

  // methods
  const resetModule = () => {
    setOfferPrice(0)
    setInputText('')
    setPriceText('$0.00')
  }

  const offerType = isNegotiable ? 'Offer' : 'Purchase Request'

  // handlers
  const handleCreateOffer = async () => {
    // buyer creates offer
    const price = handleParsePrice(priceText, true)
    if (price) {
      const NewOffer = await postOffer({
        userId,
        productId,
        data: {
          description: inputText,
          price,
        },
      }).unwrap()
      createModal.current?.hide()
      const verbText = NewOffer.product.isNegotiable
        ? 'Offer'
        : 'Purchase Request'
      const createdMessage = `New ${verbText} received for $${NewOffer.price}\n${NewOffer.description}`
      SendSellerOfferMessage(user, NewOffer, createdMessage)
      resetModule()
    } else {
      alert('Please enter an actual offer amount.')
    }
  }

  const handleBuyNow = async () => {
    // buyer creates offer
    const NewOffer = await postOffer({
      userId,
      productId,
      data: {
        description: inputText,
        price: handleParsePrice(priceText, true),
      },
    }).unwrap()
    buyModal.current?.hide()
    const { price, description, product } = NewOffer
    const verbText = product.isNegotiable ? 'Offer' : 'Purchase Request'
    const createdMessage = `New ${verbText} received for $${price}\n${inputText}`
    SendSellerOfferMessage(user, NewOffer, createdMessage)
    resetModule()
  }

  const handleAcceptOffer = async () => {
    // seller accepts offer
    const Offer = await putOffer({
      userId,
      productId,
      offerId,
      data: {
        statusId: OFFER_ACCEPTED_STATUS,
        response: inputText,
      },
    }).unwrap()
    acceptModal.current?.hide()
    const verbText = Offer.product.isNegotiable
      ? (Offer.previousOfferId ? 'Counter ' : '') + 'Offer'
      : 'Purchase Request'
    const message = `[${verbText} Accepted] for $${Offer.price}\n${inputText}`
    if (userId === user?.id) {
      // is seller
      SendBuyerOfferMessage(user, Offer, message)
    } else {
      // is buyer
      SendSellerOfferMessage(user, Offer, message)
    }
    resetModule()
  }

  const handleDeclineOffer = async () => {
    // seller declines offer
    if (offerId) {
      const Offer = await putOffer({
        userId,
        productId,
        offerId,
        data: {
          statusId: OFFER_DECLINED_STATUS,
          response: inputText,
        },
      }).unwrap()

      declineModal.current?.hide()
      const verbText = Offer.product.isNegotiable
        ? (Offer.previousOfferId ? 'Counter ' : '') + 'Offer'
        : 'Purchase Request'
      const message = `${verbText} Rejected for $${Offer.price}\n${inputText}`
      if (userId === user?.id) {
        // is seller
        SendBuyerOfferMessage(user, Offer, message)
      } else {
        // is buyer
        SendSellerOfferMessage(user, Offer, message)
      }
      resetModule()
    }
  }

  const handleCancelOffer = async () => {
    // buyer cancels offer
    if (offerId) {
      const Offer = await putOffer({
        userId,
        productId,
        offerId,
        data: {
          statusId: OFFER_CANCELED_STATUS,
          response: inputText,
        },
      }).unwrap()
      cancelModal.current?.hide()
      const verbText = Offer.product.isNegotiable
        ? (Offer.previousOfferId ? 'Counter ' : '') + 'Offer'
        : 'Purchase Request'
      const message = `[${verbText} Withdrawn] for $${Offer.price}\n${inputText}`
      if (userId === user?.id) {
        // is seller
        SendBuyerOfferMessage(user, Offer, message)
      } else {
        // is buyer
        SendSellerOfferMessage(user, Offer, message)
      }
      resetModule()
    }
  }

  const handleCounterOffer = async () => {
    // counter offer
    if (offerId) {
      const isSeller = userId === user?.id
      const price = handleParsePrice(priceText, true)
      if (isSeller && price <= offerPrice) {
        alert('Your counter must be greater than the current offer price.')
      } else if (!isSeller && price >= offerPrice) {
        alert('Your counter must be less than the current offer price.')
      } else {
        const Offer = await putOffer({
          userId,
          productId,
          offerId,
          data: {
            statusId: OFFER_DECLINED_STATUS,
            response: inputText,
            counterDescription: inputText,
            counterPrice: price,
          },
        }).unwrap()
        counterModal.current?.hide()
        const message = `[Counter Offer] for $${Offer.price}\n${inputText}`
        if (isSeller) {
          // is seller
          SendBuyerOfferMessage(user, Offer, message)
        } else {
          // is buyer
          SendSellerOfferMessage(user, Offer, message)
        }
        resetModule()
      }
    }
  }

  const handleInputText = (value: string) => {
    setInputText(value.replace(/^(  )|(  )/, ' '))
  }

  const handlePriceInputText = (priceText: string) => {
    setPriceText(formatPrice(priceText))
  }

  const handlePriceBlur = () => {
    setPriceText(handleParsePrice(priceText))
  }

  const handleParsePrice = (price, sendNumber) => {
    const pricePoint = parsePrice(price, true)
    return parsePrice(pricePoint > maxPrice ? maxPrice : pricePoint, sendNumber)
  }

  const handlePriceFocus = () => {
    const priceNumber = parsePrice(priceText, true)
    if (priceNumber) {
      setPriceText(`${priceNumber.toFixed(priceText.match(/\.00/) ? 0 : 2)}`)
    } else {
      setPriceText('')
    }
  }

  // renderers
  const renderInput = (placeholder: string) => {
    return (
      <Input
        multiline
        autoFocus={!isNegotiable}
        numberOfLines={3}
        selectTextOnFocus
        placeholder={placeholder}
        value={inputText}
        style={styles.input}
        inputStyle={styles.inputText}
        ref={input}
        onChangeText={handleInputText}
      />
    )
  }

  const renderPrice = (isDisabled: boolean) => {
    return isDisabled ? (
      <View style={styles.priceWrapper}>
        <Text center style={[styles.priceInputText, styles.transparentPrice]}>
          {priceText}
        </Text>
      </View>
    ) : (
      <Input
        center
        autoFocus={!isDisabled}
        keyboardType={'numeric'}
        value={priceText}
        style={styles.priceInput}
        inputStyle={styles.priceInputText}
        ref={priceInput}
        onChangeText={handlePriceInputText}
        onBlur={handlePriceBlur}
        onFocus={handlePriceFocus}
      />
    )
  }

  const renderButton = (buttonText, callback) => {
    return (
      <View style={styles.buttons}>
        <Button
          block
          loading={loading}
          style={styles.button}
          onPress={callback}
        >
          {buttonText}
        </Button>
      </View>
    )
  }

  const renderBuyNowOffer = () => {
    return (
      <ModalBox ref={buyModal} title={''}>
        <View style={styles.textRow}>
          <Text center fontSize={'h4'} fontStyle="bold">
            Proceed to "Buy Now" this product?
          </Text>
        </View>
        <View>
          <Text style={styles.text}>
            This offer will be accepted automatically and can't be undone.
          </Text>
        </View>
        {renderButton('Buy Now', handleBuyNow)}
      </ModalBox>
    )
  }

  const renderCreateOffer = () => {
    const verbText = `Make ${offerType}`
    const title = `New ${offerType}`
    return (
      <ModalBox ref={createModal} title={title}>
        {renderPrice(!isNegotiable)}
        {renderInput(
          `• Add instructions if any\n• State terms of this ${offerType} if any`
        )}
        {renderButton(verbText, handleCreateOffer)}
      </ModalBox>
    )
  }

  const renderAcceptOffer = () => {
    const verbText = `Accept ${offerType}`
    return (
      <ModalBox ref={acceptModal} title={`${verbText}:`}>
        {renderPrice(true)}
        {renderInput(
          '• When and where to pick up\n• Special instructions if any'
        )}
        {renderButton(verbText, handleAcceptOffer)}
      </ModalBox>
    )
  }

  const renderDeclineOffer = () => {
    const verbText = `Reject ${offerType}`
    return (
      <ModalBox ref={declineModal} title={`${verbText}:`}>
        {renderPrice(true)}
        {renderInput(
          `• State why this ${offerType} is being rejected\n• State terms of a counter ${offerType} if any`
        )}
        {renderButton(verbText, handleDeclineOffer)}
      </ModalBox>
    )
  }

  const renderCancelOffer = () => {
    const verbText = `Withdraw ${offerType}`
    return (
      <ModalBox ref={cancelModal} title={verbText}>
        {renderPrice(true)}
        {renderInput(`• State why you are withdrawing this ${offerType}`)}
        {renderButton(verbText, handleCancelOffer)}
      </ModalBox>
    )
  }

  const renderCounterOffer = () => {
    const verbText = `Counter ${offerType}`
    return (
      <ModalBox ref={counterModal} title={`${verbText}:`}>
        {renderPrice(false)}
        {renderInput(`• State a great counter reason\n• Sell your offer price`)}
        {renderButton(`Make ${verbText}`, handleCounterOffer)}
      </ModalBox>
    )
  }

  return (
    <Fragment>
      {renderBuyNowOffer()}
      {renderCreateOffer()}
      {renderAcceptOffer()}
      {renderDeclineOffer()}
      {renderCancelOffer()}
      {renderCounterOffer()}
    </Fragment>
  )
}

export default OffersModule
