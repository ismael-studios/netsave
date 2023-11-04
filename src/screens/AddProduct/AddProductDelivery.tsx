import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import {
  Text,
  Button,
  Header,
  ScrollView,
  ShellButton,
  ProgressSteps,
  CheckBoxLabel,
} from '../../components'
import styles from './Styles'
import Collapsible from 'react-native-collapsible'
import { PackageSizeType } from '../../types'
import { parsePrice } from '../../helpers/PriceHelper'
import { useAppSelector } from '../../store/hooks'
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
} from '../../store/slice/api/features/product'
import { useGetShippingPackagesQuery } from '../../store/slice/api/features/shipping-packages'
import { PostListingStackScreenProps } from '../../navigation/types'
import { skipToken } from '@reduxjs/toolkit/dist/query'

const AddProductDelivery = ({
  navigation,
  route,
}: PostListingStackScreenProps<'AddProductDelivery'>) => {
  const { product, isEditMode } = route.params
  const [isShipping, setIsShipping] = useState(product.isShipping)
  const [isLocal, setIsLocal] = useState(product.isLocal)

  const { user } = useAppSelector((state) => state.session)
  const { data: productPackages = [] } = useGetShippingPackagesQuery()
  const { data: productData } = useGetProductDetailsQuery(
    user
      ? {
          userId: user.id,
          productId: product.id,
        }
      : skipToken
  )
  const [updateProduct, { isLoading }] = useUpdateProductMutation()
  const appLoading = isLoading

  useEffect(() => {
    if (productData) {
      navigation.setParams({ product: productData })
    }
  }, [productData, navigation])

  const getProductPackage = () => {
    return (
      productPackages.find(({ id }) => product.shippingPackageId == id) ||
      product.shippingPackage
    )
  }

  const handleCheck = (active: boolean, data: string) => {
    switch (data) {
      case 'isShipping':
        setIsShipping(active)
        break
      case 'isLocal':
        setIsLocal(active)
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
          isShipping,
          isLocal,
        },
      }).unwrap()

      if (leave) {
        navigation.navigate('Drafts')
      } else {
        navigation.navigate('AddProductPayment', {
          product: updatedProduct,
          isEditMode,
        })
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const handleNext = () => {
    handleContinue()
  }

  const handleSaveAsDraft = () => {
    handleContinue(true)
  }

  const handleSelectPackageSize = () => {
    navigation.navigate('AddProductSize', { product })
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

  const renderShippingPackage = (size: PackageSizeType) => {
    return size ? (
      <View style={styles.sizeLabel}>
        <Text style={styles.packageDescription}>
          <Text style={styles.packageDescription}>{size.name}</Text>
          {` - up to ${size.weight} lb`}
        </Text>
        <Text style={styles.packageDescription}>
          <Text style={styles.packageDescription}>Package size</Text>
          {` - ${size.length}" x ${size.width}" x ${size.height}"`}
        </Text>
        <Text style={styles.packageDescription} fontStyle="bold">
          <Text style={styles.packageDescription}>{'Shipping fee - '}</Text>
          {parsePrice(size.price)}
        </Text>
      </View>
    ) : (
      <Button tight onPress={handleSelectPackageSize}>
        Select Package Size & Fee
      </Button>
    )
  }

  const { isPublished, shippingPackageId } = product
  const shippingPackage = getProductPackage()
  const hasSizeFee = Boolean(shippingPackageId && shippingPackage)
  const canSend = isShipping ? hasSizeFee : isLocal && !isShipping
  return (
    <View style={styles.container}>
      <Header
        showBack
        bordered
        avoidMode
        title={'Delivery'}
        style={styles.header}
      />
      <ScrollView>
        <View style={styles.topSpacer}>
          <View style={styles.subContainer}>
            <View style={styles.formRow}>
              {renderLabel('Delivery Options', '*', isShipping || isLocal)}
              <CheckBoxLabel
                label="Shipping"
                data="isShipping"
                active={isShipping}
                onChange={handleCheck}
              />
              <View style={styles.checkMargin}>
                <Collapsible collapsed={!isShipping}>
                  {renderLabel(
                    'Package Size & Fee',
                    '*',
                    isShipping && hasSizeFee
                  )}
                  {renderShippingPackage(shippingPackage)}
                  <Text paragraph fontSize="small" color="gray">
                    *Shipping fee to be paid by buyer
                  </Text>
                  {shippingPackage ? (
                    <ShellButton
                      hitSize={10}
                      style={styles.sizeChangeButton}
                      onPress={handleSelectPackageSize}
                    >
                      <Text color="green" fontStyle="bold" fontSize="h6">
                        Change
                      </Text>
                    </ShellButton>
                  ) : null}
                </Collapsible>
              </View>
            </View>
            <View style={styles.formRow}>
              <CheckBoxLabel
                label="Local meetup"
                data="isLocal"
                active={isLocal}
                onChange={handleCheck}
              />
              <Collapsible collapsed={!isLocal}>
                <Text style={[styles.checkDescription, styles.checkMargin]}>
                  Have local meetup available for buyers who are near you.
                  Arrange the place and time with the buyer directly.
                </Text>
                <View style={[styles.caution, styles.checkMargin]}>
                  <Text style={styles.cautionText} fontStyle="bold">
                    Caution
                  </Text>
                  <Text style={styles.cautionText}>
                    Please make arrangements to meet in a safe public
                    environment to ensure safety of both parties. Safe public
                    environments may include public parkings in shopping malls
                    or retail plaza, public locations near police stations,
                    parking lots of coffee shops or fast food restaurants.{' '}
                    <Text fontStyle="bold" style={styles.cautionText}>
                      Netsave cannot guarantee your safety, and therefore is not
                      responsible for anything including loss of products that
                      may occur as a result of local meetup.{' '}
                    </Text>
                    Please act safely and responsibly.
                  </Text>
                </View>
              </Collapsible>
            </View>
          </View>
        </View>
      </ScrollView>
      <ProgressSteps current={3} total={4} />
      <View style={styles.actionsRow}>
        <Button
          tight
          outlined
          style={styles.draftButton}
          loading={appLoading}
          onPress={handleSaveAsDraft}
        >
          {isPublished ? 'Save & Exit' : 'Save Draft'}
        </Button>
        <Button
          tight
          style={styles.nextButton}
          disabled={!canSend}
          loading={appLoading}
          onPress={handleNext}
        >
          Next
        </Button>
      </View>
    </View>
  )
}

export default AddProductDelivery
