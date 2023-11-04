import React from 'react'
import { View } from 'react-native'
import { Button, Text } from '../../components'
import { BecomeSellerStackScreenProps } from '../../navigation/types'

const BecomeSellerIntroScreen = ({
  navigation,
}: BecomeSellerStackScreenProps<'BecomeSellerIntro'>) => {
  const handleNext = () => {
    navigation.navigate('BecomeSellerForm')
  }
  const handleBack = () => {
    navigation.goBack()
  }
  return (
    <View>
      <Text>Become seller</Text>
      <Button onPress={handleNext}>Become a trusted seller</Button>

      <Button onPress={handleBack}>Go to home page and do this later</Button>
    </View>
  )
}

export default BecomeSellerIntroScreen
