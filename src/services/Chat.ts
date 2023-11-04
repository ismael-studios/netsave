import { StreamChat } from 'stream-chat'
import CONFIG from 'react-native-config'

const { GETSTREAM_API_KEY } = CONFIG

type LocalAttachmentType = Record<string, unknown>
type LocalChannelType = Record<string, unknown>
type LocalCommandType = string
type LocalEventType = Record<string, unknown>
type LocalMessageType = Record<string, unknown>
type LocalReactionType = Record<string, unknown>
type LocalUserType = Record<string, unknown>

export type StreamChatGenerics = {
  attachmentType: LocalAttachmentType
  channelType: LocalChannelType
  commandType: LocalCommandType
  eventType: LocalEventType
  messageType: LocalMessageType
  reactionType: LocalReactionType
  userType: LocalUserType
}

export default StreamChat.getInstance<StreamChatGenerics>(GETSTREAM_API_KEY)
