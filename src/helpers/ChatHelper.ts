import ChatClient from '../services/Chat'
import short from 'short-uuid'
import * as RootNavigation from '../navigation/RootNavigation'
import { Offer as OfferType, ProductType, UserType } from '../types'

export const MessageSeller = async (
  CurrentUser: UserType,
  Product: ProductType,
  returnChannel = false
) => {
  const translator = short()
  const channelId = `${Product.id}_${translator
    .fromUUID(Product.userId)
    .slice(0, 10)}_${translator.fromUUID(CurrentUser.id).slice(0, 12)}`
  const channel = ChatClient.channel('messaging', channelId, {
    name: Product.title || 'Product',
    members: [Product.userId, CurrentUser.id],
    product: {
      id: Product.id,
      title: Product.title,
      userId: Product.userId,
    },
  })
  await channel.watch()

  if (returnChannel) {
    return channel
  }
  RootNavigation.navigate('Channel', {
    channelId: channel.id,
  })
}

export const MessageBuyer = async (
  CurrentUser: UserType,
  Product,
  returnChannel = false
) => {
  const translator = short()
  const channelId = `${Product.id}_${translator
    .fromUUID(CurrentUser.id)
    .slice(0, 10)}_${translator.fromUUID(Product.buyerUserId).slice(0, 12)}`
  const channel = ChatClient.channel('messaging', channelId, {
    name: Product.title,
    members: [CurrentUser.id, Product.buyerUserId],
    product: {
      id: Product.id,
      title: Product.title,
      userId: Product.userId,
    },
  })
  await channel.watch()
  if (returnChannel) {
    return channel
  }
  RootNavigation.navigate('Channel', {
    channelId: channel.id,
  })
}

export const SendSellerOfferMessage = async (
  CurrentUser: UserType,
  Offer: OfferType,
  Message: string
) => {
  const channel = await MessageSeller(CurrentUser, Offer.product, true)
  if (!channel) {
    return
  }
  await channel.sendMessage({
    text: Message,
  })
  RootNavigation.navigate('Channel', {
    channelId: channel.id,
  })
}

export const SendBuyerOfferMessage = async (
  CurrentUser: UserType,
  Offer: OfferType,
  Message: string
) => {
  const { fromUserId, toUserId } = Offer
  const { product } = Offer
  const buyerUserId = product.userId === fromUserId ? toUserId : fromUserId
  const channel = await MessageBuyer(
    CurrentUser,
    {
      ...Offer.product,
      buyerUserId,
    },
    true
  )
  if (!channel) {
    return
  }
  await channel.sendMessage({
    text: Message,
  })
  RootNavigation.navigate('Channel', {
    channelId: channel.id,
  })
}
