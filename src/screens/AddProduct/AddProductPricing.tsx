import React, { useEffect, useRef, useState } from 'react'
import { View, KeyboardAvoidingView } from 'react-native'

import {
  Text,
  Button,
  Header,
  ModalBox,
  ScrollView,
  ShellButton,
  ProgressSteps,
  HintButton,
  Input,
} from '../../components'
import RadioForm from 'react-native-simple-radio-button'
import styles from './Styles'
import { formatPrice, parsePrice } from '../../helpers/PriceHelper'
import { Colors } from '../../common'
import Metrics from '../../common/Metrics'
import { useAppSelector } from '../../store/hooks'
import { useUpdateProductMutation } from '../../store/slice/api/features/product'
import { PostListingStackScreenProps } from '../../navigation/types'

const { ifIOS, IS_ANDROID } = Metrics

const AddProductPricing = ({
  navigation,
  route,
}: PostListingStackScreenProps<'AddProductPricing'>) => {
  const { user } = useAppSelector((state) => state.session)
  const { product, isEditMode } = route.params
  const [productId, setProductId] = useState(product.id)
  const [price, setPrice] = useState('0.00')
  const [retailPrice, setRetailPrice] = useState('0.00')
  const [isNegotiable, setIsNegotiable] = useState(true)
  const [isPublished, setIsPublished] = useState(false)
  const [showRetailModal, setShowRetailModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [showVisibilityModal, setShowVisibilityModal] = useState(false)

  const [updateProduct, { isLoading }] = useUpdateProductMutation()

  useEffect(() => {
    if (isEditMode) {
      setPrice(parsePrice(product.price, true, true))
      setRetailPrice(parsePrice(product.retailPrice, true, true))
      setIsNegotiable(
        product.isNegotiable === null ? true : product.isNegotiable
      )
      setIsPublished(product.isPublished)
    }
  }, [])

  const retailModalRef = useRef()
  const locationModalRef = useRef()
  const visibilityModalRef = useRef()

  const handleToggleRetailModal = () => setShowRetailModal(!showRetailModal)
  const handleToggleLocationModal = () =>
    setShowLocationModal(!showLocationModal)
  const handleToggleVisibilityModal = () =>
    setShowVisibilityModal(!showVisibilityModal)

  const handleContinue = async ({ redirectCallback }) => {
    if (!user) {
      return
    }
    try {
      const updatedProduct = await updateProduct({
        userId: user.id,
        product: {
          id: productId,
          price: parsePrice(price, true),
          retailPrice: parsePrice(retailPrice, true),
          isNegotiable,
          isPublished,
          images: [],
        },
      }).unwrap()

      if (!redirectCallback) {
        if (isEditMode) {
          navigation.navigate('ProductDetails', {
            product: updatedProduct,
            productId: updatedProduct.id,
            userId: updatedProduct.userId,
          })
        } else {
          navigation.navigate('AddProductDelivery', {
            product: updatedProduct,
            isEditMode,
          })
        }
      } else redirectCallback(updatedProduct)
    } catch (err) {
      console.warn(err)
    }
  }

  const handleNext = async () => {
    if (!user) {
      return
    }
    try {
      const updatedProduct = await updateProduct({
        userId: user.id,
        product: {
          id: productId,
          price: parsePrice(price, true),
          retailPrice: parsePrice(retailPrice, true),
          isNegotiable,
          isPublished,
          images: [],
        },
      }).unwrap()
      navigation.navigate('AddProductDelivery', {
        product: updatedProduct,
        isEditMode,
      })
    } catch (err) {
      console.warn(err)
    }
  }

  const handleSave = () => {
    handleContinue({
      redirectCallback: handleLeaveScreen,
    })
  }

  const handleLeaveScreen = () => {
    navigation.navigate('Drafts')
  }

  const handleChangeLocation = () => {
    navigation.navigate('LocationSettings', {
      SourceScreen: 'AddProductPricing',
    })
  }

  const handleProfileSettings = () => {
    navigation.navigate('ProfileSettings')
  }

  const handleMoreScreen = () => {
    navigation.navigate('MoreScreen')
  }

  const handlePriceChange = (value: string) => {
    const isValidInput = (parseFloat(value) || 0) <= 999999999

    if (isValidInput) {
      setPrice(formatPrice(value))
    }
  }

  const handleRetailPriceChange = (value: string) => {
    const isValidInput = (parseFloat(value) || 0) <= 999999999

    if (isValidInput) {
      setRetailPrice(formatPrice(value))
    }
  }

  const handleFocusPrice = () => {
    const priceNumber = parsePrice(price, true)
    if (priceNumber) {
      setPrice(`${priceNumber.toFixed(price.match(/\.{1}00/) ? 0 : 2)}`)
    } else {
      setPrice('')
    }
  }

  const handleFocusRetailPrice = () => {
    const priceNumber = parsePrice(retailPrice, true)
    if (priceNumber) {
      setRetailPrice(
        `${priceNumber.toFixed(retailPrice.match(/\.{1}00/) ? 0 : 2)}`
      )
    } else {
      setRetailPrice('')
    }
  }

  const handlePriceBlur = () => setPrice(parsePrice(price, true, true))
  const handleRetailPriceBlur = () =>
    setRetailPrice(parsePrice(retailPrice, true, true))

  const renderLabel = (label, label2, okay, color = 'green') => {
    return (
      <Text>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.label} color={okay ? color : 'orange'}>
          {label2}
        </Text>
      </Text>
    )
  }

  const canSend = Boolean(parsePrice(price, true))

  return (
    <KeyboardAvoidingView
      style={styles.avoidView}
      behavior={ifIOS('padding', 'height')}
    >
      <View style={styles.container}>
        <Header
          bordered
          avoidMode
          title={`${isEditMode ? 'Edit' : 'Add'} Listing Price`}
          showBack
          style={styles.header}
        />
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.topSpacer}>
              <View style={styles.subContainer}>
                <View style={styles.formRow}>
                  <Input
                    leftElement={<Text style={styles.dollarSign}>$</Text>}
                    style={[styles.input]}
                    inputStyle={styles.inputText}
                    label={renderLabel('Price', '*', canSend)}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    value={price}
                    onBlur={handlePriceBlur}
                    onChangeText={handlePriceChange}
                    onFocus={handleFocusPrice}
                  />
                </View>
                <View style={styles.formRow}>
                  <View style={styles.retailHint}>
                    <HintButton
                      hitSize={10}
                      onPress={handleToggleRetailModal}
                    />
                  </View>
                  <Input
                    leftElement={<Text style={styles.dollarSign}>$</Text>}
                    style={[styles.input]}
                    inputStyle={styles.inputText}
                    label={renderLabel('Retail Value (optional)')}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    value={retailPrice}
                    onBlur={handleRetailPriceBlur}
                    onChangeText={handleRetailPriceChange}
                    onFocus={handleFocusRetailPrice}
                  />
                </View>
                <View>
                  {renderLabel('Negotiation')}
                  <RadioForm
                    radio_props={[
                      { label: 'Buyers can negotiate on price', value: true },
                      { label: 'Price is non-negotiable', value: false },
                    ]}
                    style={styles.radios}
                    buttonColor={Colors.green}
                    selectedButtonColor={Colors.green}
                    selectedLabelColor={Colors.green}
                    buttonSize={12}
                    buttonOuterSize={25}
                    labelColor={Colors.darkGray}
                    labelStyle={styles.radioLabel}
                    initial={isNegotiable === true ? 0 : 1}
                    animation={!IS_ANDROID}
                    onPress={setIsNegotiable}
                  />
                </View>
                {/*
                    <View style={styles.formRow}>
                      <View style={styles.pickupHint}>
                        <HintButton
                          hitSize={10}
                          onPress={this.handleToggleLocationModal}
                        />
                      </View>
                      {this.renderLabel('Pickup Location')}
                      <Text style={styles.locationText}>
                        {user.city}, {user.region}
                      </Text>
                    </View>
                  */}
                {/*
                    <View>
                      <View style={styles.visibilityHint}>
                        <HintButton
                          hitSize={10}
                          onPress={this.handleToggleVisibilityModal}
                        />
                      </View>
                      {this.renderLabel('Product Visibility')}
                      <RadioForm
                        radio_props={[
                          { label: 'Public', value: true },
                          { label: 'Private (only you can see)', value: false }
                        ]}
                        style={styles.radios}
                        buttonColor={Colors.green}
                        selectedButtonColor={Colors.green}
                        selectedLabelColor={Colors.green}
                        buttonSize={12}
                        buttonOuterSize={25}
                        labelColor={Colors.darkGray}
                        labelStyle={styles.radioLabel}
                        initial={isPublished === true ? 0 : 1}
                        animation={!IS_ANDROID}
                        onPress={this.setChangeValue('isPublished')}
                      />
                    </View>
                  */}
              </View>
            </View>
          </ScrollView>
        </View>
        <ProgressSteps current={2} total={4} />
        <View style={styles.actionsRow}>
          <Button
            tight
            outlined
            style={styles.draftButton}
            loading={isLoading}
            onPress={handleSave}
          >
            {isPublished ? 'Save & Exit' : 'Save Draft'}
          </Button>
          <Button
            tight
            style={styles.nextButton}
            disabled={!canSend}
            loading={isLoading}
            onPress={handleNext}
          >
            Next
          </Button>
        </View>
      </View>
      <ModalBox
        onHide={handleToggleRetailModal}
        visible={showRetailModal}
        ref={retailModalRef}
        title={'Retail Value'}
      >
        <View style={styles.formRow}>
          <Text style={styles.hintText}>
            Enter the price retailers might ask for a similar item, based on its
            quality, condition & location. Buyers will then know how much of a
            steal it is to buy your item!
          </Text>
        </View>
        <Button
          tight
          block
          onPress={handleToggleRetailModal}
          style={styles.hintButton}
        >
          {'Got It'}
        </Button>
      </ModalBox>
      <ModalBox
        onHide={handleToggleLocationModal}
        visible={showLocationModal}
        ref={locationModalRef}
        title={'Pickup Location'}
      >
        <View style={styles.formRow}>
          <Text style={styles.hintText}>
            Pickup location is based on your last updated location.
          </Text>
        </View>
        <View style={styles.formRow}>
          <View style={styles.textRow}>
            <Text style={styles.hintText}>
              To change your location, go to the{' '}
            </Text>
            <ShellButton onPress={handleMoreScreen}>
              <Text style={styles.hintGreenText}>
                "More" <Text style={styles.hintText}>screen</Text>
              </Text>
            </ShellButton>
            <Text style={styles.hintText}> and select </Text>
            <ShellButton onPress={handleProfileSettings}>
              <Text style={styles.hintGreenText}>"My Profile Settings"</Text>
            </ShellButton>
            <Text style={styles.hintText}>, then </Text>
            <ShellButton onPress={handleChangeLocation}>
              <Text style={styles.hintGreenText}>"Location Services"</Text>
            </ShellButton>
            <Text style={styles.hintText}>.</Text>
          </View>
        </View>
        <Button
          tight
          block
          onPress={handleToggleLocationModal}
          style={styles.hintButton}
        >
          {'Got It'}
        </Button>
      </ModalBox>
      <ModalBox
        onHide={handleToggleVisibilityModal}
        visible={showVisibilityModal}
        ref={visibilityModalRef}
        title={'Post Visibility'}
      >
        <View style={styles.formRow}>
          <Text style={styles.hintText}>
            When "public" is selected, your post can be seen by all users when
            published.
          </Text>
        </View>
        <View style={styles.formRow}>
          <Text style={styles.hintText}>
            If you don't want anyone to see or simply want to take a public post
            down, change it to "private".
          </Text>
        </View>
        <Button
          tight
          block
          onPress={handleToggleVisibilityModal}
          style={styles.hintButton}
        >
          {'Got It'}
        </Button>
      </ModalBox>
    </KeyboardAvoidingView>
  )
}

export default AddProductPricing
