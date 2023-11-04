import React, { useState } from 'react'
import { View, Image } from 'react-native'
import {
  Text,
  Button,
  Header,
  ScrollView,
  ShowAlert,
  ProgressSteps,
  CheckBoxLabel,
} from '../../components'
import styles from './Styles'
import Collapsible from 'react-native-collapsible'
import { Images } from '../../common'
import { useAppSelector } from '../../store/hooks'
import { useUpdateProductMutation } from '../../store/slice/api/features/product'
import { PostListingStackScreenProps } from '../../navigation/types'

const { POWERED_BY_STRIPE } = Images

const AddProductPayment = ({
  navigation,
  route,
}: PostListingStackScreenProps<'AddProductPayment'>) => {
  const { product, isEditMode } = route.params
  const { isLocalOnline, isLocalCash, isShipping, isLocal, isPublished } =
    product
  const disableCash = isShipping && !isLocal

  const [isOnline, setIsOnline] = useState(
    Boolean(isLocalOnline || disableCash || isShipping)
  )
  const [isCash, setIsCash] = useState(
    Boolean(disableCash ? false : isLocalCash)
  )

  const canSend = isOnline || isCash
  const { user } = useAppSelector((state) => state.session)
  const [updateProduct, { isLoading }] = useUpdateProductMutation()
  const appLoading = isLoading

  const handleCheck = (active: boolean, data: string) => {
    switch (data) {
      case 'isOnline':
        setIsOnline(active)
        break
      case 'isCash':
        setIsCash(active)
        break
    }
  }

  const handleContinue = async (leave?: boolean) => {
    if (!user) {
      return
    }
    try {
      const updatedProduct = await updateProduct({
        userId: user.id,
        product: {
          id: product.id,
          isLocalOnline: isOnline,
          isLocalCash: isCash,
        },
      }).unwrap()

      if (leave) {
        navigation.navigate('Drafts')
      } else {
        navigation.navigate('PreviewProductDetails', {
          isEditing: isEditMode,
          previewMode: true,
          product: updatedProduct,
          productId: updatedProduct.id,
          userId: updatedProduct.userId,
        })
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const handlePreviewProduct = () => {
    handleContinue()
  }

  const handleSaveAsDraft = () => {
    handleContinue(true)
  }

  const handleStripeAgreement = () => {
    navigation.navigate('WebScreen', {
      uri: 'https://stripe.com/connect-account/legal',
    })
  }

  const handleNetsaveAgreement = () => {
    navigation.navigate('WebScreen', {
      uri: 'https://netsave.com/terms?source=webview',
    })
  }

  const handleSmallFeePopup = () => {
    ShowAlert({
      title: 'Secure online payment fee',
      message: (
        <Text fontSize="standard">
          <Text paragraph fontSize="standard">
            The secure online payment service fee is 9.95% of the product sale
            price.
          </Text>
          <Text paragraph fontSize="standard">
            {' More details to be provided under '}
            <Text fontSize="standard" fontStyle="bold">
              My Earnings
            </Text>
            {' once the transaction is being completed.'}
          </Text>
        </Text>
      ),
      actions: [
        {
          name: 'Got It',
          positive: true,
        },
      ],
    })
  }

  const renderLabel = (
    label: string,
    label2: string,
    okay: boolean,
    color = 'green'
  ) => {
    return (
      <View style={styles.formRow}>
        <Text>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.label} color={okay ? color : 'orange'}>
            {label2}
          </Text>
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        showBack
        bordered
        avoidMode
        title={'Payment'}
        style={styles.header}
      />
      <ScrollView>
        <View style={styles.topSpacer}>
          <View style={styles.subContainer}>
            <View style={styles.formRow}>
              {renderLabel('Payment Options', '*', isOnline || isCash)}
              <CheckBoxLabel
                disabled={disableCash || isShipping}
                label="Secure online payment"
                data="isOnline"
                active={isOnline}
                onChange={handleCheck}
              />
              <Collapsible collapsed={!isOnline}>
                <View style={[styles.inline, styles.checkMargin]}>
                  <Text style={styles.checkDescription}>
                    Payments are handled by Netsave through Stripe, and are
                    fully protected. Choosing secure online payment will
                    increase the safety of your listing to attract more buyers.
                    Netsave charges a
                    <Text
                      color="green"
                      fontSize="small"
                      fontStyle="bold"
                      onPress={handleSmallFeePopup}
                    >
                      {' small transaction fee '}
                    </Text>
                    for the use of the service provided.
                  </Text>
                </View>
                <View style={[styles.rowWrap, styles.checkMargin]}>
                  <Text style={styles.checkDescription}>
                    {'By continuing, you also agree to our '}
                    <Text
                      fontStyle="bold"
                      color="green"
                      fontSize="small"
                      onPress={handleNetsaveAgreement}
                    >
                      {'Services Agreement '}
                    </Text>
                    {'and the '}
                    <Text
                      fontStyle="bold"
                      color="green"
                      fontSize="small"
                      onPress={handleStripeAgreement}
                    >
                      {'Stripe Connected Account Agreement'}
                    </Text>
                    {'.'}
                  </Text>
                </View>
                <Image
                  source={POWERED_BY_STRIPE}
                  style={[styles.checkMargin, styles.powered]}
                />
              </Collapsible>
            </View>
            <View style={styles.formRow}>
              <CheckBoxLabel
                disabled={isShipping && !isLocal}
                label="Cash & Other"
                data="isCash"
                active={isCash}
                onChange={handleCheck}
              />
              <Collapsible collapsed={!isCash}>
                <Text style={[styles.checkDescription, styles.checkMargin]}>
                  Payment to be handled privately via cash or other methods{' '}
                  <Text style={styles.checkDescription} fontStyle="bold">
                    without any protection and involvement from Netsave.
                  </Text>
                </Text>
                <View style={[styles.caution, styles.checkMargin]}>
                  <Text style={styles.cautionText} fontStyle="bold">
                    Caution
                  </Text>
                  <Text style={styles.cautionText}>
                    {'Be on the alert for fraudsters and scam artists. '}
                    <Text fontStyle="bold" style={styles.cautionText}>
                      Netsave will not be responsible for loss from private
                      payment.
                    </Text>
                  </Text>
                </View>
              </Collapsible>
            </View>
          </View>
        </View>
      </ScrollView>
      <ProgressSteps current={4} total={4} />
      <View style={styles.actionsRow}>
        <Button
          tight
          outlined
          loading={appLoading}
          style={styles.draftButton}
          onPress={handleSaveAsDraft}
        >
          {isPublished ? 'Save & Exit' : 'Save Draft'}
        </Button>
        <Button
          tight
          disabled={!canSend}
          loading={appLoading}
          style={styles.nextButton}
          onPress={handlePreviewProduct}
        >
          {isPublished ? 'Preview & Update' : 'Preview & Post'}
        </Button>
      </View>
    </View>
  )
}

export default AddProductPayment
