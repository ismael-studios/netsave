import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { ChannelPreviewTitleProps } from 'stream-chat-react-native'
import { Text } from '../../components'
import { StreamChatGenerics } from '../../services/Chat'
import { useAppSelector } from '../../store/hooks'
import { useGetUserQuery } from '../../store/slice/api/features/user'

const CustomPreviewTitle = ({
  channel,
}: ChannelPreviewTitleProps<StreamChatGenerics>) => {
  const { user } = useAppSelector((state) => state.session)
  const [userIdNotMe, setUserIdNotMe] = useState('')
  const [username, setUsername] = useState('')
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
    if (data) {
      setUsername(data.username)
    }
  }, [data])

  return (
    <View>
      <Text fontSize="small" fontStyle="bold">
        @{username}
      </Text>
      <Text fontSize="small" fontStyle="bold">
        {channel.data?.name}
      </Text>
    </View>
  )
}

export default CustomPreviewTitle
