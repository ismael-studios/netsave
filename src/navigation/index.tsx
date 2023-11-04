import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack'
import TabBar from '../components/FooterNav'
import { Colors } from '../common'
import {
  Login,
  SignUp,
  CheckEmail,
  VerifyCode,
  ResetPassword,
  ChangePassword,
  ChoosePassword,
  // post auth
  Welcome,
  LocationInfo,
  InviteContacts,
  AddProfilePhoto,
  LocationServices,
  VerificationAndSafety,
} from '../screens/AuthScreens'
import AddProduct from '../screens/AddProduct/AddProduct'
import ChooseCategory from '../screens/AddProduct/ChooseCategory'
import Drafts from '../screens/AddProduct/Drafts'
import Address from '../screens/AddressScreen/Address'
import AddProductPricing from '../screens/AddProduct/AddProductPricing'
import AddProductDelivery from '../screens/AddProduct/AddProductDelivery'
import AddProductSize from '../screens/AddProduct/AddProductSize'
import AddProductPayment from '../screens/AddProduct/AddProductPayment'
import AddProductSuccess from '../screens/AddProduct/AddProductSuccess'
import Splash from '../screens/SplashScreen'
import Home from '../screens/HomeScreen'
import Likes from '../screens/LikesScreen'
import Chat, { WrappedChannelScreen, streami18n } from '../screens/ChatScreen'
import {
  More,
  MyOffers,
  MyEarnings,
  Withdraw,
  EarningsDetails,
  BankAccount,
  ProfileSettings,
  PrivacySettings,
  DeleteAccount,
} from '../screens/MoreScreen'
import ProductDetails from '../screens/ProductDetails'
import { UserProfile } from '../screens/UserProfile'
import WebView from '../screens/WebViewScreen'
import FilterScreen from '../screens/FilterScreen'
import RateScreen from '../screens/Reviews/RateTransaction'
import FeedbackScreen from '../screens/Reviews/Feedback'
import ReviewSuccessScreen from '../screens/Reviews/ReviewSuccess'
import ReportScreen from '../screens/Reviews/Report'
import ReportSuccessScreen from '../screens/Reviews/ReportSuccess'
import ReportProblem from '../screens/Reviews/ReportProblem'
import ReportProblemSuccess from '../screens/Reviews/ReportProblemSuccess'
import DisputeScreen from '../screens/Reviews/Dispute'
import DisputeSuccessScreen from '../screens/Reviews/DisputeSuccess'
import DeliveryOptions from '../screens/PaymentScreen/DeliveryOptions'
import PaymentOptions from '../screens/PaymentScreen/PaymentOptions'
import OnlinePayment from '../screens/PaymentScreen/OnlinePayment'
import GenerateLabel from '../screens/Shipping/GenerateLabel'
import ViewLabel from '../screens/Shipping/ViewLabel'
import TrackShipment from '../screens/Shipping/TrackShipment'
import BuyerQRCode from '../screens/QRCodeScreen'
import SellerQrScanner from '../screens/QrScanner'
import LocationSharing from '../screens/LocationSharing'
import { MyListings } from '../screens/MoreScreen/MyListings'
import { navigationRef } from './RootNavigation'
import { OverlayProvider } from 'stream-chat-react-native'
import { StreamChatGenerics } from '../services/Chat'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useStreamChatTheme } from '../screens/ChatScreen/useStreamChatTheme'
import { useGetUserQuery, userApi } from '../store/slice/api/features/user'
import ChatClient from '../services/Chat'
import { setIsChatReady } from '../store/slice/appSlice'
import * as Sentry from '@sentry/browser'
import analytics from '@react-native-firebase/analytics'
import SiftReactNative from 'sift-react-native'
import { requestFCMToken } from '../helpers/FCMHelper'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import SignUpEmail from '../screens/AuthScreens/SignUpEmail'
import Intro from '../screens/AuthScreens/Intro'
import CompleteProfile from '../screens/AuthScreens/PostAuth/CompleteProfile'
import VerifyPhone from '../screens/AuthScreens/PostAuth/VerifyPhone'
import AddPhone from '../screens/AuthScreens/PostAuth/AddPhone'
import BecomeSellerIntroScreen from '../screens/BecomeSeller/BecomeSellerIntro'
import BecomeSellerFormScreen from '../screens/BecomeSeller/BecomeSellerForm'

const defaultScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: Colors.white },
}

const SplashStack = createNativeStackNavigator()
const SplashStackScreen = () => (
  <SplashStack.Navigator screenOptions={defaultScreenOptions}>
    <SplashStack.Screen name="Splash" component={Splash} />
  </SplashStack.Navigator>
)

// const ShopStack = createNativeStackNavigator()
// const ShopStackScreen = () => (
//   <ShopStack.Navigator screenOptions={defaultScreenOptions}>
//     <ShopStack.Screen name="Home" component={Home} />
//   </ShopStack.Navigator>
// )

const AuthStack = createNativeStackNavigator()
const AuthStackScreen = () => (
  <AuthStack.Navigator screenOptions={defaultScreenOptions}>
    <AuthStack.Screen name="Intro" component={Intro} />
    <AuthStack.Screen name="Main" component={MainNoAuthNavigator} />
    <AuthStack.Screen name="Login" component={Login} />
    <AuthStack.Screen name="SignUp" component={SignUp} />
    <AuthStack.Screen name="SignUpEmail" component={SignUpEmail} />
    <AuthStack.Screen name="ChoosePassword" component={ChoosePassword} />
    <AuthStack.Screen name="CheckEmail" component={CheckEmail} />
    <AuthStack.Screen name="VerifyCode" component={VerifyCode} />
    <AuthStack.Screen
      name="ResetPassword"
      component={ResetPasswordStackScreen}
    />
    <AuthStack.Screen name="WebScreen" component={WebView} />
    <AuthStack.Screen name="LocationServices" component={LocationServices} />
  </AuthStack.Navigator>
)

const OnboardStack = createNativeStackNavigator()
const OnboardStackScreen = () => (
  <OnboardStack.Navigator screenOptions={defaultScreenOptions}>
    <OnboardStack.Screen name="CompleteProfile" component={CompleteProfile} />
    <OnboardStack.Screen
      name="ChangePhone"
      component={ChangePhoneStackScreen}
    />
    <OnboardStack.Screen name="LocationServices" component={LocationServices} />
    {/* <OnboardStack.Screen name="InviteContacts" component={InviteContacts} /> */}
    {/* <OnboardStack.Screen name="LocationInfo" component={LocationInfo} /> */}
    {/* <OnboardStack.Screen name="AddProfilePhoto" component={AddProfilePhoto} /> */}
    <OnboardStack.Screen
      name="VerificationAndSafety"
      component={VerificationAndSafety}
    />
    <OnboardStack.Screen name="Welcome" component={Welcome} />
  </OnboardStack.Navigator>
)

const ChangePhoneStack = createNativeStackNavigator()
const ChangePhoneStackScreen = () => (
  <ChangePhoneStack.Navigator screenOptions={defaultScreenOptions}>
    <ChangePhoneStack.Screen name="AddPhone" component={AddPhone} />
    <ChangePhoneStack.Screen name="VerifyPhone" component={VerifyPhone} />
  </ChangePhoneStack.Navigator>
)

const ResetPasswordStack = createNativeStackNavigator()
const ResetPasswordStackScreen = () => (
  <ResetPasswordStack.Navigator screenOptions={defaultScreenOptions}>
    <ResetPasswordStack.Screen
      name="ResetPasswordRequest"
      component={ResetPassword}
    />
    <ResetPasswordStack.Screen name="CheckEmail" component={CheckEmail} />
    <ResetPasswordStack.Screen
      name="ChangePassword"
      component={ChangePassword}
    />
  </ResetPasswordStack.Navigator>
)

const BecomeSellerStack = createNativeStackNavigator()
const BecomeSellerStackScreen = () => (
  <BecomeSellerStack.Navigator screenOptions={defaultScreenOptions}>
    <BecomeSellerStack.Screen
      name="BecomeSellerIntro"
      component={BecomeSellerIntroScreen}
    />
    <BecomeSellerStack.Screen
      name="BecomeSellerForm"
      component={BecomeSellerFormScreen}
    />
  </BecomeSellerStack.Navigator>
)

const SellStack = createNativeStackNavigator()
const SellStackScreen = () => (
  <SellStack.Navigator screenOptions={defaultScreenOptions}>
    <SellStack.Screen name="Drafts" component={Drafts} />
  </SellStack.Navigator>
)

const PostListingStack = createNativeStackNavigator()

const PostListingStackScreen = () => (
  <PostListingStack.Navigator screenOptions={defaultScreenOptions}>
    <PostListingStack.Screen name="ChooseCategory" component={ChooseCategory} />
    <PostListingStack.Screen name="AddProduct" component={AddProduct} />
    <PostListingStack.Screen
      name="AddProductPricing"
      component={AddProductPricing}
    />
    <PostListingStack.Screen
      name="AddProductDelivery"
      component={AddProductDelivery}
    />
    <PostListingStack.Screen name="AddProductSize" component={AddProductSize} />
    <PostListingStack.Screen
      name="AddProductPayment"
      component={AddProductPayment}
    />
    <PostListingStack.Screen
      name="PreviewProductDetails"
      component={ProductDetails}
    />
    <PostListingStack.Screen
      name="AddProductSuccess"
      component={AddProductSuccess}
    />
  </PostListingStack.Navigator>
)

const AccountStack = createNativeStackNavigator()
const AccountStackScreen = () => (
  <AccountStack.Navigator screenOptions={defaultScreenOptions}>
    <AccountStack.Screen name="More" component={More} />
  </AccountStack.Navigator>
)

const TransactionStack = createNativeStackNavigator()
const TransactionStackScreen = () => (
  <TransactionStack.Navigator screenOptions={defaultScreenOptions}>
    <TransactionStack.Screen
      name="DeliveryOptions"
      component={DeliveryOptions}
    />
    <TransactionStack.Screen name="PaymentOptions" component={PaymentOptions} />
    <TransactionStack.Screen name="OnlinePayment" component={OnlinePayment} />
    <TransactionStack.Screen
      name="GenerateShippingLabel"
      component={GenerateLabel}
    />
    <TransactionStack.Screen name="ViewShippingLabel" component={ViewLabel} />
    <TransactionStack.Screen name="TrackShipping" component={TrackShipment} />
    <TransactionStack.Screen name="Dispute" component={DisputeScreen} />
    <TransactionStack.Screen
      name="DisputeSuccess"
      component={DisputeSuccessScreen}
    />
    <TransactionStack.Screen
      name="SellerQrScanner"
      component={SellerQrScanner}
    />
    <TransactionStack.Screen name="BuyerQRCode" component={BuyerQRCode} />
    <TransactionStack.Screen name="RateTransaction" component={RateScreen} />
    <TransactionStack.Screen name="Feedback" component={FeedbackScreen} />
    <TransactionStack.Screen
      name="ReviewSuccess"
      component={ReviewSuccessScreen}
    />
    <TransactionStack.Screen name="ReportProblem" component={ReportProblem} />
    <TransactionStack.Screen
      name="ReportProblemSuccess"
      component={ReportProblemSuccess}
    />
  </TransactionStack.Navigator>
)

const ReportReviewStack = createNativeStackNavigator()
const ReportReviewStackScreen = () => (
  <ReportReviewStack.Navigator screenOptions={defaultScreenOptions}>
    <ReportReviewStack.Screen
      name="ReportReviewInfo"
      component={ReportScreen}
    />
    <ReportReviewStack.Screen
      name="ReportSuccess"
      component={ReportSuccessScreen}
    />
  </ReportReviewStack.Navigator>
)

const Tab = createBottomTabNavigator()
const TabNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <TabBar {...props} />}
    screenOptions={({ route }) => ({
      tabBarActiveTintColor: Colors.darkGray,
      tabBarInactiveTintColor: Colors.green,
      headerShown: false,
    })}
  >
    <Tab.Screen name="Shop" component={Home} />
    <Tab.Screen name="Likes" component={Likes} />
    <Tab.Screen name="Sell" component={SellStackScreen} />
    <Tab.Screen
      name="Chat"
      component={Chat}
      options={{ tabBarLabel: 'Messages', lazy: true }}
    />
    <Tab.Screen name="Account" component={AccountStackScreen} />
  </Tab.Navigator>
)

const MainNoAuth = createNativeStackNavigator()
const MainNoAuthNavigator = () => (
  <MainNoAuth.Navigator screenOptions={defaultScreenOptions}>
    <MainNoAuth.Screen name="MainNoAuth" component={TabNavigator} />
    <MainNoAuth.Screen name="LocationSharing" component={LocationSharing} />
    <MainNoAuth.Screen name="Filter" component={FilterScreen} />
    <MainNoAuth.Screen name="ProductDetails" component={ProductDetails} />
    <MainNoAuth.Screen name="UserProfile" component={UserProfile} />
  </MainNoAuth.Navigator>
)

const Main = createNativeStackNavigator()
const MainNavigator = () => {
  const { sub } = useAppSelector((state) => state.session)
  const { data: user } = useGetUserQuery(sub ?? skipToken)

  const isSignupCompleted = user ? user.isSignupCompleted : true

  return (
    <Main.Navigator screenOptions={defaultScreenOptions}>
      {!isSignupCompleted ? (
        <Main.Screen name="Onboarding" component={OnboardStackScreen} />
      ) : (
        <>
          <Main.Screen name="Main" component={TabNavigator} />
          <Main.Screen name="Channel" component={WrappedChannelScreen} />
          <Main.Screen name="ProductDetails" component={ProductDetails} />
          <Main.Screen name="LocationSharing" component={LocationSharing} />
          <Main.Screen name="Filter" component={FilterScreen} />
          <Main.Screen
            name="BecomeSeller"
            component={BecomeSellerStackScreen}
          />
          <Main.Screen name="PostListing" component={PostListingStackScreen} />
          <Main.Screen name="MyListings" component={MyListings} />
          <Main.Screen name="WebScreen" component={WebView} />
          <Main.Screen name="ProfileSettings" component={ProfileSettings} />
          <Main.Screen
            name="ReportReview"
            component={ReportReviewStackScreen}
          />
          <Main.Screen name="UserProfile" component={UserProfile} />
          <Main.Screen name="MyOffers" component={MyOffers} />
          <Main.Screen name="MyEarnings" component={MyEarnings} />
          <Main.Screen name="Withdraw" component={Withdraw} />
          <Main.Screen name="BankAccount" component={BankAccount} />
          <Main.Screen name="EarningsDetails" component={EarningsDetails} />
          <Main.Screen name="Transaction" component={TransactionStackScreen} />
          <Main.Screen name="ShippingAddress" component={Address} />
          <Main.Screen name="PrivacySettings" component={PrivacySettings} />
          <Main.Screen
            name="ResetPassword"
            component={ResetPasswordStackScreen}
          />
          <Main.Screen name="DeleteAccount" component={DeleteAccount} />
        </>
      )}
    </Main.Navigator>
  )
}

const AppNavigator = () => {
  const dispatch = useAppDispatch()
  const { isInitialized } = useAppSelector((state) => state.app)
  const {
    sub,
    token,
    user: existingUser,
  } = useAppSelector((state) => state.session)
  const isAuth = !!token
  const { data: user, isSuccess } = useGetUserQuery(
    sub || existingUser?.id || skipToken
  )
  const { bottom } = useSafeAreaInsets()
  const theme = useStreamChatTheme()
  const hasUser = !!user?.id

  useEffect(() => {
    if (isSuccess && user && user.id) {
      const initChat = async () => {
        try {
          dispatch(setIsChatReady(false))
          await ChatClient.connectUser(
            {
              id: user.id,
              name: user.username,
            },
            async () => {
              const result = dispatch(
                userApi.endpoints.getChatToken.initiate(user.id)
              )
              const chatToken = await result.unwrap()
              result.unsubscribe()
              return chatToken
            }
          )
          dispatch(setIsChatReady(true))
        } catch (err) {
          console.error(err)
          Sentry.captureMessage(
            '[stream-chat connectUser]: ' + err,
            Sentry.Severity.Error
          )
        }

        try {
          const firebaseToken = await requestFCMToken()
          if (firebaseToken) {
            await ChatClient.addDevice(firebaseToken, 'firebase')
          }
        } catch (err) {
          console.error(err)
          Sentry.captureMessage(
            '[stream-chat addDevice]: ' + err,
            Sentry.Severity.Error
          )
        }
      }

      Sentry.setUser({
        id: user.id,
      })
      analytics().setUserId(user.id)
      SiftReactNative.setUserId(user.id)
      if (!ChatClient.user) {
        initChat()
      }
    }
  }, [dispatch, isSuccess, user])

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={{
        colors: {
          ...DefaultTheme.colors,
          background: theme.colors?.white_snow || '#FCFCFC',
        },
        dark: false,
      }}
    >
      <OverlayProvider<StreamChatGenerics>
        bottomInset={bottom}
        i18nInstance={streami18n}
        value={{ style: theme }}
      >
        {!isInitialized && <SplashStackScreen />}
        {isInitialized && !isAuth && <AuthStackScreen />}
        {isInitialized && isAuth && hasUser && <MainNavigator />}
      </OverlayProvider>
    </NavigationContainer>
  )
}

export default AppNavigator
