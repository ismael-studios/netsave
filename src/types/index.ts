export type ProductType = {
  category: Category
  categoryId: number
  createdAt: string
  description: string | null
  id: string
  isNegotiable: boolean | null
  isPublished: boolean
  isSold: boolean
  previewImageId: string | null
  previewImageUrl: string | null
  price: number
  productCondition: ProductCondition
  productConditionId: number
  retailPrice: number | null
  title: string | null
  updatedAt: string
  user: PublicUser
  userId: string
  images?: ProductImage[]
  _geoloc: {
    lat: number
    lng: number
  }
  distance: string
  isShipping: boolean
  isLocal: boolean
  isLocalOnline: boolean
  isLocalCash: boolean
  shippingPackage: PackageSizeType | null
  shippingPackageId: number | null
}

export type UserType = {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  lat: number
  lng: number
  radius: number
  city: string | null
  region: string | null
  rating: number | null
  postalCode: string | null
  profileImageId: string | null
  description: string | null
  memberSince: string
  profileImageUrl: string | null
  rewardBalance: number
  isSignupCompleted?: boolean
  phone: string | null
  isPhoneVerified: boolean
}

export type PackageSizeType = {
  id: number
  name: string
  description: string
  price: number
  length: string
  width: string
  height: string
  weight: string
}

export type ShippingAddressType = {
  id: string
  name: string
  line1: string
  line2: string | null
  city: string
  region: string
  postalCode: string
  country: string
  isPrimary: boolean
}

export type ShipmentType = {
  id?: string
  carrier: string | null
  deliveredAt: string | null
  isDelivered: boolean
  isShipped: boolean
  trackingNumber: string | null
}

export interface TrackData {
  data: {
    eta: string
    tracking_history: TrackHistoryData[]
    tracking_status: { status_details: string; status: string }
  }
}

export interface TrackHistoryData {
  status_date: string
  status_details: string
  location: {
    city: string
    state: string
    zip: string
    country: string
  }
  status: string
}

export enum ProductTransactionReviewCriteriaType {
  SELLER = 'seller',
  BUYER = 'buyer',
}

export interface ProductTransactionReviewCriteria {
  id: number
  name: string
  type: ProductTransactionReviewCriteriaType
}

export type ReviewType = {
  buyerUserId: string
  createdAt: string
  description: string
  id: string
  productId: string
  product?: ProductType
  rating: number
  reviewUserId: string
  reviewUser?: PublicUser
  sellerUserId: string
  transactionId: string
  type: string
  updatedAt: string
}

export type PublicUser = Pick<
  UserType,
  | 'id'
  | 'username'
  | 'city'
  | 'region'
  | 'postalCode'
  | 'profileImageId'
  | 'profileImageUrl'
  | 'description'
  | 'rating'
  | 'memberSince'
>

type OfferProductType = Pick<
  ProductType,
  | 'id'
  | 'userId'
  | 'isPublished'
  | 'isSold'
  | 'title'
  | 'price'
  | 'retailPrice'
  | 'description'
  | 'isNegotiable'
  | 'categoryId'
  | 'productConditionId'
  | 'previewImageId'
  | 'previewImageUrl'
  | 'createdAt'
  | 'updatedAt'
  | 'isShipping'
  | 'isLocal'
  | 'isLocalOnline'
  | 'isLocalCash'
  | 'shippingPackageId'
>

const enum UserProductOfferStatus {
  ACCEPTED = 1,
  PENDING = 2,
  DECLINED = 3,
  CANCELLED = 4,
}

export interface Offer {
  id: string
  productId: string
  toUserId: string
  fromUserId: string
  price: number
  description: string
  statusId: UserProductOfferStatus
  response: string
  createdAt: string
  transactionId: string
  previousOfferId: string | null
  toUser: PublicUser
  product: OfferProductType
  status: {
    id: UserProductOfferStatus
    name: string
    description: string
  }
  fromUser: PublicUser
}

export type TransactionStatusType = {
  id: number
  name: string
}

export type TransactionType = {
  id: string
  buyerUserId: string
  buyer?: PublicUser
  createdAt: string
  endedBy?: PublicUser
  endedUserId: string | null
  forceEndAt: string | null
  info: string | null
  isCash: boolean
  isPaid: boolean
  isPickedUp: boolean
  offerId: string
  offer?: Offer
  pickedUpAt: string | null
  productId: string
  product?: ProductType
  reviews: ReviewType[]
  sellerUserId: string
  seller?: PublicUser
  shipmentId: string | null
  shipment?: ShipmentType
  transactionStatus: TransactionStatusType
  transactionStatusId: number
  updatedAt: string
}

export type CategoryType = {
  id?: number
  name?: string
  description?: string
  shortName?: string
  iconType?: 'image' | 'svg'
  icon?: any
  iconUrl?: string
}

export type Filter = {
  qs?: string | null
  radius: number
  page: number
  priceRange: string | null
  lat: number
  lng: number
}

interface BalanceTransactionBase {
  created: string
  availableOn: string
  net: number
  status: string
  type: string
  description: string
}
interface BalanceTransactionPayment extends BalanceTransactionBase {
  transactionId: string
  amount: number
  fee: number
  insurance: number
}

interface BalanceTransactionWithdrawal extends BalanceTransactionBase {
  arrivalDate: string
}

export type BalanceTransaction =
  | BalanceTransactionPayment
  | BalanceTransactionWithdrawal

export interface RewardTransaction {
  id: string
  description: string
  metadata: any
  net: number
  rewardId?: number
  createdAt: string
  updatedAt: string
}

export type VoidFunction = () => void
export type CallBackFunction = (data?: any) => void
export type CallbackEvent = { redirectCallback?: VoidFunction }

export interface Category {
  id: number
  name: string
  description: string
}

export interface ProductCondition {
  id: number
  name: string
  description: string
  color: string
}

export interface ProductImage {
  id: string
  order: number | null
  productId: string
  url: string
  userId: string
}

export interface Response<T> {
  message: string
  data: T
}

export interface Follower {
  id: string
  username: string
  profileImageUrl: string
}

export interface ProductLike {
  createdAt: string
  product: ProductType
  productId: string
  updatedAt: string
  userId: string
}

export interface Balance {
  available: number
  pending: number
}

export interface ExternalAccount {
  bankName: string
  last4: string
}

export interface AuthTokenPayload {
  iss: string
  aud: string
  iat: number
  exp: number
  sub: string
}
