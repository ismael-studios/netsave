import React from 'react'
import { View } from 'react-native'
import {
  Text,
  Button,
  ScrollView,
  SafeAreaView,
  Header,
  Input,
  ShowAlert,
} from '../../../components'
import styles from './Styles'
import { reverseAddress } from '../../../helpers/LocationHelper'
import { useEffect, useState } from 'react'
import { useAppSelector } from '../../../store/hooks'
import { useUpdateUserMutation } from '../../../store/slice/api/features/user'
import { OnboardStackScreenProps } from '../../../navigation/types'

const LocationInfo = ({
  navigation,
}: OnboardStackScreenProps<'LocationInfo'>) => {
  const [loading, setLoading] = useState(false)
  const [zipCode, setZipCode] = useState('')
  const { user } = useAppSelector((state) => state.session)
  const [updateUser, { isSuccess, isLoading: isUpdateUserLoading, isError }] =
    useUpdateUserMutation()

  useEffect(() => {
    if (isSuccess) {
      navigation.navigate('AddProfilePhoto')
    }
  }, [isSuccess, navigation])

  useEffect(() => {
    if (isError) {
      ShowAlert({
        message:
          'There was an error trying to update your location. Try again.',
      })
      setLoading(false)
    }
  }, [isError])

  const handleContinue = () => {
    setLoading(true)
    reverseAddress(
      zipCode,
      ({ success, city, region, zipCode: postalCode, latitude, longitude }) => {
        if (success) {
          const { id } = user
          const profile = {
            id,
            lat: latitude,
            lng: longitude,
            radius: 25,
            city,
            region,
            postalCode: String(postalCode),
          }
          updateUser(profile)
        } else {
          setLoading(false)
        }
      }
    )
  }

  const canSend = !loading && zipCode.length > 4
  const isLoading = loading || isUpdateUserLoading

  return (
    <SafeAreaView style={styles.container}>
      <Header showLogo />
      <ScrollView>
        <View style={styles.subContainer}>
          <View style={styles.form}>
            <Text fontStyle="bold" fontSize="h2" style={styles.title}>
              Enter Your Address
            </Text>
            <View style={styles.row}>
              <Input
                // selectTextOnFocus
                label="Zip Code"
                placeholder="Zip Code"
                value={zipCode}
                onChangeText={setZipCode}
              />
            </View>
            <Button
              disabled={!canSend}
              loading={isLoading}
              style={[styles.button, styles.spaced]}
              onPress={handleContinue}
            >
              Continue
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default LocationInfo
