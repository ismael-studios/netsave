import React, { useEffect, useState } from 'react'
import { Image, View } from 'react-native'
import {
  Text,
  Button,
  ScrollView,
  PageTitle,
  Header,
  Input,
  Loading,
  ShellButton,
} from '../../../components'
import styles from './Styles'
import analytics from '@react-native-firebase/analytics'
import { OnboardStackScreenProps } from '../../../navigation/types'
import {
  useGetUserQuery,
  useUpdateUserMutation,
  useUploadProfileImageMutation,
} from '../../../store/slice/api/features/user'
import { trim } from 'ramda'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useAppSelector } from '../../../store/hooks'
import ImagePicker from 'react-native-image-crop-picker'
import Images from '../../../common/Images'
import LinearGradient from 'react-native-linear-gradient'

const { USER_PROFILE_CIRCLE } = Images

const regex = new RegExp(
  /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/
)

const CompleteProfile = ({
  navigation,
}: OnboardStackScreenProps<'CompleteProfile'>) => {
  const { sub } = useAppSelector((state) => state.session)
  const { data: user } = useGetUserQuery(sub ?? skipToken)

  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [username, setUsername] = useState(user?.username || '')
  const [description, setDescription] = useState(user?.description || '')

  const [profileImageUrl, setProfileImageUrl] = useState(user?.profileImageUrl)
  const [uploadProfileImage, { isLoading: isLoadingProfileImage }] =
    useUploadProfileImageMutation()
  const [updateUser, { isLoading, isSuccess }] = useUpdateUserMutation()

  useEffect(() => {
    analytics().logScreenView({
      screen_class: 'CompleteProfile',
      screen_name: 'CompleteProfile',
    })
  }, [])

  useEffect(() => {
    if (isSuccess) {
      navigation.navigate('ChangePhone', {
        screen: 'AddPhone',
        params: { isOnboard: true },
      })
    }
  }, [isSuccess, navigation])

  const handleAddPhoto = async () => {
    try {
      const response = await ImagePicker.openPicker({
        cropping: true,
        width: 480,
        height: 640,
        mediaType: 'photo',
        multiple: false,
        cropperCircleOverlay: true,
        useFrontCamera: true,
      })
      analytics().logEvent('signup_add_profile_photo_add')
      console.log('GOT FILE', response)
      setProfileImageUrl(response.path)
      uploadProfileImage({ image: response.path })
    } catch (e) {
      console.log('User cancelled image picker?', e)
    }
  }

  const handleContinue = () => {
    updateUser({ id: sub, firstName, lastName, username, description })
  }

  const validFirstName = regex.test(firstName.trim())
  const validLastName = regex.test(lastName.trim())
  const canSend = validFirstName && validLastName && username

  const InvalidNameText = (
    <Text style={styles.errorText}>
      Name must be more than 2 characters and not include symbols.
    </Text>
  )

  return (
    <View style={styles.container}>
      <Header avoidMode progress={0.6} title="" />
      <ScrollView>
        <View style={styles.subContainer}>
          <PageTitle title={'Complete Your Profile'} />
          <View style={styles.form}>
            <Loading
              show={isLoadingProfileImage}
              minHeight={100}
              loadingText="Uploading..."
            >
              <View style={styles.profileContainer}>
                <ShellButton
                  onPress={handleAddPhoto}
                  style={styles.profileButton}
                >
                  <Image
                    style={
                      profileImageUrl ? styles.profileImage : styles.profileIcon
                    }
                    source={
                      profileImageUrl
                        ? { uri: profileImageUrl }
                        : USER_PROFILE_CIRCLE
                    }
                  />
                </ShellButton>
                <ShellButton
                  style={styles.profileSelectButton}
                  onPress={handleAddPhoto}
                >
                  <Text style={styles.profileSelectText}>Select an image</Text>
                </ShellButton>
              </View>
            </Loading>

            <View style={styles.columRow}>
              <Input
                placeholder="Your first name"
                value={trim(firstName)}
                onChangeText={setFirstName}
                autoComplete="name"
                autoCapitalize="words"
              />
              {!!firstName && !validFirstName && InvalidNameText}
            </View>
            <View style={styles.columRow}>
              <Input
                placeholder="Your last name"
                value={trim(lastName)}
                onChangeText={setLastName}
                autoComplete="name"
                autoCapitalize="words"
              />
              {!!lastName && !validLastName && InvalidNameText}
              {/*<Text color="orange" fontStyle="bold" fontSize="tiny">
                Last name is strictly confidential & restricted from public
                view.
              </Text>*/}
            </View>

            <View style={styles.columRow}>
              <Input
                leftElement={<Text style={styles.atSign}>@</Text>}
                placeholder="Pick a username"
                value={trim(username)}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View>
              <Input
                multiline
                numberOfLines={4}
                placeholder="Enter a bio (optional)"
                value={description}
                onChangeText={setDescription}
                autoCapitalize="sentences"
              />
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

export default CompleteProfile
