import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'
import { Text, ShellButton } from '../../components'
import styles from './Styles'

interface TermsAndConditionsProps {
  sentence?: string
}
const TermsAndConditions = ({
  sentence = 'By creating an account, you agree to our',
}: TermsAndConditionsProps) => {
  const navigation = useNavigation()

  const handleGoToTerms = () =>
    navigation.navigate('WebScreen', {
      uri: 'https://netsave.com/terms?source=webview',
    })

  const handleGoToPrivacy = () =>
    navigation.navigate('WebScreen', {
      uri: 'https://netsave.com/privacy?source=webview',
    })

  return (
    <View style={styles.footerNote}>
      <Text fontStyle={'light'} fontSize={'irregular'} color="textDarkGray">
        {sentence}
      </Text>
      <View style={styles.inline}>
        <ShellButton style={styles.link} onPress={handleGoToTerms}>
          <Text
            underlined
            fontStyle={'light'}
            fontSize={'irregular'}
            color="textDarkGray"
          >
            Terms & Conditions
          </Text>
        </ShellButton>
        <Text fontStyle={'light'} fontSize={'irregular'} color="textDarkGray">
          and
        </Text>
        <ShellButton style={styles.link} onPress={handleGoToPrivacy}>
          <Text
            underlined
            fontStyle={'light'}
            fontSize={'irregular'}
            color="textDarkGray"
          >
            Privacy Policy
          </Text>
        </ShellButton>
      </View>
    </View>
  )
}

export default TermsAndConditions
