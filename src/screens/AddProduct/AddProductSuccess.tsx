import React, { useEffect } from 'react'
import { Dimensions, Image, View } from 'react-native'
import { Text, Button, SafeAreaView, ShowAlert } from '../../components'
import { Images } from '../../common'
import styles from './Styles'
import Share from 'react-native-share'
import analytics from '@react-native-firebase/analytics'
import { WEB_URL } from '../../services/ApiConstants'
import short from 'short-uuid'
import { useAppSelector } from '../../store/hooks'
import { PostListingStackScreenProps } from '../../navigation/types'

const { height } = Dimensions.get('window')
const { THUMBS_UP } = Images

const AddProductSuccess = ({
  navigation,
  route,
}: PostListingStackScreenProps<'AddProductSuccess'>) => {
  const { sellerProducts } = useAppSelector((state) => state.products)
  const {
    user: { id: userId },
  } = useAppSelector((state) => state.session)
  const { product } = route.params
  const { id, title, price } = product
  const userProducts = sellerProducts[userId] || []
  const count = userProducts.length
  const actionText =
    count > 0 && (userProducts[0].id != id || count > 1) ? '' : ' first'

  const shareProduct = () => {
    const translator = short()
    Share.open({
      title: 'Tell Friends',
      subject: title,
      message: `Hey! Check out my Netsave product: ${title} $${price} ${WEB_URL}/p/${translator.fromUUID(
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

  const goToPost = () =>
    navigation.navigate('ProductDetails', {
      product,
      productId: product.id,
      userId: product.userId,
    })

  const goHome = () => navigation.navigate('Home')

  useEffect(() => {
    analytics().logEvent('new_listing_complete')
  }, [])

  return (
    <SafeAreaView style={styles.base}>
      <View style={styles.congratsContainer}>
        <View style={styles.thumbsContainer}>
          <Image style={styles.thumbsUp} source={THUMBS_UP} />
        </View>
        <Text style={styles.congratsText}>Congratulations!</Text>
        <Text>Great work! Your{actionText} listing</Text>
        <Text>has been posted</Text>
      </View>
      <View style={styles.actions}>
        <Button tight style={styles.button} onPress={goToPost}>
          Go To Post
        </Button>
        <Button tight outlined style={styles.actionButton} onPress={goHome}>
          Shop Products
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default AddProductSuccess
