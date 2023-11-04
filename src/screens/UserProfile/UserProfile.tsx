import React, { useEffect, useState } from 'react'
import { View, Image, ImageBackground } from 'react-native'
import {
  Text,
  Header,
  Button,
  Loading,
  ShowAlert,
  ShellButton,
  FloatingMenu,
  ProductsList,
  RatingStars,
  ScrollView,
  ReviewList,
} from '../../components'
import styles from './UserProfileStyles'
import { Images } from '../../common'
import Share from 'react-native-share'
import FastImage from 'react-native-fast-image'
import Clipboard from '@react-native-community/clipboard'
import { WEB_URL } from '../../services/ApiConstants'
import short from 'short-uuid'
import R from 'ramda'
import Bio from './Bio'
import ImagePicker from 'react-native-image-crop-picker'
import { MainStackScreenProps } from '../../navigation/types'
import { useAppSelector } from '../../store/hooks'
import {
  useFollowUserMutation,
  useGetFollowersQuery,
  useGetFollowingQuery,
  useGetUserQuery,
  useUnfollowUserMutation,
  useUploadProfileImageMutation,
} from '../../store/slice/api/features/user'
import { useGetUserProductsQuery } from '../../store/slice/api/features/product'
import { useGetReviewsQuery } from '../../store/slice/api/features/review'
import { ProductTransactionReviewCriteriaType, ReviewType } from '../../types'

const translator = short()
const average = R.converge(R.divide, [R.sum, R.length])

const {
  temp: { LAPTOP, PROFILE_BG, PROFILE_BG_2 },
  USER_PROFILE_CIRCLE,
  ELLIPSIS,
  LINK,
  PENCIL_O,
  MESSAGING,
  SHARE,
  SILVER_BADGE,
  PHONE_CIRCLE,
  CHECK_CIRCLE,
  EXCLAMATION,
  CATEGORY_DISPLAY,
} = Images

const UserProfile = ({
  navigation,
  route,
}: MainStackScreenProps<'UserProfile'>) => {
  const { userId } = route.params
  const { user: currentUser, signedIn } = useAppSelector(
    (state) => state.session
  )
  const [showOptions, setShowOptions] = useState(false)
  const [menuOptions, setMenuOptions] = useState([])
  const [view, setView] = useState('Listings')
  const [currentReview, setCurrentReview] = useState<ReviewType>()
  const [isFollowing, setIsFollowing] = useState(false)
  const [page, setPage] = useState(1)

  const isMine = currentUser?.id === userId

  const { data: user } = useGetUserQuery(userId)

  const { data: products = [], isLoading: isLoadingProducts } =
    useGetUserProductsQuery({
      userId,
      page,
    })

  const { data: followers = [], isLoading: isLoadingFollowers } =
    useGetFollowersQuery(userId)
  const { data: following = [], isLoading: isLoadingFollowing } =
    useGetFollowingQuery(userId)

  const { data: sellerReviews = [] } = useGetReviewsQuery({
    userId,
    type: ProductTransactionReviewCriteriaType.SELLER,
  })
  const { data: buyerReviews = [] } = useGetReviewsQuery({
    userId,
    type: ProductTransactionReviewCriteriaType.BUYER,
  })

  const [uploadProfileImage, { isLoading: isLoadingUploadProfileImage }] =
    useUploadProfileImageMutation()
  const [followUser, { isLoading: isLoadingFollowUser }] =
    useFollowUserMutation()
  const [unfollowUser, { isLoading: isLoadingUnfollowUser }] =
    useUnfollowUserMutation()

  const loading = isLoadingProducts || isLoadingFollowers || isLoadingFollowing
  const updatingFollowing = isLoadingFollowUser || isLoadingUnfollowUser

  useEffect(() => {
    const menuOptions = [
      { name: 'Copy link', icon: LINK, callback: handleCopyLink },
    ]
    if (isMine) {
      menuOptions.push({
        name: 'Edit Profile',
        icon: PENCIL_O,
        callback: handleEditProfile,
      })
    } else {
      menuOptions.push({
        name: 'Message Seller',
        icon: MESSAGING,
        callback: handleMessageSeller,
      })
    }
    // share
    menuOptions.push({
      name: 'Share via...',
      icon: SHARE,
      callback: handleShareProfile,
    })
    setMenuOptions(menuOptions)
  }, [])

  useEffect(() => {
    if (!isMine) {
      setIsFollowing(followers.some((row) => row.id === currentUser.id))
    }
  }, [followers])

  if (!user) {
    return null
  }

  const goToAuth = () =>
    navigation.navigate('Login', {
      IntentScreen: 'UserProfile',
      IntentData: { User: user },
    })

  // handlers
  const handleShareProfile = () => {
    const { id, username, title, description } = user
    Share.open({
      title: 'Tell Friends',
      subject: title,
      message: `Check out Netsave seller @${username}'s products ${WEB_URL}/u/${translator.fromUUID(
        id
      )}`,
      failOnCancel: false,
    })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        err && console.log(err)
        ShowAlert({ message: 'There was an error while sharing.' })
      })
  }

  const handleCopyLink = () => {
    const { id } = user
    const userId = translator.fromUUID(id)
    Clipboard.setString(`${WEB_URL}/u/${userId}`)
    setShowOptions(false)
  }

  const handleEditProfile = () => {
    navigation.navigate('ProfileSettings')
  }

  const handleMessageSeller = () => {
    if (!signedIn) return goToAuth()
    navigation.navigate('ChatScreen')
  }

  const handleToggleOptions = () => {
    setShowOptions(!showOptions)
  }

  const handleProfileAction = () => {
    // write a stronger logic
    // to manage these actions
    if (!signedIn) return goToAuth()

    if (isMine) {
      // edit
      navigation.navigate('ProfileSettings')
      return
    }

    if (signedIn && currentUser) {
      // check for follow or unfollow
      if (isFollowing) {
        unfollowUser({ userId: user.id, followerId: currentUser.id })
      } else {
        followUser({
          userId: user.id,
          data: {
            followerId: currentUser.id,
          },
        })
      }
    }
  }

  const handlePostItem = () => {
    navigation.navigate(signedIn ? 'Sell' : 'Login')
  }

  const handleScroll = (event) => {
    const {
      nativeEvent: {
        contentOffset = { y: 0 }, //: {x, y},
        contentSize = { height: 0 }, //: {height, width},
        layoutMeasurement = { height: 0 }, //: {height, width},
      },
    } = event
    const { id } = user
    const scrollProgress =
      (contentOffset.y + layoutMeasurement.height) / contentSize.height
    if (scrollProgress > 0.85 && !loading) {
      const divisible = products.length / 10
      const isEmpty = products.length == 0
      const hasRemainder = isEmpty || String(divisible).match(/\./)
      const nextPage = divisible + 1
      if (hasRemainder) {
        // no need to get more since
        // the last result came up short
      } else {
        // fetch the next page
        setPage(nextPage)
      }
    }
  }

  //renderers
  const renderUserVerification = () => {
    return (
      isMine && (
        <View style={styles.verifyContainer}>
          <Text fontStyle="bold">
            Verify your account to build your reputation
          </Text>
          <View style={styles.verifyActions}>
            <ShellButton style={styles.verifyButton}>
              <Image source={CHECK_CIRCLE} style={styles.icon} />
              <Text fontSize="tiny" fontStyle="semiBold">
                Verified for Email
              </Text>
            </ShellButton>
            <ShellButton style={[styles.verifyButton, styles.borderLeft]}>
              <Image source={PHONE_CIRCLE} style={styles.icon} />
              <Text fontSize="tiny" fontStyle="semiBold">
                Verify for Phone
              </Text>
            </ShellButton>
          </View>
        </View>
      )
    )
  }

  const renderSellerProducts = () => {
    // fetch user products by filter
    const { id, username } = user
    const productsCount = products.length
    const components = []

    if (productsCount) {
      components.push(
        <ProductsList
          signedIn={signedIn}
          showPostLoader={true}
          hidePreloader={true}
          postEmpty={false}
          loading={products.length == 0 && loading}
          key="products"
          products={products}
          // HeaderComponent={HeaderComponent}
          onScroll={handleScroll}
        />
      )
    } else if (!loading) {
      // if (!productsCount && !loading) {
      if (isMine) {
        components.push(
          <ScrollView key="post">
            <View style={styles.newPost}>
              {/* <Image source={LAPTOP} style={styles.newPostImage} /> */}
              <Image source={CATEGORY_DISPLAY} style={styles.categoryDisplay} />
              <Text fontSize="standard" paragraph2x>
                You currently don't have any listings.
              </Text>
              {/* <Button
                style={styles.newPostButton}
                onPress={this.handlePostItem}
              >
                POST AN ITEM
              </Button> */}
              <Button
                style={styles.newPostButton}
                color="orange"
                onPress={handlePostItem}
              >
                Post an Item & Earn 1000 Points!
              </Button>
            </View>
          </ScrollView>
        )
      } else {
        components.push(
          <View style={styles.noListingsView}>
            <Text fontSize="small">
              {username} currently doesn't have any active listings.
            </Text>
          </View>
        )
      }

      // }
    }

    return components
  }

  const renderReviews = () => {
    return (
      <ReviewList user={user} showReviewOptions={handleToggleReviewOption} />
    )
  }

  const renderAbout = () => {
    const { description, username } = user
    return (
      <Bio
        description={description || ''}
        username={username}
        isMine={isMine}
        id={user.id}
      />
    )
  }

  const renderOptionsButton = () => {
    return (
      <ShellButton style={styles.optionsButton} onPress={handleToggleOptions}>
        <Image source={ELLIPSIS} style={styles.optionsIcon} />
      </ShellButton>
    )
  }

  const handleMenuPress = (view: 'Listings' | 'Reviews' | 'About') => {
    setView(view)
  }

  const handleToggleReviewOption = (review: ReviewType) => {
    setCurrentReview(
      (currentReview && review.id === currentReview.id) || !review
        ? undefined
        : review
    )
  }

  const handleReport = ({ review }) => {
    navigation.navigate('ReportReview', {
      screen: 'ReportReviewInfo',
      params: { Review: review },
    })
    setCurrentReview(undefined)
  }

  const handleCloseReviewOption = () => {
    setCurrentReview(undefined)
  }

  const handleSelectUserPic = async () => {
    // this.setState({
    //   uploading: true,
    // })
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

  const {
    id,
    rating,
    username,
    lastName,
    firstName,
    profileImageId,
    profileImageUrl,
    city,
    region,
    postalCode,
  } = user

  const fullName = `${firstName} ${lastName}`
  const userImage = profileImageUrl
    ? { uri: profileImageUrl }
    : USER_PROFILE_CIRCLE
  let userLocation = ''
  if (city) userLocation += `${city}, `
  if (region) userLocation += `${region} `
  const randomSales = Math.floor(Math.random() * 99)
  const randomPurchases = Math.floor(Math.random() * 99)
  const usernameEscaped = username.split('@')[0]
  const screenTitle = isMine ? 'My Public Profile' : `@${usernameEscaped}`

  const reviewsCount = sellerReviews.length + buyerReviews.length
  const averageRating = average(
    [...sellerReviews, ...buyerReviews].map(({ rating }) => rating)
  ).toFixed(1)
  const productsCount = products.length

  return (
    <View style={styles.container}>
      <Header
        showBack
        bordered
        avoidMode
        title={screenTitle}
        // rightElement={this.renderOptionsButton()}
      />
      <Loading show={loading && !profileImageUrl}>
        <View style={styles.container}>
          {/*this.renderUserVerification()*/}
          <ImageBackground style={styles.userContainer} source={PROFILE_BG_2}>
            <ShellButton style={styles.userMedia} onPress={handleSelectUserPic}>
              <FastImage style={styles.userPic} source={userImage} />
              <Image style={styles.userBadge} source={SILVER_BADGE} />
            </ShellButton>
            <View style={styles.userInfo}>
              <Text style={styles.userAlias}>@{usernameEscaped}</Text>
              {+averageRating ? (
                <View style={styles.sellerRated}>
                  <Text style={styles.rating}>{averageRating}</Text>
                  <RatingStars
                    score={averageRating}
                    size={15}
                    style={styles.reviewStars}
                  />
                  {/* <Text style={styles.sellerReviews}>
                      {reviewsCount} reviews
                    </Text> */}
                </View>
              ) : null}
              <Text style={styles.userLocation}>
                {userLocation.toUpperCase()}
              </Text>
              <View style={styles.profileActions}></View>
            </View>
            <View style={styles.userStats}>
              <View style={styles.userStat}>
                <Text white center fontStyle="semiBold" fontSize={'medium'}>
                  {followers.length}
                </Text>
                <Text white center fontStyle="semiBold" fontSize={'small'}>
                  FOLLOWERS
                </Text>
              </View>
              <View style={styles.userStat}>
                <Text white center fontStyle="semiBold" fontSize={'medium'}>
                  {following.length}
                </Text>
                <Text white center fontStyle="semiBold" fontSize={'small'}>
                  FOLLOWING
                </Text>
              </View>
              {!isMine ? (
                <Button slim disabled={loading} onPress={handleProfileAction}>
                  <Text white fontStyle="semiBold" fontSize="regular">
                    {isMine
                      ? 'Edit Profile'
                      : isFollowing
                      ? updatingFollowing
                        ? 'Unfollowing...'
                        : 'Unfollow'
                      : updatingFollowing
                      ? 'Following...'
                      : 'Follow'}
                  </Text>
                </Button>
              ) : (
                <View style={{ width: 100 }} />
              )}
            </View>
          </ImageBackground>
          <View style={styles.menu}>
            {['Listings', 'Reviews', 'About'].map((tab) => (
              <ShellButton
                key={tab}
                style={[styles.menuButton, view === tab && styles.menuActive]}
                onPress={() => handleMenuPress(tab)}
              >
                <Text fontSize="h6" fontStyle="bold">
                  {`${tab}${
                    tab === 'Listings'
                      ? ` (${productsCount})`
                      : tab === 'Reviews'
                      ? ` (${reviewsCount})`
                      : ''
                  }`}
                </Text>
              </ShellButton>
            ))}
          </View>
          {view === 'Listings' && renderSellerProducts()}
          {view === 'Reviews' && renderReviews()}
          {view === 'About' && renderAbout()}
        </View>
        {showOptions && (
          <FloatingMenu
            menu={menuOptions}
            closeCallBack={handleToggleOptions}
          />
        )}
        {currentReview && (
          <FloatingMenu
            key={'reviewMenu'}
            title="More"
            menu={[
              {
                name: 'Report Review',
                icon: EXCLAMATION,
                callback: handleReport,
                review: currentReview,
              },
            ]}
            closeCallBack={handleCloseReviewOption}
          />
        )}
      </Loading>
    </View>
  )
}

export default UserProfile
