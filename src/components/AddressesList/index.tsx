import React, { useState } from 'react'
import { View } from 'react-native'
import { Text, ShellButton, ShowAlert, Button } from '../../components'
import styles from './Styles'
import {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button'
import { Colors } from '../../common'
import { VoidFunction, ShippingAddressType } from '../../types'

interface AddressesListProps {
  addresses: ShippingAddressType[]
  onAddAddress: VoidFunction
  addressType: string | null
  selectedId?: string
  onSelectAddress: (address: ShippingAddressType) => void
}

const AddressesList = ({
  selectedId,
  addresses,
  addressType = 'Address',
  onSelectAddress,
  onAddAddress,
}: AddressesListProps) => {
  const [addressId, setAddressId] = useState(selectedId)

  const handleSelectAddress = (value: string) => {
    setAddressId(value)
    const address = addresses.find(({ id }) => id === value)
    if (address) {
      onSelectAddress(address)
    }
  }

  const handleAddAddress = () => {
    onAddAddress()
  }

  const handleRemoveAddress = (address) => {
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

  const renderShippingAddresses = (hasAddresses: boolean) => {
    return hasAddresses ? (
      <View style={styles.addresses}>{addresses.map(renderAddress)}</View>
    ) : (
      <View style={styles.empty}>
        <Button block tight onPress={handleAddAddress}>
          {`Add ${addressType}`}
        </Button>
      </View>
    )
  }

  const renderAddress = (address: ShippingAddressType, i: number) => {
    const {
      id,
      name,
      line1,
      line2,
      city,
      region,
      country,
      isPrimary,
      postalCode,
    } = address
    const isSelected = addressId && addressId === id
    const colorButton = isSelected ? Colors.green : Colors.lighterGray
    const colorText = isSelected ? Colors.green : Colors.textBlack
    const addressOption = {
      label: `${name}${isPrimary ? ' (Primary)' : ''}\n${line1}\n${
        line2 ? `${line2}\n` : ''
      }${city}\n${region} ${postalCode}, ${country}`,
      value: id,
    }
    return (
      <View
        key={id}
        style={[
          styles.addressRadio,
          addresses.length - 1 === i && styles.lastAddress,
        ]}
      >
        <RadioButton labelHorizontal={true} style={styles.radios}>
          <RadioButtonInput
            obj={addressOption}
            index={i}
            isSelected={isSelected}
            borderWidth={2}
            buttonColor={colorButton}
            selectedButtonColor={colorButton}
            selectedLabelColor={colorButton}
            buttonSize={10}
            buttonOuterSize={20}
            buttonWrapStyle={styles.radioWrap}
            onPress={handleSelectAddress}
          />
          <RadioButtonLabel
            obj={addressOption}
            index={i}
            labelHorizontal={true}
            labelColor={colorText}
            labelStyle={[styles.radioLabel, { fontSize: 13 }]}
            onPress={handleSelectAddress}
          />
          {/*
            <ShellButton
              data={addressId}
              style={styles.removeButton}
              onPress={this.handleRemoveAddress}>
              <Text style={styles.removeText}>Remove</Text>
            </ShellButton>
          */}
        </RadioButton>
      </View>
    )
  }

  const hasAddresses = addresses && !!addresses.length

  return (
    <View style={styles.container}>
      {renderShippingAddresses(hasAddresses)}
      {hasAddresses ? (
        <ShellButton
          hitSize={10}
          style={styles.secondaryAddButton}
          onPress={handleAddAddress}
        >
          <Text color="green" fontStyle="bold" fontSize="h6">
            {`+ Add New ${addressType}`}
          </Text>
        </ShellButton>
      ) : null}
    </View>
  )
}

export default AddressesList
