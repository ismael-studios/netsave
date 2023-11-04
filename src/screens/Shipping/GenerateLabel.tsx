import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import {
  Text,
  Button,
  ScrollView,
  AddressesList,
  ShowAlert,
  Header,
  Input,
} from '../../components'
import styles from './Styles'
import Collapsible from 'react-native-collapsible'
import {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button'
import { Colors } from '../../common'
import { SendBuyerOfferMessage } from '../../helpers/ChatHelper'
import { TransactionStackScreenProps } from '../../navigation/types'
import { useGetAddressesQuery } from '../../store/slice/api/features/user'
import { useAppSelector } from '../../store/hooks'
import currency from 'currency.js'
import { usePostShipmentLabelMutation } from '../../store/slice/api/features/shipment'
import { ShippingAddressType } from '../../types'

type InsuranceType = 'isInsured' | 'notInsured' | ''

const InsuredOption = { label: 'Purchase Insurance', value: 'isInsured' }
const NotInsuredOption = {
  label: "I Don't Need Insurance",
  value: 'notInsured',
}

const GenerateShippingLabel = ({
  navigation,
  route,
}: TransactionStackScreenProps<'GenerateShippingLabel'>) => {
  const { product, offer, transaction } = route.params

  const { user, sub } = useAppSelector((state) => state.session)

  const [insurance, setInsurance] = useState<InsuranceType>('isInsured')
  const [addressId, setAddressId] = useState('')
  const [insureAmount, setInsureAmount] = useState('')

  const { data: addresses = [], isLoading: isLoadingAddresses } =
    useGetAddressesQuery(sub)

  const [
    postShipmentLabel,
    { isSuccess, isError, error, isLoading: isLoadingPostShipmentLabel },
  ] = usePostShipmentLabelMutation()

  const loading = isLoadingAddresses || isLoadingPostShipmentLabel

  useEffect(() => {
    if (isSuccess) {
      SendBuyerOfferMessage(user, offer, '[Shipment packaging started]')
      navigation.navigate('ViewShippingLabel', {
        transaction,
      })
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError) {
      ShowAlert({
        title: 'Sorry!',
        message: error.data.message,
        actions: [
          {
            name: 'Try Again',
            positive: true,
          },
        ],
      })
    }
  }, [isError, error])

  const handleInsuranceCheck = (data: InsuranceType) => {
    setInsurance(data)
  }

  const handleSelectAddress = ({ id }: ShippingAddressType) => {
    setAddressId(id)
  }

  const handleGenerateLabel = () => {
    const { id: productId, userId } = product
    const { id: transactionId, shipmentId } = transaction
    if (shipmentId) {
      const isInsured = insurance === 'isInsured'
      postShipmentLabel({
        shipmentId,
        data: {
          userId,
          productId,
          transactionId,
          fromAddressId: addressId,
          ...(isInsured &&
            insureAmount && {
              declaredValue: currency(insureAmount).value,
            }),
        },
      })
    }
  }

  const handleAddAddress = () => {
    navigation.navigate('ShippingAddress', {
      title: 'Ship From Address',
      nameLabel: "Shipper's Name",
    })
  }

  const handleInsuranceAmount = (value: string) =>
    setInsureAmount(value.replace(/[^0-9]/g, ''))

  const handleGoBack = () => {
    navigation.navigate('Main', {
      screen: 'Chat',
    })
  }

  const renderLabel = (
    label: string,
    label2?: string,
    okay?: boolean,
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

  const isInsured = insurance === 'isInsured'
  const notInsured = insurance === 'notInsured'
  const insuredColor = isInsured ? Colors.green : Colors.lighterGray
  const notInsuredColor = notInsured ? Colors.green : Colors.lighterGray
  const invalidInsurance = insureAmount
    ? +insureAmount < 50 || +insureAmount > 10000
    : false
  const canSend =
    addressId &&
    ((insurance && insureAmount && !invalidInsurance) || notInsured)
      ? true
      : false
  return (
    <View style={styles.container}>
      <Header
        showBack
        onBackPress={handleGoBack}
        bordered
        avoidMode
        title={'Generate Shipping Label'}
        style={styles.header}
      />
      <ScrollView>
        <View style={styles.topSpacer}>
          <View style={styles.subContainer}>
            <View style={styles.formRow}>
              {renderLabel('Ship from address', '*', !!addressId)}
              <AddressesList
                selectedId={addressId}
                addresses={addresses}
                addressType="Ship From Address"
                onAddAddress={handleAddAddress}
                onSelectAddress={handleSelectAddress}
              />
            </View>
            {renderLabel('Insurance')}
            <View style={styles.formRow}>
              <RadioButton labelHorizontal style={styles.radios}>
                <RadioButtonInput
                  obj={InsuredOption}
                  index={0}
                  isSelected={isInsured}
                  borderWidth={2}
                  buttonColor={insuredColor}
                  selectedButtonColor={insuredColor}
                  selectedLabelColor={insuredColor}
                  buttonSize={10}
                  buttonOuterSize={20}
                  onPress={!loading && handleInsuranceCheck}
                />
                <RadioButtonLabel
                  obj={InsuredOption}
                  index={0}
                  labelHorizontal={true}
                  labelColor={isInsured ? Colors.green : Colors.textBlack}
                  labelStyle={styles.radioLabel}
                  onPress={!loading && handleInsuranceCheck}
                />
              </RadioButton>
              <View style={styles.checkMargin}>
                <Collapsible collapsed={!isInsured}>
                  <Input
                    leftElement={<Text style={styles.currency}>$</Text>}
                    keyboardType={'numeric'}
                    value={insureAmount}
                    style={styles.priceInput}
                    onChangeText={handleInsuranceAmount}
                    inputStyle={styles.priceInputText}
                    placeholder="50 - 10,000"
                  />
                  {insureAmount ? (
                    <Text style={styles.checkDescription}>
                      Premium insurance insures packages that are lost, stolen
                      or damaged. The insurance fee of{' '}
                      <Text fontStyle="bold" style={styles.checkDescription}>
                        {currency(insureAmount).format()}
                      </Text>{' '}
                      will be deducted from your earnings automatically upon
                      completion of the transaction.
                    </Text>
                  ) : null}
                  {invalidInsurance ? (
                    <Text color="orange" fontSize="small">
                      Insurance may not be less than $50 nor exceed $10,000.
                    </Text>
                  ) : null}
                </Collapsible>
              </View>
            </View>
            <View>
              <RadioButton labelHorizontal style={styles.radios}>
                <RadioButtonInput
                  obj={NotInsuredOption}
                  index={0}
                  isSelected={notInsured}
                  borderWidth={2}
                  buttonColor={notInsuredColor}
                  selectedButtonColor={notInsuredColor}
                  selectedLabelColor={notInsuredColor}
                  buttonSize={10}
                  buttonOuterSize={20}
                  onPress={!loading && handleInsuranceCheck}
                />
                <RadioButtonLabel
                  obj={NotInsuredOption}
                  index={0}
                  labelHorizontal={true}
                  labelColor={notInsured ? Colors.green : Colors.textBlack}
                  labelStyle={styles.radioLabel}
                  onPress={!loading && handleInsuranceCheck}
                />
              </RadioButton>
              <View style={styles.checkMargin}>
                <Collapsible collapsed={!notInsured}>
                  <View style={styles.row}>
                    <Text style={styles.checkDescription}>
                      Netsave will not be responsible for any loss that could
                      occur from delivery.
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
          loading={loading}
          style={styles.nextButton}
          onPress={handleGenerateLabel}
        >
          Generate Shipping Label
        </Button>
      </View>
    </View>
  )
}

export default GenerateShippingLabel
