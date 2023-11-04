import React, { useEffect, useState } from 'react'
import { View, Image } from 'react-native'
import {
  Header,
  Button,
  Text,
  ScrollView,
  SafeAreaView,
} from '../../../components'
import styles from './styles'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { MainStackScreenProps } from '../../../navigation/types'
import { useDeleteUserMutation } from '../../../store/slice/api/features/user'
import { logout } from '../../../store/slice/sessionSlice'
import LinearGradient from 'react-native-linear-gradient'
import { Colors, Images } from '../../../common'

const DeleteAccount = ({
  navigation,
}: MainStackScreenProps<'DeleteAccount'>) => {
  const dispatch = useAppDispatch()
  const { sub } = useAppSelector((state) => state.session)
  const [processing, setProcessing] = useState(false)

  const [deleteUser, { isLoading, isSuccess }] = useDeleteUserMutation()

  useEffect(() => {
    if (isSuccess) {
      setProcessing(true)
      dispatch(logout())
    }
  }, [dispatch, isSuccess])

  const handleBack = () => {
    navigation.goBack()
  }

  const handleDelete = () => {
    deleteUser({ userId: sub })
  }

  return (
    <SafeAreaView>
      <Header avoidMode showBack title="" />
      <LinearGradient
        colors={['#ffffff', '#ffffff', '#eff6fb', '#e2f0f8']}
        style={{
          flex: 2,
        }}
      >
        <ScrollView>
          <View style={styles.subContainer}>
            <Image source={Images.WARN} style={styles.logo} />
            <View style={styles.title}>
              <Text
                fontSize="h3"
                fontStyle="semiBold"
                color={Colors.black}
                center
              >
                Delete your account
              </Text>
            </View>
            <View style={styles.description}>
              <Text
                fontSize="large"
                fontStyle="medium"
                color={Colors.textGray}
                leading={23.22}
                center
              >
                When you delete your account, your profile, photos, videos,
                comments, likes and followers will be permanently removed.
              </Text>
            </View>
            <View style={styles.description}>
              <Text
                fontSize="large"
                fontStyle="medium"
                color={Colors.textGray}
                leading={23.22}
                center
              >
                Your account will be deleted in 30 days. You may sign in at
                anytime before the time period to stop the deletion process.
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.actions}>
          <Button
            blueGradient
            loading={isLoading || processing}
            onPress={handleBack}
            style={styles.ctaButton}
          >
            <Text fontSize="button" color={Colors.white} fontStyle="boldText">
              Keep my account
            </Text>
          </Button>

          <Button
            white
            loading={isLoading || processing}
            onPress={handleDelete}
            style={styles.ctaButton}
          >
            <Text
              fontSize="button"
              color={Colors.textDarkGray}
              fontStyle="normalText"
            >
              I want to delete my account
            </Text>
          </Button>
        </View>
      </LinearGradient>
    </SafeAreaView>
  )
}

export default DeleteAccount
