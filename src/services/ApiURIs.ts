import {
  TRANSACTION_ID_KEY,
  FOLLOWER_ID_KEY,
  SHIPMENT_ID_KEY,
  PRODUCT_ID_KEY,
  REVIEW_ID_KEY,
  IMAGE_ID_KEY,
  OFFER_ID_KEY,
  USER_ID_KEY,
  EMAIL_KEY,
  TYPE_KEY,
  AMOUNT_KEY,
} from './ApiConstants'

export const AUTH = {
  LOGIN: `users/login`,
  LOGIN_REFRESH: `users/login`,
  LOGIN_SESSION: `users/login-sessions`,
  SEND_EMAIL_VERIFICATION: `users/verify`,
  VERIFY_EMAIL: `users/verify`,
  REQUEST_RESET_PASSWORD: `users/passwords`,
  RESET_PASSWORD: `users/passwords`,
  APPLE_LOGIN: `users/apple`,
  GOOGLE_LOGIN: `users/google`,
  FACEBOOK_LOGIN: `users/facebook`,
  FIREBASE_TOKEN: `fcm-token`,
}

export const USERS = {
  CREATE_USER: `users`,
  GET_USER: `users/{${USER_ID_KEY}}`,
  GET_USERS: `users`,
  UPDATE_USER: `users/{${USER_ID_KEY}}`,
  GET_USER_IMAGES: `users/{${USER_ID_KEY}}/images/upload-urls`,
  GET_USER_FOLLOWING: `users/{${USER_ID_KEY}}/following`,
  GET_USER_FOLLOWERS: `users/{${USER_ID_KEY}}/followers`,
  FOLLOW_USER: `users/{${USER_ID_KEY}}/followers`,
  UNFOLLOW_USER: `users/{${USER_ID_KEY}}/followers/{${FOLLOWER_ID_KEY}}`,
  GET_USER_LIKES: `users/{${USER_ID_KEY}}/product-likes`,
  GET_CHAT_TOKEN: `users/{${USER_ID_KEY}}/chat-token`,
  GET_USER_LOCATION: `info/location`,
}

export const PRODUCTS = {
  CREATE_PRODUCT: `users/{${USER_ID_KEY}}/products`,
  UPDATE_PRODUCT: `users/{${USER_ID_KEY}}/products/{${PRODUCT_ID_KEY}}`,
  GET_PRODUCTS: `users/products`,
  GET_PRODUCTS_BY_USER: `users/{${USER_ID_KEY}}/products`,
  GET_PRODUCT_DETAILS: `users/{${USER_ID_KEY}}/products/{${PRODUCT_ID_KEY}}`,
  GET_PRODUCT_BY_ID: `products/{${PRODUCT_ID_KEY}}`,
  GET_PRODUCT_IMAGES: `users/{${USER_ID_KEY}}/products/{${PRODUCT_ID_KEY}}/images/upload-urls?amount={${AMOUNT_KEY}}`,
  GET_CATEGORIES: `categories`,
  CONDITIONS: `product-conditions`,
  PRODUCT_LIKES: `users/{${USER_ID_KEY}}/products/{${PRODUCT_ID_KEY}}/likes`,
  DELETE_PRODUCT_IMAGE: `users/{${USER_ID_KEY}}/products/{${PRODUCT_ID_KEY}}/images/{${IMAGE_ID_KEY}}`,
}

export const OFFERS = {
  GET_OFFERS: `users/{${USER_ID_KEY}}/products/offers`,
  CREATE_OFFER: `users/{${USER_ID_KEY}}/products/{${PRODUCT_ID_KEY}}/offers`,
  UPDATE_OFFER: `users/{${USER_ID_KEY}}/products/{${PRODUCT_ID_KEY}}/offers/{${OFFER_ID_KEY}}`,
}

export const TRANSACTIONS = {
  GET_TRANSACTIONS: `users/{${USER_ID_KEY}}/products/{${PRODUCT_ID_KEY}}/transactions`,
  GET_LOCAL_PICKUP_CODE: `users/{${USER_ID_KEY}}/products/{${PRODUCT_ID_KEY}}/transactions/{${TRANSACTION_ID_KEY}}/pickups`,
  VERIFY_LOCAL_PICKUP_CODE: `users/{${USER_ID_KEY}}/products/{${PRODUCT_ID_KEY}}/transactions/{${TRANSACTION_ID_KEY}}/pickups`,
  GET_TRANSACTION: `users/{${USER_ID_KEY}}/products/{${PRODUCT_ID_KEY}}/transactions/{${TRANSACTION_ID_KEY}}`,
  GET_TRANSACTION_BY_ID: `transactions/{${TRANSACTION_ID_KEY}}`,
  CREATE_TRANSACTION: `users/{${USER_ID_KEY}}/products/{${PRODUCT_ID_KEY}}/transactions`,
  UPDATE_TRANSACTION: `users/{${USER_ID_KEY}}/products/{${PRODUCT_ID_KEY}}/transactions/{${TRANSACTION_ID_KEY}}`,
  DISPUTE_TRANSACTION: `users/{${USER_ID_KEY}}/products/{${PRODUCT_ID_KEY}}/transactions/{${TRANSACTION_ID_KEY}}/disputes`,
  REPORT_TRANSACTION: `users/{${USER_ID_KEY}}/products/{${PRODUCT_ID_KEY}}/transactions/{${TRANSACTION_ID_KEY}}`,
  GET_TRANSACTION_STATUSES: `product-transaction-statuses`,
  GET_EXTERNAL_ACCOUNTS: `users/{${USER_ID_KEY}}/external-accounts`,
  POST_EXTERNAL_ACCOUNT: `users/{${USER_ID_KEY}}/external-accounts`,
  GET_BALANCE: `users/{${USER_ID_KEY}}/balance`,
  GET_BALANCE_TRANSACTIONS: `users/{${USER_ID_KEY}}/balance-transactions`,
  PUT_BALANCE_TRANSACTIONS: `users/{${USER_ID_KEY}}/balance-transactions`,
  CREATE_PAYMENT_REQUEST: `users/{${USER_ID_KEY}}/products/{${PRODUCT_ID_KEY}}/transactions/{${TRANSACTION_ID_KEY}}/payments`,
}

export const SHIPPING = {
  GET_SHIPPING_PACKAGES: `shipping-packages`,
  GET_SHIPMENT_LABEL: `shipments/{${SHIPMENT_ID_KEY}}/labels`,
  SEND_SHIPMENT_LABEL: `shipments/{${SHIPMENT_ID_KEY}}/labels?email={${EMAIL_KEY}}`,
  CREATE_SHIPMENT_LABEL: `shipments/{${SHIPMENT_ID_KEY}}/labels`,
  TRACK_SHIPMENT: `shipments/{${SHIPMENT_ID_KEY}}/tracks`,
  GET_SHIPPING_ADDRESSES: `users/{${USER_ID_KEY}}/addresses`,
  CREATE_SHIPPING_ADDRESS: `addresses`,
}

export const REVIEWS = {
  GET_REVIEW_CRITERIAS: `product-transaction-review-criterias?type={${TYPE_KEY}}`,
  GET_REVIEWS: `users/{${USER_ID_KEY}}/products/transactions/reviews?type={${TYPE_KEY}}`,
  CREATE_REVIEW: `users/{${USER_ID_KEY}}/products/{${PRODUCT_ID_KEY}}/transactions/{${TRANSACTION_ID_KEY}}/reviews`,
  REPORT_REVIEW: `users/{${USER_ID_KEY}}/products/{${PRODUCT_ID_KEY}}/transactions/{${TRANSACTION_ID_KEY}}/reviews/{${REVIEW_ID_KEY}}/reports`,
}

export const REWARDS = {
  REDEEM_REWARD: 'rewards/redeem',
  GET_REWARDS_TRANSACTIONS: 'rewards/transactions',
}
