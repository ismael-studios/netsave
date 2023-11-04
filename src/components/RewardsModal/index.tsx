import React from 'react'
import { Image, View } from 'react-native'
import { Button, ModalBox, Text } from '..'
import Images from '../../common/Images'
import { useAppDispatch } from '../../store/hooks'
import { clearActiveNotification } from '../../store/slice/notificationSlice'
import styles from './styles'
import * as RootNavigation from '../../navigation/RootNavigation'

const { CONFETTI2 } = Images
const points = 1000

const RewardsModal = () => {
  const dispatch = useAppDispatch()

  const handleClose = () => {
    dispatch(clearActiveNotification())
    RootNavigation.navigate('Home', {})
  }

  return (
    <ModalBox onHide={handleClose} visible={true} disableOutsideClose>
      <View style={styles.container}>
        <View style={styles.circleView}>
          <View style={styles.innerCircleView}>
            <Text color="white" fontStyle="bold">
              {points}
            </Text>
            <Text color="white" fontStyle="bold" fontSize="small" leading={12}>
              PTS
            </Text>
          </View>
        </View>
      </View>
      <View style={{ width: '100%' }}>
        <Image style={styles.confetti2} source={CONFETTI2} />
      </View>
      <View style={{ marginTop: 10 }}>
        <Text fontStyle="bold" fontSize="h3" center padded>
          Congratulations!
        </Text>
        <Text center padded>
          You have successfully posted an item, great job!
        </Text>
        <Text center padded>
          To celebrate, we've rewarded you with{' '}
          <Text fontStyle="bold">{points} points</Text>, which can be used
          towards your next purchase on Netsave.
        </Text>
      </View>
      <Button tight block style={{ marginTop: 20 }} onPress={handleClose}>
        Nice, Let's Go Shop!
      </Button>
    </ModalBox>
  )
}

export default RewardsModal
