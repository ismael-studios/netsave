import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import Text from '../Text'
import styles from './styles'
import MapView, { Circle, PROVIDER_GOOGLE } from 'react-native-maps'
import { Colors, Images } from '../../common'
import { Slider } from '@miblanchard/react-native-slider'

const { SLIDER_NOTCH } = Images
const { green } = Colors

interface MapRadiusSliderProps {
  radius: number
  noTitle?: boolean
  noAnimation?: boolean
  noMap?: boolean
  hideSlider?: boolean
  sentence?: string
  location?: {
    latitude: number
    longitude: number
  }
  height?: number
  onChange: (radius: number) => void
}

const MapRadiusSlider = ({
  radius: initialRadius,
  noTitle,
  noAnimation,
  noMap,
  hideSlider,
  sentence = 'Showing your items within|Radius',
  location,
  height,
  onChange,
}: MapRadiusSliderProps) => {
  const [radius, setRadius] = useState(initialRadius)
  const [mapRadius, setMapRadius] = useState(radius)
  const circle = useRef<Circle>(null)

  useEffect(() => {
    setRadius(initialRadius)
  }, [initialRadius])

  const handleSetRadius = (value: number | number[]) => {
    if (typeof value === 'number') {
      setRadius(value)
      setMapRadius(value)
      onChange(value)
    }
  }

  const [pretext, postext] = sentence.split('|')
  const delta = 1.1 * ((noAnimation ? radius : mapRadius) / 50)
  const mapRegion = {
    ...location,
    latitudeDelta: delta,
    longitudeDelta: delta,
  }
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {noTitle ? null : (
          <Text fontStyle="semiBold" fontSize="h6">
            {pretext}{' '}
            <Text fontStyle="semiBold" fontSize="h6" color="orange">
              {radius} miles
            </Text>{' '}
            {postext}
          </Text>
        )}
        {!hideSlider && (
          <Slider
            containerStyle={styles.slider}
            thumbStyle={styles.thumb}
            minimumValue={1}
            maximumValue={50}
            step={1}
            minimumTrackTintColor="#DCDCDC"
            maximumTrackTintColor="#DCDCDC"
            thumbTintColor={green}
            value={radius}
            // thumbImage={SLIDER_NOTCH}
            onValueChange={handleSetRadius}
          />
        )}
      </View>
      {!noMap && location && (
        <View style={styles.mapContainer}>
          <MapView
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            scrollEnabled={false}
            style={[styles.map, { height }]}
            provider={PROVIDER_GOOGLE}
            region={mapRegion}
          >
            <Circle
              ref={circle}
              key="circle"
              center={location}
              radius={radius * 1100}
              strokeWidth={20}
              strokeColor={`${green}10`}
              fillColor={`${green}50`}
            />
            {/*
                <Marker
                  coordinate={location}
                  title={`${userLocation}`}
                />
              */}
          </MapView>
        </View>
      )}
    </View>
  )
}

export default MapRadiusSlider
