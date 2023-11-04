import React, { useEffect, useRef, useState } from 'react'
import { Keyboard, Platform, SafeAreaView, View } from 'react-native'
import { RouteProp, useFocusEffect } from '@react-navigation/native'

import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useHeaderHeight } from '@react-navigation/elements'
import {
  ChannelSort,
  Channel as ChannelType,
  ChannelMemberResponse,
} from 'stream-chat'
import {
  Channel,
  ChannelList,
  Chat,
  MessageInput,
  MessageList,
  Streami18n,
  Thread,
  ThreadContextValue,
  useAttachmentPickerContext,
  useMessageInputContext,
  useOverlayContext,
} from 'stream-chat-react-native'
import Collapsible from 'react-native-collapsible'
import chatClient, { StreamChatGenerics } from '../../services/Chat'
import { ShellButton, OptionsButton, Header } from '../../components'
import { ApiConstants } from '../../services'
import styles from './styles'
import OfferProduct from './OfferProduct'
import OfferProductStats from './OfferProductStats'
import CustomPreviewAvatar from './CustomPreviewAvatar'
import CustomPreviewTitle from './CustomPreviewTitle'
import analytics from '@react-native-firebase/analytics'
import { Images } from '../../common'
import { useAppSelector } from '../../store/hooks'
import { useGetProductDetailsQuery } from '../../store/slice/api/features/product'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import OffersModule from '../../components/OffersModule'
import { OffersModuleConfig } from '../../components/OffersModule/OffersModule'

const { PAPER_PLANE } = Images
const { TRANSACTION_COMPLETED_STATUS, TRANSACTION_FAILED_STATUS } = ApiConstants

const sort: ChannelSort<StreamChatGenerics> = { last_message_at: -1 }
const options = {
  presence: true,
  state: true,
  watch: true,
}

/**
 * Start playing with streami18n instance here:
 * Please refer to description of this PR for details: https://github.com/GetStream/stream-chat-react-native/pull/150
 */
export const streami18n = new Streami18n({
  language: 'en',
})

type ChannelListScreenProps = {
  navigation: NativeStackNavigationProp<NavigationParamsList, 'ChannelList'>
}

const ChannelListScreen = ({ navigation }: ChannelListScreenProps) => {
  const { user } = useAppSelector((state) => state.session)

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: ({ route }) => (
        <Header bordered avoidMode title="Messages" style={styles.header} />
      ),
    })
  }, [navigation])

  if (!user) {
    return null
  }

  return (
    <Chat client={chatClient} i18nInstance={streami18n}>
      <View style={styles.wrapper}>
        <ChannelList<StreamChatGenerics>
          filters={{
            members: { $in: [user.id] },
            created_at: { $gt: '2021-08-05T00:00:00.00Z' },
            type: 'messaging',
          }}
          onSelect={(channel) => {
            navigation.navigate('Channel', {
              channelId: channel.id,
            })
          }}
          options={options}
          sort={sort}
          PreviewAvatar={CustomPreviewAvatar}
          PreviewTitle={CustomPreviewTitle}
        />
      </View>
    </Chat>
  )
}

type ChannelScreenProps = {
  navigation: NativeStackNavigationProp<NavigationParamsList, 'Channel'>
}

const ChannelScreen = ({ navigation, route }: ChannelScreenProps) => {
  const { channelId } = route.params || {}
  const headerHeight = useHeaderHeight()
  const { setTopInset } = useAttachmentPickerContext()
  const { overlay } = useOverlayContext()

  const [channel, setChannel] = useState<ChannelType<StreamChatGenerics>>()
  const [thread, setThread] =
    useState<ThreadContextValue<StreamChatGenerics>['thread']>()
  const [showStats, setShowStats] = useState(true)
  const [members, setMembers] = useState<
    ChannelMemberResponse<StreamChatGenerics>[]
  >([])
  const offerProductRef = useRef()

  const [chatProduct, setChatProduct] = useState<{
    id: string
    title: string
    userId: string
  }>()
  const [offerConfig, setOfferConfig] = useState<OffersModuleConfig>()

  const { data: product } = useGetProductDetailsQuery(
    chatProduct
      ? {
          userId: chatProduct.userId,
          productId: chatProduct.id,
        }
      : skipToken
  )

  useEffect(() => {
    if (channelId) {
      const latestChannel = chatClient.getChannelById(
        'messaging',
        channelId,
        {}
      )
      setChannel(latestChannel)
    }
  }, [channelId])

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: Platform.OS === 'ios' && overlay === 'none',
    })
  }, [navigation, overlay])

  useEffect(() => {
    setTopInset(headerHeight)
  }, [setTopInset, headerHeight])

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: ({ route }) => (
        <Header
          showBack
          bordered
          avoidMode
          title={channel?.data?.name}
          style={styles.header}
        />
      ),
    })
  })

  useEffect(() => {
    const hasProduct =
      channel?.data &&
      (channel?.data.product as {
        id: string
        title: string
        userId: string
      })
    if (hasProduct) {
      setChatProduct(hasProduct)
    }
  }, [channel])

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      'keyboardWillShow',
      handleKeyboardShow
    )
    const keyboardWillHide = Keyboard.addListener(
      'keyboardWillHide',
      handleKeyboardHide
    )
    return () => {
      keyboardWillShow.remove()
      keyboardWillHide.remove()
    }
  }, [])

  // get both users in chat
  useEffect(() => {
    if (channel) {
      channel
        .queryMembers({}, () => 1, {})
        .then(({ members: result }) => setMembers(result))
    }
  }, [channel])

  const SendButton = (props) => {
    const { sendMessage } = useMessageInputContext()

    return (
      <OptionsButton
        image={PAPER_PLANE}
        style={styles.sendButton}
        {...props}
        onPress={sendMessage}
      />
    )
  }

  const handleOfferAction = (action, params) => {
    offerProductRef.current[action](params)
  }

  const handleKeyboardShow = () => setShowStats(false)
  const handleKeyboardHide = () => setShowStats(true)

  if (!channel) {
    return null
  }

  return (
    <SafeAreaView>
      <Chat client={chatClient} i18nInstance={streami18n}>
        <Channel
          channel={channel}
          keyboardVerticalOffset={headerHeight}
          thread={thread}
          overrideOwnCapabilities={{ sendMessage: true }}
          messageActions={[]}
        >
          <View style={styles.chatList}>
            {product && members.length ? (
              <OfferProduct
                product={product}
                members={members}
                setOfferConfig={setOfferConfig}
              />
            ) : null}
            <MessageList<StreamChatGenerics>
              onThreadSelect={(thread) => {
                setThread(thread)
                if (channel?.id) {
                  navigation.navigate('Thread')
                }
              }}
            />
            <Collapsible collapsed={!showStats}>
              {product && members.length ? (
                <OfferProductStats
                  product={product}
                  members={members}
                  onOfferAction={handleOfferAction}
                />
              ) : null}
            </Collapsible>
            <MessageInput
              AttachButton={ShellButton}
              SendButton={SendButton}
              hasFilePicker={false}
              hasImagePicker={false}
            />
          </View>
        </Channel>
      </Chat>
      {offerConfig && <OffersModule config={offerConfig} />}
    </SafeAreaView>
  )
}

type ThreadScreenProps = {
  navigation: NativeStackNavigationProp<ThreadRoute, 'Thread'>
  route: RouteProp<ThreadRoute, 'Thread'>
}

const ThreadScreen = ({ navigation }: ThreadScreenProps) => {
  const { channel, thread } = useAppSelector((state) => state.chat)

  const headerHeight = useHeaderHeight()
  const { overlay } = useOverlayContext()

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: Platform.OS === 'ios' && overlay === 'none',
    })
  }, [overlay])

  return (
    <SafeAreaView>
      <Chat client={chatClient} i18nInstance={streami18n}>
        <Channel
          channel={channel}
          keyboardVerticalOffset={headerHeight}
          thread={thread}
          threadList
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-start',
            }}
          >
            <Thread<StreamChatGenerics>
            // onThreadDismount={() => setThread(null)}
            />
          </View>
        </Channel>
      </Chat>
    </SafeAreaView>
  )
}

type ChannelRoute = { Channel: undefined }
type ChannelListRoute = { ChannelList: undefined }
type ThreadRoute = { Thread: undefined }
type NavigationParamsList = ChannelRoute & ChannelListRoute & ThreadRoute

export const WrappedChannelScreen = (props) => {
  const isChatReady = useAppSelector((state) => state.app.isChatReady)
  if (!isChatReady) {
    return null
  }

  return <ChannelScreen {...props} />
}

const ChatScreen = (props) => {
  const isChatReady = useAppSelector((state) => state.app.isChatReady)

  useFocusEffect(
    React.useCallback(() => {
      if (isChatReady) {
        analytics().logScreenView({
          screen_class: 'ChatScreen',
          screen_name: 'ChatScreen',
        })
      }
    }, [isChatReady])
  )

  if (!isChatReady) {
    return null
  }

  return <ChannelListScreen {...props} />
}

export default ChatScreen
