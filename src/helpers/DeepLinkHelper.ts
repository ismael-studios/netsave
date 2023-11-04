import { trim } from 'ramda'
import short from 'short-uuid'
import * as RootNavigation from '../navigation/RootNavigation'

const translator = short()

export const openURL = (url: string | null | { url: string }) => {
  console.log('DEEP LINK URL', url)
  const actualURL = typeof url === 'string' ? url : url && url.url
  if (!actualURL) return

  const parsedURL = trim(
    String(actualURL).replace(
      /^http(s):\/\/|^netsave:\/\/|.*netsave.com\//gi,
      ''
    )
  )
  console.log('DEEP LINK PARSED', parsedURL)

  if (!parsedURL) return

  const splitURL = parsedURL.split('/')
  console.log('DEEP LINK SPLIT', splitURL)

  switch (splitURL[0]) {
    case 'u':
    case 'user':
      let id = String(splitURL[1])
      if (!id.match(/-/)) id = translator.toUUID(splitURL[1])
      RootNavigation.navigate({
        name: 'UserProfile',
        params: {
          userId: id,
        },
        key: id,
      })
      break
    case 'p':
    case 'product':
      // the below condition is to catch links
      // with only the product id present
      RootNavigation.navigate({
        name: 'ProductDetails',
        params: {
          userId: (splitURL[2] && splitURL[1]) || null,
          productId: splitURL[2] || splitURL[1],
        },
        key: splitURL[2] || splitURL[1],
        merge: true,
      })
      break
    case 'screen':
      console.log('DEEP LINK SCREEN', splitURL[1])
      RootNavigation.navigate(splitURL[1], {})
      break
  }
}
