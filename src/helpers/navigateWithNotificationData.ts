import * as RootNavigation from '../navigation/RootNavigation'

const navigateWithNotificationData = async (data: {
  [key: string]: string
}) => {
  let route = data.navigate
  if (route === 'Chat') {
    route = 'Channel'
  }

  RootNavigation.navigate(route, {
    ...(data.channelId && {
      channelId: data.channelId,
    }),
  })
}

export default navigateWithNotificationData
