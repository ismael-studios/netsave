import React, { useEffect, useState } from 'react'
import { View, Linking } from 'react-native'
import {
  Text,
  Button,
  Loading,
  ScrollView,
  ShowInputAlert,
  HideAlert,
  ShowAlert,
  Header,
} from '../../components'
import styles from './Styles'
import PDFView from 'react-native-view-pdf'
import { Images, Metrics } from '../../common'
import { useGetShipmentLabelQuery } from '../../store/slice/api/features/shipment'
import { TransactionStackScreenProps } from '../../navigation/types'
import { skipToken } from '@reduxjs/toolkit/dist/query'

const { CHECK_CIRCLE_OUTLINED } = Images

const { screenHeight, IS_ANDROID } = Metrics

const ViewShippingLabel = ({
  navigation,
  route,
}: TransactionStackScreenProps<'ViewShippingLabel'>) => {
  const { transaction } = route.params
  const { shipmentId } = transaction

  const [email, setEmail] = useState('')
  const [labelUrl, setLabelUrl] = useState('')

  const { data, isLoading, isError, error } = useGetShipmentLabelQuery(
    shipmentId
      ? {
          shipmentId: shipmentId,
          email,
        }
      : skipToken
  )

  const loading = isLoading
  useEffect(() => {
    if (data) {
      if (email) {
        ShowAlert({
          title: 'Email Shipping Label',
          icon: CHECK_CIRCLE_OUTLINED,
          message: 'Email sent.',
          actions: [
            {
              name: 'Okay',
              positive: true,
            },
          ],
        })
      } else {
        setLabelUrl(data.labelUrl)
      }
    }
  }, [data, email])

  useEffect(() => {
    if (isError) {
      if (email) {
        ShowAlert({
          title: 'Sorry!',
          message: error.data.message,
          actions: [
            {
              name: 'Close',
              positive: true,
            },
          ],
        })
      } else {
        handleErrorDisplay(error.data.message)
      }
    }
  }, [isError, error])

  const handleGoBack = () => {
    navigation.navigate('Main', { screen: 'Chat' })
    return true
  }

  const handlePDFError = (err) => {
    console.log('Cannot render PDF', err)
    handleErrorDisplay(err)
  }

  const handlePrintPDF = () => {
    Linking.openURL(labelUrl)
  }

  const handleEmailPDF = () => {
    ShowInputAlert({
      title: 'Email Shipping Label',
      message: ' ',
      inputConfig: {
        label: 'Email:',
        // placeholder: 'Email',
        keyboardType: 'email-address',
        autoCompleteType: 'email',
        autoCapitalize: 'none',
        validation: (email) =>
          Boolean(
            email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
          ),
      },
      actions: [
        {
          name: 'Send Shipping Label',
          positive: true,
          callback: handleSendEmail,
        },
      ],
    })
  }

  const handleSendEmail = ({ input: email }) => {
    HideAlert()
    setEmail(email)
  }

  const handleErrorDisplay = (err: string) => {
    ShowAlert({
      title: 'Sorry!',
      message: `There was a problem fetching your Shipping Label. ${err}`,
      actions: [
        {
          name: 'OK',
          callback: handleGoBack,
        },
      ],
    })
  }

  return (
    <View style={styles.container}>
      <Header
        showBack
        bordered
        avoidMode
        onBackPress={handleGoBack}
        title={'Shipping Label'}
        style={styles.header}
      />
      <ScrollView>
        <View style={styles.topSpacer}>
          <View style={styles.subContainer}>
            <View style={styles.formRow}>
              <Loading minHeight={200} show={loading || !labelUrl}>
                {IS_ANDROID ? (
                  <Button tight onPress={handlePrintPDF}>
                    View Label In Browser
                  </Button>
                ) : (
                  <PDFView
                    fadeInDuration={250.0}
                    style={{
                      flex: 1,
                      width: '100%',
                      height: screenHeight * 0.33,
                    }}
                    resource={labelUrl}
                    resourceType={'url'}
                    onError={handlePDFError}
                  />
                )}
              </Loading>
            </View>
            <View style={styles.formRowNarrow}>
              <Text style={styles.descriptionText}>
                1. Email yourself above shipping label
              </Text>
              <Text style={styles.descriptionText}>2. Print the label</Text>
              <Text style={styles.descriptionText}>
                3. Stick the label to your package
              </Text>
              <Text style={styles.descriptionText}>
                4. Ship out package from a nearby USPS location
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.actions}>
        <Button
          tight
          loading={loading}
          style={!IS_ANDROID && styles.spacedButton}
          onPress={handleEmailPDF}
        >
          Email Shipping Label
        </Button>
        {!IS_ANDROID ? (
          <Button tight outlined loading={loading} onPress={handlePrintPDF}>
            Print label From Phone
          </Button>
        ) : null}
      </View>
    </View>
  )
}

export default ViewShippingLabel
