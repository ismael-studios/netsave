import React, { useState } from 'react'
import { View, Image } from 'react-native'
import { Text, Button, ShellButton, Header, ScrollView } from '../../components'
import styles from './Styles'
import { ProductType, PackageSizeType } from '../../types'
import { RadioButtonInput } from 'react-native-simple-radio-button'
import { Colors, Images } from '../../common'
import { parsePrice } from '../../helpers/PriceHelper'
import { useUpdateProductMutation } from '../../store/slice/api/features/product'
import { useAppSelector } from '../../store/hooks'
import { useGetShippingPackagesQuery } from '../../store/slice/api/features/shipping-packages'
import { PostListingStackScreenProps } from '../../navigation/types'

const { PACKAGE_SIZE_XS, PACKAGE_SIZE_S, PACKAGE_SIZE_M, PACKAGE_SIZE_L } =
  Images

type SizeIcon = {
  id: number
  image: typeof PACKAGE_SIZE_XS
}

const sizeIcons: SizeIcon[] = [
  {
    id: 1,
    image: PACKAGE_SIZE_XS,
  },
  {
    id: 2,
    image: PACKAGE_SIZE_S,
  },
  {
    id: 3,
    image: PACKAGE_SIZE_M,
  },
  {
    id: 4,
    image: PACKAGE_SIZE_L,
  },
]

const AddProductSize = ({
  navigation,
  route,
}: PostListingStackScreenProps<'AddProductSize'>) => {
  const { product } = route.params
  const { loading } = useAppSelector((state) => state.app)
  const { user } = useAppSelector((state) => state.session)
  const { shippingPackageId } = product
  const [packageId, setPackageId] = useState(shippingPackageId || null)

  const { data: productPackages = [] } = useGetShippingPackagesQuery()
  const [updateProduct, { isLoading }] = useUpdateProductMutation()

  const handleCheck = (value: number) => {
    setPackageId(value)
  }

  const handleSelectPackageSize = async () => {
    if (!user) {
      return
    }
    try {
      await updateProduct({
        userId: user.id,
        product: {
          id: product.id,
          isShipping: true,
          shippingPackageId: packageId,
        },
      }).unwrap()

      navigation.goBack()
    } catch (err) {
      console.warn(err)
    }
  }
  const canSend = packageId != null

  const renderPackageSize = ({
    id,
    name,
    price,
    length,
    width,
    height,
    weight,
  }: PackageSizeType) => {
    const sizeIcon = sizeIcons.find((size) => size.id === id)
    const isActive = id === packageId
    return (
      <View key={id} style={styles.formRow}>
        <ShellButton
          data={id}
          labelHorizontal={true}
          style={styles.sizePackage}
          onPress={handleCheck}
        >
          <RadioButtonInput
            obj={{ label: name, value: id }}
            index={0}
            isSelected={isActive}
            borderWidth={2}
            buttonColor={Colors.green}
            selectedButtonColor={Colors.green}
            selectedLabelColor={Colors.green}
            buttonSize={10}
            buttonOuterSize={20}
            onPress={handleCheck}
          />
          <View style={styles.sizeIcon}>
            <Image source={sizeIcon?.image} style={styles.sizeIconImage} />
          </View>
          <View style={styles.sizeLabel}>
            <Text
              color={isActive ? 'green' : Colors.textBlack}
              style={styles.packageTitle}
            >
              <Text
                color={isActive ? 'green' : Colors.textBlack}
                fontStyle="bold"
                style={styles.packageTitle}
              >
                {name}
              </Text>
              {` - up to ${weight} lb`}
            </Text>
            <Text style={styles.packageDescription}>
              <Text color="gray" style={styles.packageDescription}>
                Package size
              </Text>
              {` ${parseInt(length)}" x ${parseInt(width)}" x ${parseInt(
                height
              )}"`}
            </Text>
            <Text style={styles.packageDescription}>
              <Text color="gray" style={styles.packageDescription}>
                {'Shipping fee '}
              </Text>
              {parsePrice(price)}
            </Text>
          </View>
        </ShellButton>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <Header
        showBack
        bordered
        avoidMode
        title={'Package Size & Fee'}
        style={styles.header}
      />
      <ScrollView>
        <View style={styles.topSpacer}>
          <View style={styles.subContainer}>
            <View style={styles.formRow}>
              <Text fontSize="standard">
                Select an appropriate package size.{' '}
                <Text fontSize="standard" fontStyle="bold">
                  Shipping fee will be paid by buyer.
                </Text>
              </Text>
            </View>
            {productPackages.map(renderPackageSize)}
            <View style={styles.formRow} />
          </View>
        </View>
      </ScrollView>
      <View style={styles.actionsRow}>
        <Button
          tight
          style={styles.nextButton}
          disabled={!canSend}
          loading={loading}
          onPress={handleSelectPackageSize}
        >
          Select Package Size
        </Button>
      </View>
    </View>
  )
}

export default AddProductSize
