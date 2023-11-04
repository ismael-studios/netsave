import React, { useRef, useState } from 'react'
import {
  View,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native'
import { Input } from '../../components'
import { InputProps } from '../../components/Input'
import styles from './Styles'

interface PinCodeInputProps extends InputProps {
  pins: number
  flat?: boolean
}

const PinCodeInput = ({ pins, flat, onChangeText }: PinCodeInputProps) => {
  const [pinCode, setPinCode] = useState('')
  const inputRefs = useRef<{ [key: string]: TextInput }>({})

  const handlePinCode = (index: number) => {
    return (text: string) => handleSetPinCode(index, text)
  }

  const handleSetPinCode = (index: number, pin: string) => {
    const pins = pinCode.split('')
    pins[index] ? (pins[index] = pin) : pins.push(pin)
    const nextPin = pins.join('')
    const nextInput = inputRefs.current[Number(index) + Number(pin ? 1 : -1)]
    if (nextInput) {
      nextInput.focus()
    }
    setPinCode(nextPin)
    onChangeText && onChangeText(nextPin)
  }

  const handleBackSpace = ({
    nativeEvent: { key },
  }: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (key === 'Backspace') {
      const pinlength = pinCode.length
      const nextInput = inputRefs.current[pinlength]
      if (nextInput) nextInput.focus()
    }
  }

  return (
    <View style={[styles.row, styles.rowInputs, flat && { paddingTop: 0 }]}>
      {Array(pins)
        .fill(0)
        .map((_, i) => (
          <Input
            key={i}
            autoFocus={i === 0}
            center
            selectTextOnFocus
            maxLength={1}
            value={pinCode[i] || ''}
            numberOfLines={1}
            keyboardType="numeric"
            style={styles.blockInput}
            ref={(ref) => {
              if (ref) inputRefs.current[i] = ref
            }}
            inputStyle={styles.blockInputText}
            onChangeText={handlePinCode(i)}
            onKeyPress={handleBackSpace}
          />
        ))}
    </View>
  )
}

export default PinCodeInput
