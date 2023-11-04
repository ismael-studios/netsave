import React, { useState, useEffect } from 'react'
import { Image, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import analytics from '@react-native-firebase/analytics'
import Rewards from '../../../enums/Rewards'
import { useAppSelector } from '../../../store/hooks'
import { useUpdateUserMutation } from '../../../store/slice/api/features/user'
import { useRedeemRewardsMutation } from '../../../store/slice/api/features/reward'
import { OnboardStackScreenProps } from '../../../navigation/types'
import { Text, Button, Header, ModalBox } from '../../../components'
import { Images, Metrics } from '../../../common'
import { Colors } from '../../../common'
import styles from './Styles'

const { WELCOME_CONFETTI, CONFETTI2, WELCOME_LOGO } = Images

const Welcome = ({ navigation }: OnboardStackScreenProps<'Welcome'>) => {
  const {
    user: { id },
  } = useAppSelector((state) => state.session)

  const [showWelcomeReward, setShowWelcomeReward] = useState(false)
  const [points, setPoints] = useState(0)
  const [updateUser] = useUpdateUserMutation()
  const [
    redeemReward,
    { data: redeemRewardData, isSuccess: isRedeemRewardSuccess },
  ] = useRedeemRewardsMutation()

  useEffect(() => {
    analytics().logEvent('signup_welcome_start')
    redeemReward(Rewards.SIGN_UP_20220101)
  }, [redeemReward])

  useEffect(() => {
    if (isRedeemRewardSuccess && redeemRewardData) {
      setShowWelcomeReward(true)
      setPoints(redeemRewardData.points)
    }
  }, [isRedeemRewardSuccess, redeemRewardData])

  const handleContinue = async () => {
    analytics().logEvent('signup_welcome_home')
    await updateUser({ id, isSignupCompleted: true }).unwrap()
    navigation.reset({
      index: 1,
      routes: [
        {
          name: 'Main',
          params: {
            screen: 'Shop',
          },
        },
        {
          name: 'BecomeSeller',
          params: {
            screen: 'BecomeSellerIntro',
          },
        },
      ],
    })
  }

  const handlePostProduct = async () => {
    analytics().logEvent('signup_welcome_post_product')
    try {
      await updateUser({ id, isSignupCompleted: true }).unwrap()
      navigation.reset({
        index: 1,
        routes: [
          {
            name: 'Main',
            params: {
              screen: 'Sell',
            },
          },
          {
            name: 'PostListing',
            params: {
              screen: 'ChooseCategory',
            },
          },
        ],
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleHideModal = () => {
    setShowWelcomeReward(false)
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#ffffff', '#ffffff', '#eff6fb', '#e2f0f8']}
        style={{
          flex: 2,
        }}
      >
        <Image source={WELCOME_CONFETTI} style={styles.welcomeConfetti} />
        <View
          style={[
            styles.topContainer,
            {
              position: 'absolute',
              top: 0,
              marginTop: Metrics.baseMargin * 2.8,
              paddingHorizontal: 0,
            },
          ]}
        >
          <Header avoidMode showLogo showBack />
          <View style={styles.welcomeDetails}>
            <Image style={styles.welcomeLogo} source={WELCOME_LOGO} />
            <Text fontSize="h3" color={Colors.black}>
              Welcome to Netsave
            </Text>
            <View style={styles.welcomeGift}>
              <Text
                fontSize="large"
                fontStyle="medium"
                leading={24}
                color={Colors.textGray}
                center
              >
                To welcome you to the Netsave family, we’ve gifted you
              </Text>
            </View>
            <View>
              <Text
                fontSize="large"
                fontStyle="semiBold"
                leading={24}
                color={Colors.blue}
                center
              >
                {points} points as a welcome present!
              </Text>
            </View>
            <View style={styles.welcomePointsUse}>
              <Text
                fontSize="large"
                fontStyle="medium"
                leading={24}
                color={Colors.textGray}
                center
              >
                You can use these points towards your purchase on Netsave.
                Enjoy!
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.buttons}>
          <Button style={styles.buttonSpaced} onPress={handleContinue}>
            Continue
          </Button>
          {/* <Button
              style={styles.buttonSpaced}
              color="orange"
              onPress={handlePostProduct}
            >
              Post an Item & Earn 1000 Points!
            </Button> */}
        </View>
      </LinearGradient>
      {/* <ModalBox
        onHide={handleHideModal}
        visible={showWelcomeReward}
        disableOutsideClose
      >
        <View
          style={{
            position: 'absolute',
            top: -120,
            backgroundColor: 'white',
            borderRadius: 100,
            padding: 12,
            zIndex: 10,
          }}
        >
          <View
            style={{
              backgroundColor: '#FF9C43',
              height: 110,
              width: 110,
              borderRadius: 55,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 5,
              borderColor: '#FF7A00',
            }}
          >
            <View
              style={{
                backgroundColor: '#FF7A00',
                height: 80,
                width: 80,
                borderRadius: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text color="white" fontStyle="bold">
                {points}
              </Text>
              <Text
                color="white"
                fontStyle="bold"
                fontSize="small"
                leading={12}
              >
                POINTS
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
            Welcome to Netsave!
          </Text>
          <Text center padded>
            You’ve been rewarded with{' '}
            <Text fontStyle="bold">{points} points</Text>, a{' '}
            <Text fontStyle="bold">$25.00 credit</Text> value that you can start
            applying right away to lower the costs of your purchases in the app.
            Enjoy!
          </Text>
        </View>
        <Button tight block style={{ marginTop: 20 }} onPress={handleHideModal}>
          Nice, Let's Go Shop!
        </Button>
      </ModalBox> */}
    </View>
  )
}
export default Welcome
