import React from 'react'
import { View, Linking, Image, ActivityIndicator } from 'react-native'
import { Text, ShellButton, Header, ScrollView } from '../../../components'
import styles from './styles'
import FastImage from 'react-native-fast-image'
import { Images } from '../../../common'
import ImagePicker from 'react-native-image-crop-picker'
import { MainStackScreenProps } from '../../../navigation/types'
import { useAppSelector } from '../../../store/hooks'
import {
  useGetFollowersQuery,
  useGetFollowingQuery,
  useUploadProfileImageMutation,
} from '../../../store/slice/api/features/user'

const { CARET_LEFT, CAMERA, USER_PROFILE_CIRCLE } = Images

const menues = [
  { name: 'Edit My Profile Settings', route: 'PrivacySettings' },
  { name: 'Location Services', route: 'LocationSharing' },
]

const ProfileSettings = ({
  navigation,
}: MainStackScreenProps<'ProfileSettings'>) => {
  const { user, sub } = useAppSelector((state) => state.session)
  const { profileImageUrl } = user

  const { data: followers = [], isLoading: isLoadingFollowers } =
    useGetFollowersQuery(sub)
  const { data: following = [], isLoading: isLoadingFollowing } =
    useGetFollowingQuery(sub)

  const [uploadProfileImage, { isLoading: isLoadingUploadProfileImage }] =
    useUploadProfileImageMutation()

  const handleMenuPress = ({ route, link, mail, callback }) => {
    callback && callback({ route, mail, link })
    route && navigation.navigate(route)
    link && navigation.navigate('WebScreen', { uri: link })
    mail && Linking.openURL(mail)
  }

  const handleGoToPrivacySettings = () => {
    navigation.navigate('PrivacySettings')
  }

  const handleSelectUserPic = async () => {
    ImagePicker.openPicker({
      cropping: true,
      width: 480,
      height: 640,
      mediaType: 'photo',
      multiple: false,
      cropperCircleOverlay: true,
      useFrontCamera: true,
    })
      .then((response) => {
        // good to go
        console.log('GOT FILE', response)
        uploadProfileImage({
          image: response.path,
        })
      })
      .catch((e) => console.log('User cancelled image picker?', e))
  }

  const renderMenu = (menu, i) => {
    return (
      <View
        style={[styles.menu, i == menues.length - 1 && styles.last]}
        key={i}
      >
        <ShellButton
          style={styles.menuButton}
          data={menu}
          onPress={handleMenuPress}
        >
          <Text style={styles.menuText}>{menu.name}</Text>
          <FastImage source={CARET_LEFT} style={styles.menuCaret} />
        </ShellButton>
      </View>
    )
  }

  const { id, city, region, username, firstName, lastName, description } = user
  const FullName = `${firstName} ${lastName}`
  const userImage = profileImageUrl
  let userLocation = ''
  if (city) userLocation += city
  if (region) userLocation += `, ${region}`
  const randomSales = Math.floor(Math.random() * 99)
  const randomPurchases = Math.floor(Math.random() * 99)

  return (
    <View style={styles.container}>
      <Header avoidMode showBack title="My Profile Settings" />
      <View style={styles.top}>
        <View style={styles.userMedia}>
          <ShellButton onPress={handleSelectUserPic}>
            {isLoadingUploadProfileImage && (
              <ActivityIndicator style={styles.uploading} />
            )}
            <FastImage
              source={
                profileImageUrl ? { uri: profileImageUrl } : USER_PROFILE_CIRCLE
              }
              style={styles.userImage}
            />
            <Image source={CAMERA} style={styles.camera} />
          </ShellButton>
        </View>
        <ShellButton
          style={styles.userInfo}
          onPress={handleGoToPrivacySettings}
        >
          <Text style={styles.username}>@{username}</Text>
          <Text style={styles.infoText}>{FullName}</Text>
          <Text style={styles.infoText}>{userLocation}</Text>
          <Text style={styles.infoText}>
            {followers.length} Followers - {following.length} Following
          </Text>
        </ShellButton>
      </View>
      <View style={styles.userBio}>
        <Text style={styles.bioTitle}>My Bio</Text>
        {description ? (
          <Text style={styles.bioText}>{description}</Text>
        ) : (
          <ShellButton
            data={{ route: 'PrivacySettings' }}
            onPress={handleMenuPress}
          >
            <Text paragraph color="green" fontSize="small">
              Add Your Bio
            </Text>
          </ShellButton>
        )}
      </View>
      <ScrollView>
        <View style={styles.menues}>{menues.map(renderMenu)}</View>
      </ScrollView>
    </View>
  )
}

export default ProfileSettings
