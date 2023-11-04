import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import {
  Text,
  Header,
  Button,
  ShowAlert,
  ScrollView,
  SafeAreaView,
  OptionsButton,
  MapRadiusSlider,
} from '../../components'
import styles from './styles'
import { setTempVariable } from '../../helpers/LocationHelper'
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button'
import { Colors, Images, Metrics } from '../../common'
import Collapsible from 'react-native-collapsible'

const { CARET_DOWN } = Images

const FilterScreen = (props) => {
  // props
  const { navigation, route } = props
  const { ReturnScreen, Filters } = route.params
  const LocalOption = { label: 'Local', value: 'local' }
  const NationOption = { label: 'Nationwide', value: 'nation' }
  const PriceOptions = [
    { label: 'All', value: 'null' },
    { label: 'Under $25', value: 'price:0 TO 25' },
    { label: '$25 to $50', value: 'price:25 TO 50' },
    { label: '$50 to $100', value: 'price:50 TO 100' },
    { label: '$100 and above', value: 'price >= 100' },
  ]
  const {
    location: { latitude, longitude },
  } = Filters
  const isAnonymous = latitude === 0 && longitude === 0

  // states
  const [mode, setMode] = useState(Filters.mode || 'local')
  const [price, setPrice] = useState(Filters.priceRange || '')
  const [radius, setRadius] = useState(Filters.radius || 25)
  const [showSlider, setShowSlider] = useState(false)

  // methods
  const findPrice = ({ value }) => value === price

  // handlers
  const handleUpdate = () => {
    navigation.navigate(ReturnScreen, {
      Filters: {
        mode,
        radius,
        price,
      },
    })
  }

  const handleToggleSlider = () => {
    setShowSlider(!showSlider)
  }

  const handleSetMode = (mode) => {
    const isLocal = mode === 'local'
    if (isAnonymous && isLocal) {
      // anonymous
      showLoginAlert()
    } else {
      // signed in
      setMode(mode)
      setShowSlider(isLocal)
    }
  }

  const showLoginAlert = () => {
    ShowAlert({
      title: 'Hold On!',
      message: 'You have to Log In or create an account to view local deals.',
      actions: [
        {
          name: 'Log In',
          positive: true,
          callback: () => navigation.navigate('Login'),
        },
      ],
    })
  }

  const handleSetRadius = (radius) => {
    if (isAnonymous) showLoginAlert()
    else {
      setRadius(radius[0])
      setTempVariable(radius[0])
      setMode(LocalOption.value)
    }
  }

  // renderers
  const renderLocationRow = () => (
    <View style={styles.filterRow}>
      <Text style={styles.label}>Location</Text>
      <View style={styles.radioRow}>
        <RadioButton labelHorizontal={true} style={styles.radios}>
          <RadioButtonInput
            obj={LocalOption}
            index={0}
            isSelected={mode == LocalOption.value}
            borderWidth={1}
            buttonColor={Colors.green}
            selectedButtonColor={Colors.green}
            selectedLabelColor={Colors.green}
            buttonSize={12}
            buttonOuterSize={25}
            onPress={handleSetMode}
          />
          <RadioButtonLabel
            obj={LocalOption}
            index={0}
            labelHorizontal={true}
            labelColor={Colors.darkGray}
            labelStyle={styles.radioLabel}
            onPress={handleSetMode}
          />
        </RadioButton>
        <OptionsButton
          hitSize={20}
          image={CARET_DOWN}
          iconStyle={showSlider && styles.flipCaret}
          onPress={handleToggleSlider}
        />
      </View>
      <Collapsible collapsed={!showSlider}>
        <View style={styles.radiusRow}>
          <View style={styles.radiusColumn}>
            <Text>
              <Text fontSize="standard" color="green" underlined>
                {radius}mi
              </Text>
              <Text fontSize="standard"> Radius</Text>
            </Text>
          </View>
          <View style={styles.sliderColumn}>
            <MapRadiusSlider
              noTitle
              noMap
              radius={radius}
              onChange={handleSetRadius}
            />
          </View>
        </View>
      </Collapsible>
      <RadioButton labelHorizontal={true} style={styles.radio}>
        <RadioButtonInput
          obj={NationOption}
          index={1}
          isSelected={mode == NationOption.value}
          onPress={handleSetMode}
          borderWidth={1}
          buttonColor={Colors.green}
          selectedButtonColor={Colors.green}
          selectedLabelColor={Colors.green}
          buttonSize={12}
          buttonOuterSize={25}
        />
        <RadioButtonLabel
          obj={NationOption}
          index={0}
          labelHorizontal={true}
          onPress={handleSetMode}
          labelColor={Colors.darkGray}
          labelStyle={styles.radioLabel}
        />
      </RadioButton>
    </View>
  )

  const renderPriceRow = () => (
    <View style={styles.filterRow}>
      <Text style={styles.label}>Price</Text>
      <RadioForm
        radio_props={PriceOptions}
        style={styles.radios}
        buttonColor={Colors.green}
        selectedButtonColor={Colors.green}
        selectedLabelColor={Colors.green}
        buttonSize={12}
        buttonOuterSize={25}
        labelColor={Colors.darkGray}
        labelStyle={styles.radioLabel}
        initial={PriceOptions.findIndex(findPrice)}
        animation={!Metrics.IS_ANDROID}
        onPress={setPrice}
      />
    </View>
  )

  const render = () => {
    return (
      <SafeAreaView style={styles.container}>
        <Header showBack title="Search Filters" style={styles.header} />
        <ScrollView>
          <View style={styles.filters}>
            {/*renderLocationRow()*/}
            {renderPriceRow()}
          </View>
        </ScrollView>
        <View style={styles.actions}>
          <Button tight onPress={handleUpdate}>
            Update
          </Button>
        </View>
      </SafeAreaView>
    )
  }

  return render()
}

export default FilterScreen
