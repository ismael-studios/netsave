import React, { useEffect, useState } from 'react'
import { Image, View } from 'react-native'
import { Text, Button, SafeAreaView, ShowAlert } from '../../../components'
import styles from './Styles'
import {
  requestLocationPermission,
  reverseAddress,
} from '../../../helpers/LocationHelper'
import { Colors, Images, Metrics } from '../../../common'
import analytics from '@react-native-firebase/analytics'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { setUseLocation } from '../../../store/slice/sessionSlice'
import { useUpdateUserMutation } from '../../../store/slice/api/features/user'
import {
  MainStackScreenProps,
  OnboardStackScreenProps,
} from '../../../navigation/types'
import LinearGradient from 'react-native-linear-gradient'

const { LOCATION_OUTLINE_CIRCLE } = Images

const LocationServices = ({
  navigation,
  route,
}: OnboardStackScreenProps<'LocationServices'>) => {
  const { isOnboard } = route.params

  const { user } = useAppSelector((state) => state.session)
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const [updateUser, { isSuccess, isLoading: isUpdateUserLoading, isError }] =
    useUpdateUserMutation()

  useEffect(() => {
    analytics().logEvent('signup_location_services_start')
  }, [])

  useEffect(() => {
    if (isSuccess) {
      if (isOnboard) {
        navigation.navigate('VerificationAndSafety')
      } else {
        navigation.navigate('Main', { screen: 'Shop' })
      }
    }
  }, [isSuccess, isOnboard, navigation])

  useEffect(() => {
    if (isError) {
      ShowAlert({
        message:
          'There was an error trying to update your location. Try again.',
      })
      setLoading(false)
    }
  }, [isError])

  const handleRequestLocation = () => {
    setLoading(true)
    requestLocationPermission(({ success, location, hasPermission }) => {
      const gotLocation = hasPermission && success && location
      console.log('GOT LOCATION', gotLocation, success, location, hasPermission)
      if (gotLocation) {
        analytics().logEvent('signup_location_services_geolocation')
        dispatch(setUseLocation(true))

        // do the reverse geolocation
        reverseAddress(
          `${location.latitude},${location.longitude}`,
          ({
            success: reverseAddressSuccess,
            city,
            region,
            latitude,
            longitude,
            zipCode: postalCode,
          }) => {
            if (reverseAddressSuccess) {
              const { id } = user
              const profile = {
                lat: latitude,
                lng: longitude,
                radius: 25,
                postalCode: String(postalCode),
                city,
                region,
                id,
              }
              updateUser(profile)
              setLoading(false)
            } else {
              setLoading(false)
            }
          }
        )
      } else {
        setLoading(false)
      }
    })
  }

  const handleContinue = () => {
    // analytics().logEvent('signup_location_services_zip_code')
    if (isOnboard) {
      navigation.navigate('VerificationAndSafety')
    } else {
      navigation.navigate('Main', { screen: 'Shop' })
    }
    dispatch(setUseLocation(false))
  }

  const isLoading = loading || isUpdateUserLoading
  return (
    <SafeAreaView>
      <LinearGradient
        colors={['#ffffff', '#ffffff', '#eff6fb', '#e2f0f8']}
        style={{
          flex: 2,
        }}
      >
        <View style={styles.topContainer}>
          <View style={styles.locationLogo}>
            <Image
              source={LOCATION_OUTLINE_CIRCLE}
              style={styles.locationLogoIcon}
            />
          </View>
          <View style={styles.locationDetail}>
            <View>
              <Text fontSize="h3" color={Colors.black}>
                Allow access to location
              </Text>
            </View>
            <View style={{ paddingTop: Metrics.baseMargin * 1.6 }}>
              <Text
                fontSize="h6"
                color={Colors.textGray}
                fontStyle="medium"
                leading={22}
              >
                Let us access your location to optimize your experience in the
                app & discover hidden treasures in your neighborhood.
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.buttons, styles.locationButtonGroup]}>
          <Button
            blueGradient
            loading={isLoading}
            style={styles.buttonSpaced}
            onPress={handleRequestLocation}
          >
            <Text white fontSize="button" fontStyle="bold">
              Allow access
            </Text>
          </Button>
          <Button
            outlined
            onPress={handleContinue}
            style={styles.buttonSpaced}
            color={Colors.borderLightGray}
          >
            <Text color={Colors.textDarkGray} fontStyle="buttonText">
              Maybe later
            </Text>
          </Button>
        </View>
      </LinearGradient>
    </SafeAreaView>
  )
}

export default LocationServices
