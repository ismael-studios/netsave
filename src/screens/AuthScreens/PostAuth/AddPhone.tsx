import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import {
  Text,
  Button,
  ScrollView,
  PageTitle,
  Header,
  Input,
} from '../../../components'
import styles from './Styles'
import analytics from '@react-native-firebase/analytics'
import { ChangePhoneStackScreenProps } from '../../../navigation/types'
import { useUpdateUserMutation } from '../../../store/slice/api/features/user'
import { useAppSelector } from '../../../store/hooks'
import LinearGradient from 'react-native-linear-gradient'

const regex = new RegExp(/^[0-9]+$/)

const AddPhone = ({
  navigation,
  route,
}: ChangePhoneStackScreenProps<'AddPhone'>) => {
  const { isOnboard } = route.params
  const { sub } = useAppSelector((state) => state.session)

  const [phone, setPhone] = useState('')
  const [updateUser, { isLoading, isSuccess }] = useUpdateUserMutation()

  useEffect(() => {
    analytics().logScreenView({
      screen_class: 'AddPhone',
      screen_name: 'AddPhone',
    })
  }, [])

  useEffect(() => {
    if (isSuccess) {
      navigation.navigate('VerifyPhone', { isOnboard })
    }
  }, [isSuccess, navigation, isOnboard])

  const handleContinue = () => {
    updateUser({ id: sub, phone })
  }

  const validPhone =
    regex.test(phone.trim()) &&
    phone.trim().length >= 10 &&
    phone.trim().length <= 15

  const canSend = validPhone
  return (
    <View style={styles.container}>
      <Header avoidMode showBack progress={0.75} title="" />
      <ScrollView>
        <View style={styles.subContainer}>
          <PageTitle
            title={'Enter your phone number'}
            summary={
              'We take pride creating an authentic community with real people. Please help us confirm the authenticity of your profile.'
            }
          />
          <View style={styles.form}>
            <View>
              <Input
                bordered
                placeholder="Enter your phone number"
                value={phone}
                onChangeText={setPhone}
              />
              {phone !== '' && !validPhone && (
                <Text style={styles.errorText}>Invalid phone number</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <LinearGradient
        colors={['#ffffff', '#ffffff', '#eff6fb', '#e2f0f8', '#e2f0f8']}
        style={styles.footerBase}
      >
        <Button
          loading={isLoading}
          disabled={!canSend || isLoading}
          style={styles.button}
          onPress={handleContinue}
        >
          Continue
        </Button>
      </LinearGradient>
    </View>
  )
}

export default AddPhone
