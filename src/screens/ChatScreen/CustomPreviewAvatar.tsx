import React, { useEffect, useState } from 'react'
import { Image, View } from 'react-native'
import { ChannelAvatar, ChannelAvatarProps } from 'stream-chat-react-native'
import { StreamChatGenerics } from '../../services/Chat'
import { useAppSelector } from '../../store/hooks'
import { useGetUserQuery } from '../../store/slice/api/features/user'

const CustomPreviewAvatar = ({
  channel,
}: ChannelAvatarProps<StreamChatGenerics>) => {
  const { user } = useAppSelector((state) => state.session)
  const [userIdNotMe, setUserIdNotMe] = useState('')
  const [avatarImage, setAvatarImage] = useState('')

  const { data } = useGetUserQuery(userIdNotMe, {
    skip: !userIdNotMe,
  })

  useEffect(() => {
    if (!user) {
      return
    }
    const userNotMe = Object.keys(channel.state.members).find(
      (key) => key !== user.id
    )
    if (userNotMe) {
      setUserIdNotMe(userNotMe)
    }
  }, [channel.state.members, user])

  useEffect(() => {
    if (data && data.profileImageUrl) {
      setAvatarImage(data.profileImageUrl)
    }
  }, [data])

  return (
    <>
      {avatarImage ? (
        <View
          style={{
            width: 40,
            height: 40,
          }}
        >
          <Image
            source={{ uri: avatarImage }}
            style={{ width: '100%', height: '100%', borderRadius: 50 }}
          />
        </View>
      ) : (
        <ChannelAvatar channel={channel} />
      )}
    </>
  )
}

export default CustomPreviewAvatar
