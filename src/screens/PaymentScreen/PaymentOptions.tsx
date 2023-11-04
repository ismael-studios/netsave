import React, { useEffect, useState } from 'react'
import { View, Image } from 'react-native'
import { Text, Button, Header, ScrollView } from '../../components'
import styles from './Styles'
import Collapsible from 'react-native-collapsible'
import {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button'
import { Images, Colors } from '../../common'
import { SendSellerOfferMessage } from '../../helpers/ChatHelper'
import { useAppSelector } from '../../store/hooks'
import { usePostPaymentRequestMutation } from '../../store/slice/api/features/transaction'
import { TransactionStackScreenProps } from '../../navigation/types'

const { SECURE } = Images

type option = 'isOnline' | 'isCash' | ''
const OnlineOption = { label: 'Secure Online Payment', value: 'isOnline' }
const CashOption = { label: 'Cash or Other', value: 'isCash' }

const PaymentOptions = ({
  navigation,
  route,
}: TransactionStackScreenProps<'PaymentOptions'>) => {
  const { product, offer, transaction } = route.params
  const { user } = useAppSelector((state) => state.session)
  const [option, setOption] = useState<option>('')

  const [postPaymentRequest, { isLoading, isSuccess }] =
    usePostPaymentRequestMutation()

  useEffect(() => {
    if (isSuccess) {
      SendSellerOfferMessage(
        user,
        offer,
        '[Cash or Other] I would like to discuss Cash or Other payment'
      )
      // might not use the below isCashOther param
      navigation.navigate('Chat', { isCashOther: true })
    }
  }, [isSuccess, offer, navigation, user])

  const handleCheck = (data: option) => {
    setOption(data)
  }

  const handleProceed = () => {
    navigation.navigate('OnlinePayment', {
      product,
      offer,
      transaction,
    })
  }

  const handleCashOther = () => {
    postPaymentRequest({
      userId: product.userId,
      productId: product.id,
      transactionId: transaction.id,
      data: {
        type: 'LOCAL_CASH',
      },
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

  const canSend = option != ''

  const isOnline = option == OnlineOption.value
  const isCash = option == CashOption.value
  const localColor = isCash ? Colors.green : Colors.lighterGray
  const shippingColor = isOnline ? Colors.green : Colors.lighterGray

  return (
    <View style={styles.container}>
      <Header
        showBack
        bordered
        avoidMode
        title={'Payment Options'}
        style={styles.header}
      />
      <ScrollView>
        <View style={styles.topSpacer}>
          <View style={styles.subContainer}>
            <View>
              {renderLabel('Payment Options', '*', canSend)}
              <RadioButton
                labelHorizontal={true}
                style={[
                  styles.radios,
                  { opacity: product.isLocalOnline ? 1 : 0.5 },
                ]}
              >
                <RadioButtonInput
                  obj={OnlineOption}
                  index={0}
                  isSelected={option == OnlineOption.value}
                  borderWidth={2}
                  buttonColor={shippingColor}
                  selectedButtonColor={shippingColor}
                  selectedLabelColor={shippingColor}
                  buttonSize={10}
                  buttonOuterSize={20}
                  onPress={product.isLocalOnline && handleCheck}
                />
                <RadioButtonLabel
                  obj={OnlineOption}
                  index={0}
                  labelHorizontal={true}
                  labelColor={isOnline ? Colors.green : Colors.textBlack}
                  labelStyle={styles.radioLabel}
                  onPress={product.isLocalOnline && handleCheck}
                />
                <Image source={SECURE} style={styles.secure} />
              </RadioButton>
              <View style={styles.checkMargin}>
                <Collapsible collapsed={option !== OnlineOption.value}>
                  <Text style={styles.checkDescription}>
                    This is the safest way to handle payment when you meet up
                    the seller in person. Your money will be protected securely
                    in Netsave’s escrow account and will not be released until
                    you confirm receipt of the product.
                  </Text>
                </Collapsible>
              </View>
            </View>
            <View>
              <RadioButton
                labelHorizontal={true}
                style={[
                  styles.radios,
                  { opacity: product.isLocalCash ? 1 : 0.5 },
                ]}
              >
                <RadioButtonInput
                  disabled={!product.isLocalCash}
                  obj={CashOption}
                  index={0}
                  isSelected={option == CashOption.value}
                  borderWidth={2}
                  buttonColor={localColor}
                  selectedButtonColor={localColor}
                  selectedLabelColor={localColor}
                  buttonSize={10}
                  buttonOuterSize={20}
                  onPress={handleCheck}
                />
                <RadioButtonLabel
                  disabled={!product.isLocalCash}
                  obj={CashOption}
                  index={0}
                  labelHorizontal={true}
                  labelColor={isCash ? Colors.green : Colors.textBlack}
                  labelStyle={styles.radioLabel}
                  onPress={handleCheck}
                />
              </RadioButton>
              <View style={styles.checkMargin}>
                <Collapsible collapsed={option !== CashOption.value}>
                  <Text style={styles.checkDescription}>
                    Are you close to the seller? Don't want to wait nor pay for
                    shipping? Choose local meetup and pick up the item in
                    person. Arrange the place and time with the seller directly.
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
        {isCash && (
          <Button
            tight
            disabled={!canSend}
            loading={isLoading}
            style={styles.nextButton}
            onPress={handleCashOther}
          >
            {'Cash or Other Payment'}
          </Button>
        )}
        {isOnline && (
          <Button
            tight
            disabled={!canSend}
            loading={isLoading}
            style={styles.nextButton}
            onPress={handleProceed}
          >
            {'Proceed To Payment'}
          </Button>
        )}
      </View>
    </View>
  )
}

export default PaymentOptions
