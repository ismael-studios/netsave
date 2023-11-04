import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Appearance, FlatList, Image, View } from 'react-native'
import {
  Text,
  Header,
  Button,
  Switch,
  Input,
  ShowAlert,
  SafeAreaView,
  MapRadiusSlider,
} from '../../components'
import styles from './styles'
import inputStyles from '../../components/InputStyles'
import { Colors, Images, Metrics } from '../../common'
import Collapsible from 'react-native-collapsible'
import RNPickerSelect from 'react-native-picker-select'
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete'
import { GOOGLE_MAPS_API_KEY } from '../../constants/constants'
import {
  setTempVariable,
  requestLocationPermission,
  reverseAddress,
} from '../../helpers/LocationHelper'
import { Filter } from '../../types'
import { useFocusEffect } from '@react-navigation/native'
import { MainStackScreenProps } from '../../navigation/types'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useUpdateUserMutation } from '../../store/slice/api/features/user'
import { setUseLocation } from '../../store/slice/sessionSlice'
import { setMode } from '../../store/slice/appSlice'

const { CARET_DOWN } = Images
const { screenHeight } = Metrics
const Radii = [
  {
    label: '5 Miles',
    value: 5,
  },
  {
    label: '10 Miles',
    value: 10,
  },
  {
    label: '15 Miles',
    value: 15,
  },
  {
    label: '20 Miles',
    value: 20,
  },
  {
    label: '25 Miles',
    value: 25,
  },
  {
    label: '30 Miles',
    value: 30,
  },
  {
    label: '35 Miles',
    value: 35,
  },
  {
    label: '40 Miles',
    value: 40,
  },
  {
    label: '45 Miles',
    value: 45,
  },
  {
    label: '50 Miles',
    value: 50,
  },
]
// const DEF_ZIP = '90012'
const DEFAULT_LOCATION = {
  latitude: 34.026990488886035,
  longitude: -118.26481820907723,
}

const colorScheme = Appearance.getColorScheme()
const LocationSharing = ({
  navigation,
  route,
}: MainStackScreenProps<'LocationSharing'>) => {
  const { ReturnScreen, filters } = route.params || {}

  const dispatch = useAppDispatch()
  const { user, useLocation, signedIn } = useAppSelector(
    (state) => state.session
  )
  const ref = useRef<GooglePlacesAutocompleteRef>(null)

  const { mode } = useAppSelector((state) => state.app)

  const isLocal = mode === 'local'

  // states
  const [loading, setLoading] = useState(false)
  const [changes, setChanges] = useState(false)
  const [sharing, setSharing] = useState(useLocation)
  const [region, setRegion] = useState(user?.region)
  const [city, setCity] = useState(user?.city)
  const [zipCode, setZip] = useState(user?.postalCode)
  const [radius, setRadius] = useState(filters?.radius || user?.radius || 25)
  const [location, setLocation] = useState('')
  const [latlng, setLatLng] = useState(
    user?.lat
      ? {
          latitude: user.lat,
          longitude: user.lng,
        }
      : DEFAULT_LOCATION
  )

  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation()

  useEffect(() => {
    if (isSuccess) {
      setChanges(false)
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError) {
      ShowAlert({
        title: 'Hold on!',
        message: error.data.message,
        actions: [{ name: 'Okay', positive: true }],
      })
    }
  }, [isError, error])

  useFocusEffect(
    useCallback(() => {
      if (useLocation) {
        handleRequestLocation()
      }
    }, [useLocation])
  )

  useEffect(() => {
    setTimeout(() => {
      if (ref && ref.current) {
        ref.current.setAddressText(user?.city || '')
      }
      setLocation(user?.city || '')
    }, 100)
  }, [user])

  // handlers
  const handleSetLocation = (results) => {
    console.log(results)
    const { success } = results
    if (success) {
      const changes =
        city != results.city ||
        region != results.region ||
        zipCode != results.zipCode ||
        latlng.latitude.toFixed(1) != Number(results.latitude).toFixed(1) ||
        latlng.longitude.toFixed(1) != Number(results.longitude).toFixed(1)

      setRegion(results.region)
      setChanges(changes)
      setCity(results.city)
      setLocation(results.address)
      setLatLng({ latitude: results.latitude, longitude: results.longitude })
      setZip(results.zipCode)
      // if (!results.zipCode) alert('You need to select somewhere more specific.')
    } else {
      // error
    }
    setLoading(false)
  }

  const handleSelectLocation = (data, details) => {
    // console.log('data', data)
    // console.log('details', JSON.stringify(details))
    setChanges(true)
    if (details.geometry?.location) {
      const location1 = {
        lat: details.geometry.location.lat,
        lng: details.geometry.location.lng,
      }
      if (details.address_components?.length) {
        const postalCode = details.address_components.find((row) =>
          row.types.includes('postal_code')
        )
        const city1 = details.address_components.find((row) =>
          row.types.includes('locality')
        )
        const region1 = details.address_components.find((row) =>
          row.types.includes('administrative_area_level_1')
        )
        handleSetLocation({
          success: true,
          city: city1 ? city1.short_name : null,
          region: region1 ? region1.short_name : null,
          zipCode: postalCode ? postalCode.short_name : null,
          latitude: location1.lat,
          longitude: location1.lng,
          address: details.formatted_address,
        })
      }
    }
  }

  const handleRequestLocation = () => {
    setLoading(true)
    requestLocationPermission(({ success, location, hasPermission }) => {
      console.log('GOT LOCATION', success, location, hasPermission)
      if (hasPermission && success) {
        setSharing(true)
      } else {
        setSharing(false)
        setLoading(false)
        setLatLng(
          user?.lat
            ? {
                latitude: user?.lat,
                longitude: user?.lng,
              }
            : DEFAULT_LOCATION
        )
        setLocation('')
        // do the reverse geolocation
        // reverseAddress(postalCode || DEF_ZIP, handleSetLocation)
      }
      if (location) {
        reverseAddress(
          `${location.latitude},${location.longitude}`,
          handleSetLocation
        )
      }
    })
  }

  const handleChangeSharing = (value: boolean) => {
    setChanges(true)
    if (value) {
      handleRequestLocation()
    } else {
      setSharing(value)
    }
    dispatch(setUseLocation(value))
  }

  const handleSetRadius = (value) => {
    setChanges(true)
    setRadius(value)
  }

  const handleApply = () => {
    if (!user) {
      return
    }
    const profile = {
      id: user.id,
      lat: latlng.latitude,
      lng: latlng.longitude,
      city,
      region,
      radius,
      postalCode: zipCode,
    }
    // if (Number(zipCode) < 5)
    //   return ShowAlert({ message: 'Check that your postal code is valid.' })
    console.log('=====> SENDING PROFILE', profile)
    setLoading(true)
    if (signedIn) {
      updateUser(profile)
    } else {
      // props.setUser(profile)
      setLoading(false)
      setChanges(false)
    }
    dispatch(setMode('local'))
    setTempVariable(radius)
    navigation.navigate(ReturnScreen, {
      Filters: {
        radius,
        page: 1,
        mode: 'local',
        priceRange: 'null',
        lat: latlng.latitude,
        lng: latlng.longitude,
      },
      City: city,
    })
  }

  const handleBackPress = () => {
    if (changes) {
      ShowAlert({
        title: 'Hold on!',
        message:
          'You have unsaved changes.\nDo you wish to discard your changes?',
        actions: [
          {
            positive: true,
            name: 'Discard Changes',
            callback: () => {
              if (ReturnScreen) {
                navigation.navigate(ReturnScreen)
              } else {
                navigation.goBack()
              }
              console.log('Discards Changes')
            },
          },
          {
            name: 'Cancel',
          },
        ],
      })
      return true
    }
    if (ReturnScreen) {
      navigation.navigate(ReturnScreen, {
        Filters: {
          radius,
          page: 1,
          mode: 'local',
          priceRange: 'null',
          lat: latlng.latitude,
          lng: latlng.longitude,
        },
        City: city,
      })
      return true
    }
  }

  const delta = 0.35
  const { longitude, latitude } = latlng
  const mapRegion = {
    latitudeDelta: delta,
    longitudeDelta: delta,
    longitude,
    latitude,
  }
  const canSend = changes || !isLocal
  // || (zipCode && sharing) || (!sharing && location)

  return (
    <SafeAreaView style={styles.container}>
      <Header
        bordered
        showBack
        onBackPress={handleBackPress}
        title="Location"
        style={styles.header}
      />
      <VirtualizedList>
        <View style={styles.subContainer}>
          <View style={styles.formCol}>
            <View style={styles.switchRow}>
              <Text style={styles.label}>Location Sharing</Text>
              <View style={styles.switchContainer}>
                <View>
                  <Switch active={sharing} onChange={handleChangeSharing} />
                </View>
              </View>
            </View>
            <View style={styles.row}>
              <Text fontSize="standard" style={styles.locationSharingText}>
                Keeping this setting on helps us connect you with your local
                network.
              </Text>
            </View>
          </View>
          <Collapsible collapsed={sharing}>
            <View style={styles.formCol}>
              <Text style={styles.label}>
                City / State / Zip Code
                {canSend || !changes ? null : (
                  <Text style={styles.label} color={'orange'}>
                    *
                  </Text>
                )}
              </Text>
              <View style={styles.row}>
                <GooglePlacesAutocomplete
                  ref={ref}
                  key={sharing ? 'auto1' : 'auto0'}
                  placeholder="Enter location"
                  onPress={handleSelectLocation}
                  fetchDetails
                  query={{
                    key: GOOGLE_MAPS_API_KEY,
                    language: 'en',
                    type: 'geocode',
                    components: 'country:us',
                  }}
                  textInputProps={{
                    ...(colorScheme === 'dark' && {
                      placeholderTextColor: Colors.placeholderColor,
                    }),
                  }}
                  styles={{
                    textInputContainer: inputStyles.container,
                    textInput: {
                      paddingLeft: 0,
                      ...(colorScheme === 'dark' && {
                        color: 'black',
                      }),
                    },
                    row: {
                      paddingLeft: 0,
                    },
                    ...(colorScheme === 'dark' && {
                      description: {
                        color: 'black',
                      },
                    }),
                  }}
                />
              </View>
            </View>
          </Collapsible>
          <View style={styles.formMinCol}>
            <RNPickerSelect
              placeholder={{
                label: 'Default',
                value: 25,
              }}
              value={radius}
              onValueChange={handleSetRadius}
              items={Radii}
            >
              <Input
                disabled
                label="Radius"
                labelStyle={styles.label}
                wideFocus={false}
                style={styles.input}
                placeholder="Select A Radius"
                rightElement={
                  <Image source={CARET_DOWN} style={styles.arrowImage} />
                }
                value={`${radius} Miles`}
              />
            </RNPickerSelect>
          </View>
          <View>
            <MapRadiusSlider
              noTitle
              hideSlider
              location={mapRegion}
              radius={radius}
              onChange={setRadius}
              height={(screenHeight - 200) * 0.33}
            />
            <Text center fontSize="tiny" color="gray">
              {location}
            </Text>
          </View>
        </View>
        <View style={styles.actions}>
          <Button
            loading={loading}
            tight
            disabled={!canSend}
            onPress={handleApply}
          >
            Apply
          </Button>
        </View>
      </VirtualizedList>
    </SafeAreaView>
  )
}

export default LocationSharing

const VirtualizedList = ({ children }) => {
  return (
    <FlatList
      data={[]}
      keyExtractor={() => 'key'}
      renderItem={null}
      ListHeaderComponent={<>{children}</>}
      keyboardShouldPersistTaps="always"
    />
  )
}
