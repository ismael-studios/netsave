import React, { useEffect } from 'react'
import { Button, Text } from '../../components'
import { View } from 'react-native'
import { Header, ScrollView, ShowAlert } from '../../components'
import QRCode from 'react-native-qrcode-svg'
import styles from './styles'
import { TransactionStackScreenProps } from '../../navigation/types'
import {
  useGetPickupCodeQuery,
  useGetTransactionQuery,
} from '../../store/slice/api/features/transaction'

const BuyerQRCode = ({
  navigation,
  route,
}: TransactionStackScreenProps<'BuyerQRCode'>) => {
  const { product, transaction: initialTransaction } = route.params

  const { data: pickupCode } = useGetPickupCodeQuery({
    userId: product.userId,
    productId: product.id,
    transactionId: initialTransaction.id,
  })

  const {
    data: transaction,
    isFetching,
    refetch,
  } = useGetTransactionQuery({
    userId: product.userId,
    productId: product.id,
    transactionId: initialTransaction.id,
  })

  useEffect(() => {
    showAlertOnLoad()
  }, [])

  useEffect(() => {
    if (transaction && !isFetching) {
      const { isPickedUp } = transaction

      if (isPickedUp) {
        ShowAlert({
          title: 'Code Scanned',
          message:
            'Seller has scanned the code and should have the product. You are now given 72 hours to report any problems with the product and request for return/refund if needed. After 72 hours the option will be closed and your payment will automatically be released to seller.',
          actions: [
            {
              name: 'Got it',
              positive: true,
            },
          ],
        })
      } else {
        const timeout = setTimeout(() => {
          refetch()
        }, 3000)

        return () => {
          clearTimeout(timeout)
        }
      }
    }
  }, [transaction, isFetching, refetch])

  const handleGoBack = () => {
    navigation.goBack()
  }

  const showAlertOnLoad = () => {
    ShowAlert({
      title: 'Do you have the product?',
      message: 'Only show this code to the seller when you have the product.',
      actions: [
        {
          name: 'Got it',
          positive: true,
        },
      ],
    })
  }

  return (
    <View style={styles.container}>
      <Header showBack bordered avoidMode title={'Meetup Code'} />
      <ScrollView>
        <View style={styles.qrCode}>
          <QRCode
            value={pickupCode?.code}
            size={250}
            color="black"
            backgroundColor="white"
            logoSize={30}
            logoMargin={2}
            logoBorderRadius={15}
            logoBackgroundColor="yellow"
          />
        </View>
        <View style={styles.orContainer}>
          <Text style={styles.or}>or</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>6 Digits Code</Text>
          <Text style={styles.codeText}>{pickupCode?.code}</Text>
        </View>
      </ScrollView>
      <View style={styles.actions}>
        <Button tight onPress={handleGoBack}>
          Back
        </Button>
      </View>
    </View>
  )
}

export default BuyerQRCode
