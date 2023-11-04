import { Images } from '../../common'

const { NETSAVE_ICON, HEART, PLUS_CIRCLE_COLOR, MESSAGING, USER_ACCOUNT } =
  Images

export default [
  {
    name: 'Shop',
    icon: NETSAVE_ICON,
    route: 'HomeScreen',
    rootRoute: 'Home',
  },
  {
    name: 'Likes',
    icon: HEART,
    route: 'CommunityScreen',
    rootRoute: 'Community',
    authed: true,
  },
  {
    name: 'Sell',
    icon: PLUS_CIRCLE_COLOR,
    noTint: true,
    route: 'SellScreen',
    rootRoute: 'ChooseCategory',
    authed: true,
  },
  {
    name: 'Messages',
    icon: MESSAGING,
    route: 'ChatScreen',
    rootRoute: 'Chat',
    authed: true,
  },
  {
    name: 'Account',
    icon: USER_ACCOUNT,
    size: 23,
    route: 'MoreScreen',
    rootRoute: 'More',
    authed: true,
  },
]
