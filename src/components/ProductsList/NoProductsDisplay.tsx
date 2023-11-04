import React from 'react'
import { View, ScrollView } from 'react-native'
import Text from '../Text'
import styles from './NoProductsStyles'

const NoProductsDisplay = (): JSX.Element => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.noProducts}>
        <Text fontSize="h1" fontStyle="bold" center paragraph>
          No results found
        </Text>
        <Text style={styles.sorryText}>
          We couldn’t find anything that matches your search.
        </Text>
      </View>
    </ScrollView>
  )
}

export default NoProductsDisplay
