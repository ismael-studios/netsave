import React, { useEffect } from 'react'
import { Image, View } from 'react-native'
import {
  Text,
  Button,
  SafeAreaView,
  ShellButton,
  ShowAlert,
  Header,
} from '../../../components'
import styles from './Styles'
import { Images } from '../../../common'
import Share from 'react-native-share'
import analytics from '@react-native-firebase/analytics'
import { OnboardStackScreenProps } from '../../../navigation/types'

const { ADD_USER } = Images

const InviteContacts = ({
  navigation,
}: OnboardStackScreenProps<'InviteContacts'>) => {
  useEffect(() => {
    analytics().logEvent('signup_invite_contacts_start')
  }, [])

  const handleContinue = () => {
    analytics().logEvent('signup_invite_contacts_complete')
    navigation.navigate('LocationServices')
  }

  const handleTellFriends = () => {
    analytics().logEvent('signup_invite_contacts_tell_friends')
    Share.open({
      title: 'Tell Friends',
      subject: 'Netsave',
      message: 'Hey I just joined Netsave! Check it out:',
      url: 'https://netsave.com/#welcome',
      failOnCancel: false,
    })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        err && console.log(err)
        ShowAlert({
          message: 'There was an error while sharing.',
        })
      })
  }

  return (
    <SafeAreaView>
      <Header showLogo />
      <View style={styles.topContainer}>
        <View style={styles.details}>
          <Text center padded fontStyle="bold" fontSize="h2">
            {'Invite your contacts &\n'}
            <Text fontStyle="bold" fontSize="h2">
              build your local network
            </Text>
          </Text>
          <Text fontSize="standard">
            Invite your friends, family and neighbors
          </Text>
          <Text fontSize="standard">to join your circle on Netsave.</Text>
          <ShellButton style={styles.features} onPress={handleTellFriends}>
            <Image style={styles.featureIcon} source={ADD_USER} />
          </ShellButton>
          <Text center gray fontSize="small" xPadded>
            (We don't spam people, it's not cool.)
          </Text>
        </View>
      </View>
      <View style={styles.buttons}>
        <Button style={styles.buttonSpaced} onPress={handleTellFriends}>
          Share & Invite My Circle
        </Button>
        <ShellButton
          padded
          style={styles.buttonSpaced}
          onPress={handleContinue}
        >
          <Text center fontSize="standard" fontStyle="semiBold" color="green">
            Not Now
          </Text>
        </ShellButton>
      </View>
    </SafeAreaView>
  )
}

export default InviteContacts
