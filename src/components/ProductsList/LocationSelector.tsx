import React, { Component } from 'react'
import { View, Image } from 'react-native'
import styles from './styles'
import Text from '../Text'
import ShellButton from '../ShellButton'
import { Images } from '../../common'
import { useNavigation } from '@react-navigation/native'

const { FILTERS, MAP_POINT } = Images

class LocationSelector extends Component {
  constructor(props) {
    super(props)
    const { radius = 25 } = props
    this.state = {
      radius,
      showSettings: false,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.showSettings && prevState.radius != nextProps.radius)
      prevState.radius = nextProps.radius
    return prevState
  }

  handleChange = (data) => {
    const { onChange } = this.props
    onChange && onChange(data)
  }

  handleRadius = (radius) => this.setState({ radius })

  handleChangeLocation = () => {
    const { navigation } = this.props
    navigation.navigate('LocationSharing', {
      SourceScreen: 'HomeScreen',
    })
  }

  handleGoToFilters = () => {
    const { filters, navigation } = this.props
    navigation.navigate('Filter', {
      ReturnScreen: 'Home',
      Filters: filters,
    })
  }

  handleLocationSharing = () => {
    const { filters, navigation } = this.props
    navigation.navigate('LocationSharing', {
      ReturnScreen: 'Home',
      Filters: filters,
    })
  }

  toggleMode = () => {
    const {
      location,
      filters: { mode },
      onChangeMode,
      requestLocation,
      navigation,
    } = this.props
    const isLocal = mode === 'local'
    if (location.latitude && location.longitude) {
      onChangeMode(isLocal ? 'nation' : 'local')
    } else {
      navigation.navigate('Login')
      // requestLocation()
    }
  }

  setMapSliderRef = (ref) => (this.mapSlider = ref)

  render() {
    const { radius, showSettings } = this.state
    const { city, filters, postalCode } = this.props
    const { mode } = filters
    const isLocal = mode === 'local'
    const LocationName = isLocal ? 'Nationwide' : 'Local Deals'
    return (
      <View style={styles.locationContainer}>
        <View style={styles.locationRow}>
          <ShellButton
            style={styles.locationButton}
            onPress={this.handleLocationSharing}
          >
            <Image source={MAP_POINT} style={styles.mapPoint} />
            <View style={styles.locationSummary}>
              {/*
                <Text fontSize='h7' color='green' fontStyle='bold'>
                  Switch to {LocationName}
                </Text>
                {isLocal ? (
                  <Text fontSize='h7' color='gray' fontStyle='semiBold'>
                    {'Viewing '}
                    <Text fontSize='h7' color='textBlack' fontStyle='bold'>
                      {`${radius} mile${radius == 1 ? '' : 's'}`}
                    </Text>
                    {' within '}
                    <Text fontSize='h7' color='textBlack' fontStyle='bold'>
                      {city}
                    </Text>
                  </Text>
                ) : (
                  <Text fontSize='h7' color='gray' fontStyle='semiBold'>
                    {'Viewing '}
                    <Text fontSize='h7' color='textBlack' fontStyle='bold'>
                      Nationwide
                    </Text>
                  </Text>
                )}
              */}
              {isLocal ? (
                <Text>
                  <Text style={styles.locationName}>
                    {city}
                    {postalCode ? ` ${postalCode}` : ''}
                  </Text>
                  {/* <Text style={styles.locationDivider}>{'  |  '}</Text>
                  <Text style={styles.locationName}>{`Within ${radius} mile${
                    radius == 1 ? '' : 's'
                  }`}</Text> */}
                </Text>
              ) : (
                <Text style={styles.locationName}>Nationwide</Text>
              )}
            </View>
          </ShellButton>
          <ShellButton
            style={styles.filterButton}
            onPress={this.handleGoToFilters}
          >
            <Image source={FILTERS} style={styles.filters} />
          </ShellButton>
        </View>
      </View>
    )
  }
}

export default (props) => {
  const navigation = useNavigation()
  return <LocationSelector {...props} navigation={navigation} />
}
