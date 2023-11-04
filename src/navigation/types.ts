import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import {
  BalanceTransaction,
  Filter,
  Offer,
  ProductTransactionReviewCriteriaType,
  ProductType,
  ReviewType,
  ShippingAddressType,
  TransactionType,
} from '../types'

type MainTabParamList = {
  Shop: undefined
  Likes: undefined
  Sell: undefined
  Chat: undefined
  Account: undefined
}

type MainNoAuthStackParamList = {
  MainNoAuth: NavigatorScreenParams<MainTabParamList>
  LocationSharing: {
    filters?: Filter
  }
  // Filter: undefined
  ProductDetails: {
    userId: string
    productId: string
    product?: ProductType
    isEditing?: boolean
    previewMode?: boolean
  }
  UserProfile: {
    userId: string
  }
}

type AuthStackParamList = {
  Intro: undefined
  Main: NavigatorScreenParams<MainNoAuthStackParamList>
  Login: undefined
  SignUp: undefined
  SignUpEmail: undefined
  // ChoosePassword: {
  //   firstName: string
  //   lastName: string
  //   email: string
  // }
  CheckEmail: {
    destination: 'ChangePassword' | 'VerifyCode'
    email: string
  }
  VerifyCode: {
    email: string
    password: string
    isResend: boolean
  }
  ResetPassword: NavigatorScreenParams<ResetPasswordStackParamList>
  WebScreen: {
    uri: string
  }
  LocationServices: {
    isOnboard?: boolean
  }
}

type ChangePhoneStackParamList = {
  AddPhone: {
    isOnboard?: boolean
  }
  VerifyPhone: {
    isOnboard?: boolean
  }
}

type BecomeSellerStackParamList = {
  BecomeSellerIntro: undefined
  BecomeSellerForm: undefined
}

type OnboardStackParamList = {
  CompleteProfile: undefined
  ChangePhone: NavigatorScreenParams<ChangePhoneStackParamList>
  LocationServices: {
    isOnboard?: boolean
  }
  VerificationAndSafety: undefined
  Welcome: undefined
  // InviteContacts: undefined
  // LocationInfo: undefined
  // AddProfilePhoto: undefined
}

type PostListingStackParamList = {
  ChooseCategory: undefined
  AddProduct: {
    categoryId: number
    isEditMode: boolean
    productId?: string
  }
  AddProductPricing: {
    product: ProductType
    isEditMode: boolean
  }
  AddProductDelivery: {
    product: ProductType
    isEditMode: boolean
  }
  AddProductSize: {
    product: ProductType
  }
  AddProductPayment: {
    product: ProductType
    isEditMode: boolean
  }
  PreviewProductDetails: {
    userId: string
    productId: string
    product?: ProductType
    isEditing?: boolean
    previewMode?: boolean
  }
  AddProductSuccess: {
    product: ProductType
  }
}

type TransactionStackParamList = {
  DeliveryOptions: {
    product: ProductType
    offer: Offer
    transaction: TransactionType
  }
  PaymentOptions: {
    product: ProductType
    offer: Offer
    transaction: TransactionType
  }
  OnlinePayment: {
    product: ProductType
    offer: Offer
    transaction: TransactionType
    address?: ShippingAddressType
  }
  GenerateShippingLabel: {
    product: ProductType
    offer: Offer
    transaction: TransactionType
  }
  ViewShippingLabel: { transaction: TransactionType }
  TrackShipping: {
    product: ProductType
    transaction: TransactionType
  }
  Dispute: {
    transaction: TransactionType
  }
  DisputeSuccess: {
    userId: string
  }
  SellerQrScanner: {
    product: ProductType
    transaction: TransactionType
  }
  BuyerQRCode: {
    product: ProductType
    transaction: TransactionType
  }
  RateTransaction: {
    product: ProductType
    transaction: TransactionType
    type: ProductTransactionReviewCriteriaType
  }
  Feedback: {
    product: ProductType
    transaction: TransactionType
    type: ProductTransactionReviewCriteriaType
    rating: { [key: number]: number }
  }
  ReviewSuccess: {
    product: ProductType
  }
  ReportProblem: {
    transaction: TransactionType
  }
  ReportProblemSuccess: undefined
}

type ReportReviewStackParamList = {
  ReportReviewInfo: {
    review: ReviewType
  }
  ReportSuccess: {
    userId: string
  }
}

type ResetPasswordStackParamList = {
  ResetPasswordRequest: {
    email: string
  }
  CheckEmail: {
    destination: 'ChangePassword' | 'VerifyCode'
    email: string
  }
  ChangePassword: {
    email: string
  }
}

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>

export type OnboardStackScreenProps<T extends keyof OnboardStackParamList> =
  NativeStackScreenProps<OnboardStackParamList, T>

export type MainStackScreenProps<T extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, T>

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    MainStackScreenProps<keyof MainStackParamList>
  >

export type PostListingStackScreenProps<
  T extends keyof PostListingStackParamList
> = CompositeScreenProps<
  NativeStackScreenProps<PostListingStackParamList, T>,
  MainStackScreenProps<keyof MainStackParamList>
>

export type TransactionStackScreenProps<
  T extends keyof TransactionStackParamList
> = CompositeScreenProps<
  NativeStackScreenProps<TransactionStackParamList, T>,
  MainStackScreenProps<keyof MainStackParamList>
>

export type ReportReviewStackScreenProps<
  T extends keyof ReportReviewStackParamList
> = CompositeScreenProps<
  NativeStackScreenProps<ReportReviewStackParamList, T>,
  MainStackScreenProps<keyof MainStackParamList>
>

export type ResetPasswordStackScreenProps<
  T extends keyof ResetPasswordStackParamList
> = CompositeScreenProps<
  NativeStackScreenProps<ResetPasswordStackParamList, T>,
  MainStackScreenProps<keyof MainStackParamList>
>

export type ChangePhoneStackScreenProps<
  T extends keyof ChangePhoneStackParamList
> = CompositeScreenProps<
  NativeStackScreenProps<ChangePhoneStackParamList, T>,
  OnboardStackScreenProps<keyof OnboardStackParamList>
>

export type BecomeSellerStackScreenProps<
  T extends keyof BecomeSellerStackParamList
> = CompositeScreenProps<
  NativeStackScreenProps<BecomeSellerStackParamList, T>,
  MainStackScreenProps<keyof MainStackParamList>
>

export type MainStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>
  ProductDetails: {
    userId: string
    productId: string
    product?: ProductType
    isEditing?: boolean
    previewMode?: boolean
  }
  LocationSharing?: {
    filters?: Filter
  }
  BecomeSeller: NavigatorScreenParams<BecomeSellerStackParamList>
  PostListing: NavigatorScreenParams<PostListingStackParamList>
  MyListings: undefined
  Transaction: NavigatorScreenParams<TransactionStackParamList>
  ProfileSettings: undefined
  UserProfile: {
    userId: string
  }
  MyOffers: {
    offer: Offer
  }
  ReportReview: NavigatorScreenParams<ReportReviewStackParamList>
  MyEarnings: undefined
  EarningsDetails: {
    balanceTransaction: BalanceTransaction
  }
  Withdraw: undefined
  BankAccount: undefined
  ShippingAddress: {
    title: string
    nameLabel: string
  }
  PrivacySettings: undefined
  // LocationSettings: undefined
  ResetPassword: NavigatorScreenParams<ResetPasswordStackParamList>
  WebScreen: {
    uri: string
  }
  DeleteAccount: undefined
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends MainStackParamList {}
  }
}
