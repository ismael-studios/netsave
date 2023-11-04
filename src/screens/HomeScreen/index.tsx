import React, { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import {
  Header,
  ProductsList,
  ShowAlert,
  HideAlert,
  ShowInputAlert,
} from '../../components'
import styles from './styles'
import { getTempVariable } from '../../helpers/LocationHelper'
import { PRODUCTS_LIMIT } from '../../services/ApiConstants'
import { QuickCategories } from '../../components/ProductsList/CategoryData'
import analytics from '@react-native-firebase/analytics'
import {
  checkLocationPermission,
  requestLocationPermission,
  reverseAddress,
} from '../../helpers/LocationHelper'
import { useGetCategoriesQuery } from '../../store/slice/api/features/category'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import * as appActions from '../../store/slice/appSlice'
import { setUseLocation, setUser } from '../../store/slice/sessionSlice'
import {
  infoApi,
  useGetUserLocationQuery,
} from '../../store/slice/api/features/info'
import { useGetAllProductsQuery } from '../../store/slice/api/features/product'
import { useFocusEffect } from '@react-navigation/native'
import { MainTabScreenProps } from '../../navigation/types'

const HomeScreen = ({ navigation, route }: MainTabScreenProps<'Shop'>) => {
  const dispatch = useAppDispatch()
  const { data: categories = [] } = useGetCategoriesQuery()
  const { signedIn, user } = useAppSelector((state) => state.session)
  const {
    loading,
    fetchingAllProducts,
    mode: imode,
  } = useAppSelector((state) => state.app)
  const { allProducts } = useAppSelector((state) => state.products)
  const isLocal = imode === 'local'
  const {
    radius,
    city: icity = '',
    lat = 0,
    lng = 0,
    postalCode: ipostalCode,
  } = user || {}
  const [filter, setFilter] = useState({
    radius: isLocal ? radius || 25 : 0,
    page: 0,
    priceRange: 'null',
    lat,
    lng,
    qs: '',
  })
  const [notNow, setNotNow] = useState(false)
  const [declinedZip, setDeclinedZip] = useState(false)
  const [city, setCity] = useState(icity)
  const [postalCode, setPostalCode] = useState(ipostalCode)
  const [mode, setMode] = useState(imode || 'local')
  const [category, setCategory] = useState(QuickCategories[0])
  const [skipUserLocation, setSkipUserLocation] = useState(true)

  const { data: userLocationData } = useGetUserLocationQuery(undefined, {
    skip: skipUserLocation,
  })

  const { data } = useGetAllProductsQuery(filter)
  // console.log(data)

  useEffect(() => {
    console.log(userLocationData)
    if (userLocationData) {
      setPostalCode(userLocationData.postalCode)
      setCity(userLocationData.city)
      setFilter({
        ...filter,
        radius: 25,
        page: 0,
        priceRange: 'null',
        lat: +userLocationData.lat,
        lng: +userLocationData.lng,
      })
    }
  }, [userLocationData])

  useEffect(() => {
    analytics().logScreenView({
      screen_class: 'HomeScreen',
      screen_name: 'HomeScreen',
    })
    // firstly
    if (filter.page === 0 || !filter.page) {
      callGetProducts(filter)
    }

    if (!lat && !lng) {
      checkForLocation()
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      console.log('HOME FOCUS')
      const { Filters, City } = route.params || {}
      // const { filter, city } = this.state
      if (Filters) {
        const { mode, radius, price } = Filters
        let updatedFilters = {
          ...filter,
          priceRange: price,
          radius: mode === 'local' ? radius : 0,
          city: City || city,
        }

        const { lat, lng } = Filters
        if ((lat && lat !== filter.lat) || (lng && lng !== filter.lng)) {
          updatedFilters = {
            ...updatedFilters,
            ...{
              lat,
              lng,
              page: 0,
            },
          }
        }

        setMode(mode)
        setFilter(updatedFilters)
        if (City) {
          setCity(City)
        }
        dispatch(appActions.setMode(mode))

        callGetProducts(updatedFilters)
        // clear filters
        navigation.setParams({ Filters: null })
      }
    }, [])
  )

  const callGetProducts = (filter) => {
    // this.props.getAllProducts({ ...filter, limit: PRODUCTS_LIMIT })
  }

  const handleDenyLocation = () => {
    HideAlert()
    setNotNow(true)
    setTimeout(() => askForZip(), 500)
  }

  const handleRoughLocation = () => {
    setSkipUserLocation(false)
  }

  const checkForLocation = () => {
    checkLocationPermission((success) => {
      if (success) {
        askForLocation()
      } else {
        setDeclinedZip(false)
        setNotNow(false)
        // ShowAlert({
        //   title: 'Turn On Location Services?',
        //   message: 'Turn on location services for the best Netsave experience.',
        //   actions: [
        //     {
        //       name: 'Yes, Turn On Location',
        //       positive: true,
        //       callback: askForLocation,
        //     },
        //     {
        //       name: 'Not now',
        //       callback: handleDenyLocation,
        //     },
        //     {
        //       name: '',
        //       positive: false,
        //       callback: handleDenyLocation,
        //     },
        //   ],
        // })
      }
    })
  }

  const askForLocation = (fallback = false) => {
    try {
      requestLocationPermission(({ success, location, hasPermission }) => {
        const gotLocation = hasPermission && location && success
        console.log('GOT LOCATION', gotLocation)
        console.log('success', success)
        console.log('location', location)
        console.log('hasPermission', hasPermission)
        if (success) {
          dispatch(setUseLocation(true))
          if (location) {
            console.log('CALLING REVERSE', location)
            reverseAddress(
              `${location.latitude}, ${location.longitude}`,
              handleSetLocation
            )
          }
        } else if (fallback) {
          askForZip()
        }
      })
    } catch (e) {
      console.log('LOCATION ERROR', e)
    }
  }

  const askForZip = () => {
    ShowInputAlert({
      title: 'Provide your zip code instead?',
      message: 'Alternatively, you could use your',
      inputConfig: {
        label: 'Zip Code:',
        keyboardType: 'numeric',
        validation: (input) => input.length >= 5,
      },
      actions: [
        {
          name: 'View Local Deals',
          positive: true,
          callback: ({ input }) => {
            reverseAddress(input, handleSetLocation)
          },
        },
        {
          name: 'View Nationwide Only',
          callback: () => {
            setDeclinedZip(true)
          },
        },
        {
          name: '',
          positive: false,
          callback: handleRoughLocation,
        },
      ],
    })
  }

  const checkIfSearchEmpty = (searchText: string) => {
    if (searchText === '' && filter.qs) {
      handleSearch(searchText)
    }
  }

  const handleSetLocation = ({
    success,
    city,
    region,
    latitude,
    longitude,
    zipCode: postalCode,
  }) => {
    if (success) {
      dispatch(
        setUser({
          postalCode,
          city,
          region,
          lat: latitude,
          lng: longitude,
          radius: 25,
        })
      )
      const newFilter = {
        ...filter,
        page: 0,
        lat: latitude,
        lng: longitude,
        radius: 25,
      }
      setCity(city)
      setMode('local')
      setFilter(newFilter)
      callGetProducts(newFilter)
    } else {
      ShowAlert({
        message: 'There was an error fetching your location. Try again.',
        actions: [
          {
            name: 'Try Again',
            positive: true,
            callback: checkForLocation,
          },
        ],
      })
    }
  }

  const handleChangeProductCategory = (category) => {
    const newFilter = {
      ...filter,
    }
    if (category.id === 'all') delete newFilter.category
    else if (category.id === 'localDeals') {
      delete newFilter.category
      newFilter.radius = 5
    } else {
      newFilter.category = category.id
    }
    newFilter.page = 0
    setCategory(category)
    setFilter(newFilter)
    callGetProducts(newFilter)
  }

  const handleChangeLocation = ({ city, radius }) => {
    const newFilter = {
      ...filter,
    }
    newFilter.radius = radius
    newFilter.page = 0
    setFilter(newFilter)
    callGetProducts(newFilter)
  }

  const handleChangeMode = (mode) => {
    const newFilter = { ...filter }
    newFilter.radius = mode !== 'local' ? null : getTempVariable(radius || 25)
    newFilter.page = 0
    setMode(mode)
    setFilter(newFilter)
    dispatch(appActions.setMode(mode))
    callGetProducts(newFilter)
  }

  const handleSearch = (search: string) => {
    const newFilter = { ...filter }
    if (search) {
      newFilter.qs = search
    } else {
      delete newFilter.qs
    }
    filter.page = 0
    setFilter(newFilter)
    callGetProducts(newFilter)
  }

  const handleScroll = (event) => {
    const {
      nativeEvent: {
        contentOffset = { y: 0 }, //: {x, y},
        contentSize = { height: 0 }, //: {height, width},
        layoutMeasurement = { height: 0 }, //: {height, width},
      },
    } = event
    const scrollProgress =
      (contentOffset.y + layoutMeasurement.height) / contentSize.height
    if (scrollProgress > 0.85 && !loading) {
      const divisible = allProducts.length / PRODUCTS_LIMIT
      const isEmpty = allProducts.length == 0
      const hasRemainder = isEmpty || String(divisible).match(/\./)
      const nextPage = divisible + 1
      if (hasRemainder) {
        // no need to get more since
        // the last result came up short
      } else {
        // fetch the next page
        filter.page = nextPage
        callGetProducts(filter)
      }
    }
  }

  const location = {
    latitude: lat,
    longitude: lng,
  }

  return (
    <View style={styles.container}>
      <Header
        avoidMode
        showSearch
        onSearch={handleSearch}
        onSearchChangeText={checkIfSearchEmpty}
      />
      <View style={styles.container}>
        <ProductsList
          showLocation
          showCategories
          postEmpty
          hideNoProductsText={!signedIn}
          signedIn={signedIn}
          loading={loading}
          fetchingAllProducts={fetchingAllProducts}
          location={location}
          city={city}
          radius={filter.radius || user?.radius || 25}
          postalCode={user?.postalCode}
          category={category}
          categories={categories}
          mode={mode}
          filters={{
            mode,
            city,
            priceRange: filter.priceRange,
            radius: getTempVariable(filter.radius) || user?.radius,
            location,
            category,
            qs: filter.qs,
          }}
          query={filter.qs}
          onChangeCategory={handleChangeProductCategory}
          onChangeLocation={handleChangeLocation}
          onChangeMode={handleChangeMode}
          requestLocation={askForLocation}
          products={allProducts}
          onScroll={handleScroll}
        />
      </View>
    </View>
  )
}

export default HomeScreen
