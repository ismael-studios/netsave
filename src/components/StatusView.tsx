import React from 'react'
import { StyleSheet, View } from 'react-native'

interface StatusViewProps {
  step1?: boolean
  step2?: boolean
  step3?: boolean
}

const StatusView = ({ step1, step2, step3 }: StatusViewProps) => {
  return (
    <View style={styles.statusView}>
      <View
        style={{
          ...styles.statusIndicatorView,
          ...((step1 || step2 || step3) && styles.statusIndicatorActive),
        }}
      ></View>
      <View
        style={{
          ...styles.statusIndicatorView,
          ...((step2 || step3) && styles.statusIndicatorActive),
        }}
      ></View>
      <View
        style={{
          ...styles.statusIndicatorView,
          ...(step3 && styles.statusIndicatorActive),
        }}
      ></View>
    </View>
  )
}

const styles = StyleSheet.create({
  statusView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusIndicatorView: {
    width: 107,
    height: 3,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  statusIndicatorActive: {
    backgroundColor: '#09894f',
  },
})

export default StatusView
