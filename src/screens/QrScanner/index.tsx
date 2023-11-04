import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import {
  Header,
  Button,
  ShellButton,
  Text,
  Loading,
  ShowAlert,
} from '../../components'
import PinCodeInput from '../AuthScreens/PinCodeInput'
import { Metrics } from '../../common'
import styles from './Styles'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { TransactionStackScreenProps } from '../../navigation/types'
import { useVerifyPickupCodeMutation } from '../../store/slice/api/features/transaction'
import { BarCodeReadEvent } from 'react-native-camera'

const { screenHeight, headerHeight, footerHeight } = Metrics
const camHeight = screenHeight - headerHeight - footerHeight - 20

type SelectionType = 'auto' | 'manual'

const SellerQrScanner = ({
  navigation,
  route,
}: TransactionStackScreenProps<'SellerQrScanner'>) => {
  const { product, transaction } = route.params
  const [manualCode, setManualCode] = useState('')
  const [selection, setSelection] = useState<SelectionType>('auto')

  const [verifyPickupCode, { isLoading, isSuccess, isError, error }] =
    useVerifyPickupCodeMutation()

  useEffect(() => {
    if (isSuccess) {
      ShowAlert({
        title: 'Code Verified',
        message: `Code is verified and buyer has confirmed receipt of the product. Buyer now has 3 days to report any problems. Payment will be available for withdrawal after this time period.`,
        actions: [
          {
            name: 'Got it',
            positive: true,
            callback: closeQrScanner,
          },
        ],
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
            name: 'Okay',
            positive: true,
          },
        ],
      })
    }
  }, [isError])

  const handleVerifyCode = (code: string) => {
    if (Number(code)) {
      verifyPickupCode({
        userId: product.userId,
        productId: product.id,
        transactionId: transaction.id,
        data: {
          code: +code,
        },
      })
    } else {
      ShowAlert({
        title: 'Sorry!',
        message:
          'Ensure you are scanning the correct QR code provided by Netsave.',
        actions: [
          {
            name: 'Okay',
            positive: true,
          },
        ],
      })
    }
  }

  const handleSelection = (selection: SelectionType) => {
    setSelection(selection)
    setManualCode('')
  }

  const closeQrScanner = () => {
    navigation.navigate('Main', {
      screen: 'Chat',
    })
  }

  const handleQRRead = (event: BarCodeReadEvent) => {
    handleVerifyCode(event.data)
  }

  const handleVerify = () => {
    handleVerifyCode(manualCode)
  }

  const renderScanner = () => (
    <View style={styles.qrScanner}>
      <QRCodeScanner
        showMarker
        reactivate
        onRead={handleQRRead}
        cameraStyle={{
          height: camHeight,
        }}
        customMarker={
          <View style={styles.rectangleContainer}>
            <View style={[styles.shade, styles.wide]} />
            <View style={styles.row}>
              <View style={styles.shade} />
              <View style={styles.rectangle}>
                <View style={styles.topLeft} />
                <View style={styles.topRight} />
                <View style={styles.bottomLeft} />
                <View style={styles.bottomRight} />
              </View>
              <View style={styles.shade} />
            </View>
            <View style={[styles.shade, styles.wide]} />
          </View>
        }
      />
    </View>
  )

  const renderManual = () => {
    const canVerify = String(manualCode).length === 6
    return (
      <View style={styles.codeInputContainer}>
        <Text style={styles.instruction}>Enter Buyer's code</Text>
        <PinCodeInput
          flat
          pins={6}
          onChangeText={setManualCode}
          value={manualCode}
        />
        <Button
          tight
          disabled={!canVerify}
          onPress={handleVerify}
          style={styles.verifyButton}
        >
          Verify
        </Button>
      </View>
    )
  }

  const isAuto = selection === 'auto'
  return (
    <View style={styles.container}>
      <Header showBack bordered avoidMode title={'Scan Buyer code'} />
      <View style={styles.selections}>
        <ShellButton
          onPress={handleSelection}
          data="auto"
          style={[styles.selectButton, isAuto && styles.activeButton]}
        >
          <Text style={styles.buttonText}>Scan QR Code</Text>
        </ShellButton>
        <ShellButton
          onPress={handleSelection}
          data="manual"
          style={[styles.selectButton, !isAuto && styles.activeButton]}
        >
          <Text style={styles.buttonText}>Manually Enter Code</Text>
        </ShellButton>
      </View>
      <Loading show={isLoading}>
        {isAuto ? renderScanner() : renderManual()}
      </Loading>
    </View>
  )
}

export default SellerQrScanner
