import React, { useState } from 'react'
import { Image, View } from 'react-native'
import {
  Text,
  Button,
  SafeAreaView,
  ShellButton,
  Loading,
  Header,
} from '../../../components'
import styles from './Styles'
import { Images } from '../../../common'
import ImagePicker from 'react-native-image-crop-picker'
import analytics from '@react-native-firebase/analytics'
import { useAppSelector } from '../../../store/hooks'
import { useEffect } from 'react'
import { useUploadProfileImageMutation } from '../../../store/slice/api/features/user'
import { OnboardStackScreenProps } from '../../../navigation/types'

const { CAMERA_PLUS } = Images

const AddProfilePhoto = ({
  navigation,
}: OnboardStackScreenProps<'AddProfilePhoto'>) => {
  const { user } = useAppSelector((state) => state.session)
  const [profileImageUrl, setProfileImageUrl] = useState(user.profileImageUrl)
  const [uploadProfileImage, { isLoading }] = useUploadProfileImageMutation()

  useEffect(() => {
    analytics().logEvent('signup_add_profile_photo_start')
  }, [])

  const handleContinue = () => {
    analytics().logEvent('signup_add_profile_photo_complete')
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Welcome',
        },
      ],
    })
  }

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

  return (
    <SafeAreaView style={styles.container}>
      <Header showLogo />
      <View style={styles.topContainer}>
        <View style={styles.details}>
          <Text center padded fontStyle="bold" fontSize="h2">
            Upload your photo
          </Text>
          <Text fontSize="standard" center>
            Please add a photo of yourself to give neighbors & buyers confidence
            in your profile.
          </Text>
          <Loading show={isLoading} minHeight={300} loadingText="Uploading...">
            <View style={styles.features}>
              <ShellButton
                onPress={handleAddPhoto}
                style={[profileImageUrl && styles.circle]}
              >
                <Image
                  style={styles.featureIcon}
                  source={
                    profileImageUrl ? { uri: profileImageUrl } : CAMERA_PLUS
                  }
                />
              </ShellButton>
            </View>
            {profileImageUrl && (
              <ShellButton padded onPress={handleAddPhoto}>
                <Text
                  padded
                  center
                  fontSize="standard"
                  fontStyle="semiBold"
                  color="green"
                >
                  Change Photo
                </Text>
              </ShellButton>
            )}
          </Loading>
        </View>
      </View>
      {isLoading ? null : (
        <View style={styles.buttons}>
          {!profileImageUrl && (
            <Button
              disabled={isLoading}
              style={styles.buttonSpaced}
              onPress={handleAddPhoto}
            >
              {isLoading ? 'Uploading...' : 'Select Photo'}
            </Button>
          )}
          {profileImageUrl ? (
            <Button style={styles.buttonSpaced} onPress={handleContinue}>
              {'Continue'}
            </Button>
          ) : (
            <ShellButton style={styles.notNow} onPress={handleContinue}>
              <Text
                center
                fontSize="standard"
                fontStyle="semiBold"
                color="green"
              >
                Not Now
              </Text>
            </ShellButton>
          )}
        </View>
      )}
    </SafeAreaView>
  )
}

export default AddProfilePhoto
