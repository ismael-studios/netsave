import CONFIG from 'react-native-config'

export const API_URL = CONFIG.API_URL
export const WEB_URL = CONFIG.WEB_URL
export const PRODUCTS_LIMIT = 50
export const CITY_KEY = 'city'
export const CATEGORY_KEY = 'category'
export const FIRSTNAME_KEY = 'firstName'
export const ID_KEY = 'id'
export const LASTNAME_KEY = 'lastName'
export const LATITUDE_KEY = 'lat'
export const LONGITUDE_KEY = 'lng'
export const RADIUS_KEY = 'radius'
export const REGION_KEY = 'region'
export const POSTALCODE_KEY = 'postalCode'
export const PRICERANGE_KEY = 'priceRange'
export const PROFILEIMAGEID_KEY = 'profileImageId'
export const PRODUCT_ID_KEY = 'productId'
export const IMAGE_ID_KEY = 'imageId'
export const USER_ID_KEY = 'userId'
export const FOLLOWER_ID_KEY = 'followerId'
export const USERNAME_KEY = 'username'
export const AMOUNT_KEY = 'amount'
export const OFFER_ID_KEY = 'offerId'
export const RESPONSE_KEY = 'response'
export const DESCRIPTION_ID_KEY = 'description'
export const STATUS_ID_KEY = 'statusId'
export const PAGE_KEY = 'page'
export const IS_PUBLISHED_KEY = 'isPublished'
export const IS_DRAFT_KEY = 'isDraft'
export const IS_SOLD_KEY = 'isSold'
export const OFFER_ACCEPTED_STATUS = 1
export const OFFER_PENDING_STATUS = 2
export const OFFER_DECLINED_STATUS = 3
export const OFFER_CANCELED_STATUS = 4
export const TRANSACTION_ID_KEY = 'transactionId'
export const TRANSACTION_STATUS_ID_KEY = 'transactionStatusId'
export const TYPE_KEY = 'type'
export const TRANSACTION_COMPLETED_STATUS = 1
export const TRANSACTION_PENDING_STATUS = 2
export const TRANSACTION_FAILED_STATUS = 3
export const TRANSACTION_PROBLEM_STATUS = 4
export const COUNTER_DESCRIPTION_KEY = 'counterDescription'
export const COUNTER_PRICE_KEY = 'counterPrice'
export const PRICE_KEY = 'price'
export const REVIEW_ID_KEY = 'reviewId'
export const PASSWORD_KEY = 'password'
export const EMAIL_KEY = 'email'
export const DEVICE_ID_KEY = 'deviceId'
export const SESSION_ID_KEY = 'sessionId'
export const CODE_KEY = 'code'
export const SHIPMENT_ID_KEY = 'shipmentId'
export const TO_ADDRESS_ID_KEY = 'toAddressId'
export const FROM_ADDRESS_ID_KEY = 'fromAddressId'
export const DECLARED_VALUE_KEY = 'declaredValue'
export const FCM_TOKEN_KEY = 'fcmToken'

// API request error responses
export const ERRORS = {
  clientError: 'There was an error making\nyour request. Try again.',
  serverError: 'There was a server error.\nTry again.',
  timeoutError: "The Server didn't respond\nto your request. Try again",
  connectionError: 'Server not available, bad dns.',
  networkError: 'Network not available.',
  cancelError: 'Request has been cancelled.',
  unknownError: 'There seems to be a problem\nwith your request.',
}
