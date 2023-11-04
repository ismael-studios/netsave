import React, { useState } from 'react'
import { View } from 'react-native'
import {
  Text,
  ShowAlert,
  AddressesList,
  Button,
  Header,
  ScrollView,
} from '../../components'
import styles from './Styles'
import Collapsible from 'react-native-collapsible'
import {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button'
import { Colors } from '../../common'
import { useAppSelector } from '../../store/hooks'
import { useGetAddressesQuery } from '../../store/slice/api/features/user'
import { ShippingAddressType } from '../../types'
import { TransactionStackScreenProps } from '../../navigation/types'

type option = 'isShipping' | 'isLocal' | ''
const ShippingOption = { label: 'Shipping', value: 'isShipping' }
const LocalOption = { label: 'Local meetup', value: 'isLocal' }

const DeliveryOptions = ({
  navigation,
  route,
}: TransactionStackScreenProps<'DeliveryOptions'>) => {
  const { product, offer, transaction } = route.params
  const onlyCash = !product.isShipping && product.isLocal
  const onlyShipping = product.isShipping && !product.isLocal
  const [option, setOption] = useState<'isShipping' | 'isLocal' | ''>(
    onlyCash ? 'isLocal' : onlyShipping ? 'isShipping' : ''
  )
  const [addressId, setAddressId] = useState('')

  const { sub } = useAppSelector((state) => state.session)

  const { data: addresses = [], isLoading: isLoadingAddresses } =
    useGetAddressesQuery(sub)

  const handleCheck = (data: option) => {
    setOption(data)
  }

  const handleSelectAddress = (address: ShippingAddressType) => {
    setAddressId(address.id)
  }

  const handleProceed = () => {
    const isLocal = option == LocalOption.value

    const address = isLocal
      ? null
      : addresses.find(({ id }) => id === addressId)
    if (option === 'isShipping') {
      if (address) {
        navigation.navigate('OnlinePayment', {
          offer,
          product,
          transaction,
          address,
        })
      }
    } else {
      navigation.navigate('PaymentOptions', {
        offer,
        product,
        transaction,
      })
    }
  }

  const handleAddAddress = () => {
    navigation.navigate('ShippingAddress', {
      title: 'Receiving Address',
      nameLabel: "Receiver's Name",
    })
  }

  const handleRemoveAddress = (address: ShippingAddressType) => {
    ShowAlert({
      title: 'Delete Address',
      message: 'Are you sure you want to delete this address?',
      actions: [
        {
          name: 'Delete',
          positive: true,
        },
        {
          name: 'Cancel',
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

  const isShipping = option == ShippingOption.value
  const isLocal = option == LocalOption.value
  const localColor = isLocal ? Colors.green : Colors.lighterGray
  const shippingColor = isShipping ? Colors.green : Colors.lighterGray

  // const { shipmentId } = transaction
  const canSend = isLocal || (isShipping && addressId) ? true : false
  return (
    <View style={styles.container}>
      <Header
        showBack
        bordered
        avoidMode
        title={'Delivery Options'}
        style={styles.header}
      />
      <ScrollView>
        <View style={styles.topSpacer}>
          <View style={styles.subContainer}>
            <View>
              {renderLabel('Delivery Options', '*', canSend)}
              <RadioButton
                labelHorizontal={true}
                style={[
                  styles.radios,
                  { opacity: product.isShipping ? 1 : 0.5 },
                ]}
              >
                <RadioButtonInput
                  obj={ShippingOption}
                  index={0}
                  isSelected={option == ShippingOption.value}
                  borderWidth={2}
                  buttonColor={shippingColor}
                  selectedButtonColor={shippingColor}
                  selectedLabelColor={shippingColor}
                  buttonSize={10}
                  buttonOuterSize={20}
                  onPress={product.isShipping ? handleCheck : () => {}}
                />
                <RadioButtonLabel
                  obj={ShippingOption}
                  index={0}
                  labelHorizontal={true}
                  labelColor={isShipping ? Colors.green : Colors.textBlack}
                  labelStyle={styles.radioLabel}
                  onPress={product.isShipping ? handleCheck : () => {}}
                />
              </RadioButton>
              <View style={styles.checkMargin}>
                {isShipping && (
                  <Collapsible collapsed={isLocal}>
                    <Text style={styles.checkDescription}>
                      Secure and fast shipping with tracking. Highly
                      recommended.
                    </Text>
                    <AddressesList
                      selectedId={addressId}
                      addresses={addresses}
                      addressType="Receiving Address"
                      onAddAddress={handleAddAddress}
                      onSelectAddress={handleSelectAddress}
                    />
                  </Collapsible>
                )}
              </View>
            </View>
            <View>
              <RadioButton labelHorizontal={true} style={styles.radios}>
                <RadioButtonInput
                  obj={LocalOption}
                  index={0}
                  isSelected={option == LocalOption.value}
                  borderWidth={2}
                  buttonColor={localColor}
                  selectedButtonColor={localColor}
                  selectedLabelColor={localColor}
                  buttonSize={10}
                  buttonOuterSize={20}
                  onPress={product.isLocal ? handleCheck : () => {}}
                />
                <RadioButtonLabel
                  obj={LocalOption}
                  index={0}
                  labelHorizontal={true}
                  labelColor={isLocal ? Colors.green : Colors.textBlack}
                  labelStyle={styles.radioLabel}
                  onPress={product.isLocal ? handleCheck : () => {}}
                />
              </RadioButton>
              <View style={styles.checkMargin}>
                <Collapsible collapsed={isShipping}>
                  <Text style={styles.checkDescription}>
                    {`${
                      onlyCash
                        ? 'Meetup and collect the item in person.'
                        : 'Are you close to the seller? Don’t want to wait nor pay for shipping? Choose local meetup and pick up the item in person.'
                    } Arrange the place and time with the seller directly.`}
                  </Text>
                  <View style={styles.caution}>
                    <Text style={styles.cautionText} fontStyle="bold">
                      Caution
                    </Text>
                    <Text style={[styles.cautionText]}>
                      Please make arrangements to meet in a safe public
                      environment to ensure safety of both parties. Safe public
                      environments may include public parkings in shopping malls
                      or retail plaza, public locations near police stations,
                      parking lots of coffee shops or fast food restaurants.
                      <Text fontStyle="bold" style={styles.cautionText}>
                        {
                          ' Netsave cannot guarantee your safety, and therefore is not responsible for anything including loss of products that may occur as a result of local meetup. '
                        }
                      </Text>
                      Please act safely and responsibly.
                    </Text>
                  </View>
                </Collapsible>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.actions}>
        <Button
          tight
          disabled={!canSend}
          loading={isLoadingAddresses}
          style={styles.nextButton}
          onPress={handleProceed}
        >
          {`Proceed To Payment ${option === 'isShipping' ? '' : 'Options'}`}
        </Button>
      </View>
    </View>
  )
}

export default DeliveryOptions
