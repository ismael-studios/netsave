import React, { useState, useEffect } from 'react'
import { View, Image, Keyboard, KeyboardEventListener } from 'react-native'
import {
  Text,
  Button,
  Header,
  Input,
  CheckBoxLabel,
  ScrollView,
  ShowAlert,
} from '../../components'
import styles from './Styles'
import States from './states.json'
import RNPickerSelect from 'react-native-picker-select'
import { Images } from '../../common'
import { trim } from 'ramda'
import { useAppSelector } from '../../store/hooks'
import {
  useGetAddressesQuery,
  usePostAddressMutation,
} from '../../store/slice/api/features/user'
import { MainStackScreenProps } from '../../navigation/types'
import { skipToken } from '@reduxjs/toolkit/dist/query'

const { CARET_DOWN } = Images

const Address = ({
  navigation,
  route,
}: MainStackScreenProps<'ShippingAddress'>) => {
  const { user } = useAppSelector((state) => state.session)
  const { title, nameLabel } = route.params
  const {
    city: userCity,
    postalCode: userPostCode,
    region: userRegion,
  } = user || {}

  const { data: addresses = [], isLoading: isLoadingAddresses } =
    useGetAddressesQuery(user ? user.id : skipToken)

  const [postAddress, { isLoading: isLoadingPostAddress }] =
    usePostAddressMutation()

  const loading = isLoadingAddresses || isLoadingPostAddress

  const [baseHeight, setBaseHeight] = useState(0)
  const [address, setAddress] = useState({
    name: '',
    line1: '',
    line2: '',
    city: userCity || '',
    region: userRegion || '',
    postalCode: userPostCode || '',
    country: 'US',
    isPrimary: addresses.length === 0,
  })
  const { name, line1, line2, city, region, postalCode, country, isPrimary } =
    address
  const canSend =
    trim(name) && trim(line1) && trim(city) && region && postalCode && country

  useEffect(() => {
    const handleKeyboardShow: KeyboardEventListener = (event) => {
      const {
        endCoordinates: { height },
      } = event
      setBaseHeight(height)
    }

    const handleKeyboardHide = () => {
      setBaseHeight(0)
    }

    const keyboardWillShow = Keyboard.addListener(
      'keyboardWillShow',
      handleKeyboardShow
    )
    const keyboardWillHide = Keyboard.addListener(
      'keyboardWillHide',
      handleKeyboardHide
    )
    return () => {
      keyboardWillShow.remove()
      keyboardWillHide.remove()
    }
  }, [])

  const handleSubmitAddress = async () => {
    const toAddress = { ...address }
    if (!toAddress.line2) {
      delete toAddress.line2
    }

    try {
      const result = await postAddress(toAddress).unwrap()
      navigation.goBack()
    } catch (error) {
      ShowAlert({
        title: 'Sorry!',
        message: `Error: ${error.data.message}`,
        actions: [{ name: 'Try Again' }],
      })
    }
  }

  const handleCheck = () => {
    setAddress({ ...address, isPrimary: !isPrimary })
  }

  const renderLabel = (
    label: string,
    label2?: string,
    okay?: boolean,
    color = 'green'
  ) => {
    return (
      <View style={styles.labelRow}>
        <Text>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.label} color={okay ? color : 'orange'}>
            {label2}
          </Text>
        </Text>
      </View>
    )
  }
  const handleChangeCountry = () => {}
  const handleChangeState = (value: string) => {
    setAddress({
      ...address,
      postalCode: '',
      region: value,
    })
  }

  const handleAddressChange = (value: string, param: string) => {
    setAddress({
      ...address,
      [param]: value,
    })
  }

  return (
    <View style={[styles.container, { paddingBottom: baseHeight / 1.5 }]}>
      <Header showBack bordered avoidMode title={title} style={styles.header} />
      <View style={styles.scrollerContainer}>
        <ScrollView>
          <View style={styles.form}>
            <View style={styles.formRow}>
              {renderLabel(nameLabel, '*', name !== '' && name.length > 2)}
              <Input
                style={styles.input}
                placeholder="Name"
                value={String(name).replace(/[^a-zA-Z0-9\-\.\s]/, '')}
                onChangeText={(text) => handleAddressChange(text, 'name')}
              />
            </View>
            <View style={styles.formRow}>
              {renderLabel('Address Line 1', '*', line1.length > 5)}
              <Input
                style={styles.input}
                placeholder="Address"
                value={line1}
                onChangeText={(text) => handleAddressChange(text, 'line1')}
              />
            </View>
            <View style={styles.formRow}>
              {renderLabel('Address Line 2')}
              <Input
                style={styles.input}
                placeholder="Address"
                value={line2}
                onChangeText={(text) => handleAddressChange(text, 'line2')}
              />
            </View>
            <View style={styles.formRow}>
              {renderLabel('City', '*', !!city)}
              <Input
                style={styles.input}
                placeholder="Select A City"
                value={city}
                onChangeText={(text) => handleAddressChange(text, 'city')}
              />
            </View>
            <View style={styles.formRow}>
              {renderLabel('State / Province / Region', '*', !!region)}
              <RNPickerSelect
                placeholder={{
                  label: 'Select A State',
                  value: '',
                }}
                value={region}
                onValueChange={handleChangeState}
                items={States}
              >
                <Input
                  editable={false}
                  wideFocus={false}
                  style={styles.input}
                  placeholder="Select A State"
                  rightElement={
                    <Image source={CARET_DOWN} style={styles.arrowImage} />
                  }
                  value={region}
                />
              </RNPickerSelect>
            </View>
            <View style={styles.formRow}>
              {renderLabel('Postal / Zip Code', '*', !!postalCode)}
              <Input
                style={styles.input}
                placeholder="01234"
                keyboardType="numeric"
                value={postalCode}
                onChangeText={(text) => handleAddressChange(text, 'postalCode')}
              />
            </View>
            <View style={styles.formRow}>
              {renderLabel('Country', '*', true)}
              <RNPickerSelect
                disabled
                placeholder={{
                  label: 'United States',
                  value: 'US',
                }}
                value={'US'}
                onValueChange={handleChangeCountry}
                items={[]}
              >
                <Input
                  editable={false}
                  wideFocus={false}
                  style={[styles.input, { opacity: 0.5 }]}
                  placeholder="Select A Country"
                  rightElement={
                    <Image source={CARET_DOWN} style={styles.arrowImage} />
                  }
                  value={country}
                />
              </RNPickerSelect>
            </View>
            {addresses.length === 0 ? null : (
              <View style={styles.formRow}>
                <CheckBoxLabel
                  tight
                  small
                  label="Save address as Primary address"
                  active={isPrimary}
                  onChange={handleCheck}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </View>
      <View style={styles.actions}>
        <Button
          tight
          disabled={!canSend}
          loading={loading}
          style={styles.nextButton}
          onPress={handleSubmitAddress}
        >
          {`Add ${title}`}
        </Button>
      </View>
    </View>
  )
}

export default Address
