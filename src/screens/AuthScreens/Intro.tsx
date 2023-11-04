import React, { useEffect } from 'react'
import { Header, Button } from '../../components'
import { View, Image, ImageSourcePropType } from 'react-native'
import styles from './Styles'
import analytics from '@react-native-firebase/analytics'
import { AuthStackScreenProps } from '../../navigation/types'
import LinearGradient from 'react-native-linear-gradient'
import { SwiperFlatList } from 'react-native-swiper-flatlist'
import { Images } from '../../common'
import { Text } from '../../components'

const { GIRL_ON_PHONE, GIRL_BOY_DIALOG, GIRL_CART } = Images

interface SwipeItemProp {
  image: ImageSourcePropType
  title: string
  summary: string
}
interface SwipeRenderProp {
  item: SwipeItemProp
}

const Intro = ({ navigation }: AuthStackScreenProps<'Intro'>) => {
  useEffect(() => {
    analytics().logScreenView({
      screen_class: 'IntroScreen',
      screen_name: 'IntroScreen',
    })
  }, [])

  const handleLogin = () => navigation.navigate('Login')

  const handleSignUp = () => navigation.navigate('SignUp')

  const handleExploreTheApp = () => {
    navigation.navigate('LocationServices', {})
  }

  const renderSlide = ({
    item: { image, title, summary },
  }: SwipeRenderProp) => {
    return (
      <View style={styles.slide}>
        <Image source={image} style={styles.slideImage} />
        <Text center style={styles.slideTitle}>
          {title}
        </Text>
        <Text center style={styles.slideSummary}>
          {summary}
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        showLogo
        avoidMode
        rightButton="Log In"
        onRightPress={handleLogin}
      />
      <LinearGradient
        colors={['#ffffff', '#ffffff', '#eff6fb', '#e2f0f8']}
        style={styles.subContainer}
      >
        <View style={styles.introBody}>
          <SwiperFlatList
            autoplay
            autoplayDelay={5}
            autoplayLoop
            showPagination
            paginationStyle={styles.slidesPagination}
            paginationStyleItem={styles.slidePaginationDot}
            paginationStyleItemActive={styles.slidePaginationDotActive}
            style={styles.introSlides}
            data={[
              {
                image: GIRL_ON_PHONE,
                title: 'Buy from verified sellers',
                summary:
                  'Explore unique items from trusted sellers who are vetted and verified.',
              },
              {
                image: GIRL_BOY_DIALOG,
                title: 'Your Hyperlocal Marketplace',
                summary:
                  'Support locals in your community and connect with sellers in your neighborhood.',
              },
              {
                image: GIRL_CART,
                title: 'Sell your gently used stuff',
                summary:
                  'Become a verified seller and avoid scammers in a trusted community.',
              },
            ]}
            renderItem={renderSlide}
          />
        </View>
        <View style={styles.footer}>
          <Button blueGradient onPress={handleSignUp} style={styles.ctaButton}>
            Sign up for an account
          </Button>
          <Button white onPress={handleExploreTheApp} style={styles.ctaButton}>
            Explore the app
          </Button>
        </View>
      </LinearGradient>
    </View>
  )
}

export default Intro
