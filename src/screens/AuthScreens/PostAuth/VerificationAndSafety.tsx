import React, { useEffect, useState } from 'react'
import { Image, View } from 'react-native'
import {
  Text,
  Button,
  ScrollView,
  SafeAreaView,
  CheckBoxLabel,
  ShellButton,
  BackButton,
  Header,
} from '../../../components'
import styles from './Styles'
import { Images } from '../../../common'
import analytics from '@react-native-firebase/analytics'
import { OnboardStackScreenProps } from '../../../navigation/types'
import { Colors } from '../../../common'

const { AUTH_SAFETY, CHECK_CIRCLE_OUTLINED_GREEN } = Images

const rememberNotes: Array<string> = [
  'Be authentic by providing and verifying your identity',
  'Be dependable by sharing useful information & trade quality',
  'Pledge 100% to stand up against discrimination',
  'Respect the rights of your neighbors & support your own community',
  'Act according to your local community laws and do not engage in harmful activities',
]

const VerificationAndSafety = ({
  navigation,
}: OnboardStackScreenProps<'VerificationAndSafety'>) => {
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    analytics().logEvent('signup_community_guidelines_start')
  }, [])

  const handleCheck = (value: boolean) => {
    setAgreed(value)
  }

  const handleToggleCheck = () => {
    setAgreed(!agreed)
  }

  const handleContinue = async () => {
    analytics().logEvent('signup_community_guidelines_complete')
    navigation.navigate('Welcome')
  }

  return (
    <SafeAreaView>
      <Header avoidMode showBack title="" />
      <ScrollView>
        <View style={styles.subContainer}>
          <View>
            <Image source={AUTH_SAFETY} style={styles.safetyLogo} />
          </View>
          <View>
            <Text
              paragraph
              fontSize="h3"
              fontStyle="semiBold"
              style={styles.title}
              color={Colors.black}
            >
              Safe. Reliable. Interactive.
            </Text>
            <Text
              fontSize="standard"
              color={Colors.textGray}
              fontStyle="medium"
            >
              We pride ourselves on building a safe, reliable & interactive
              community. At Netsave®, we value & care for your safety and
              privacy.
            </Text>
          </View>
          <View style={styles.procedures}>
            <Text paragraph color={Colors.black}>
              Please remember to
            </Text>
            {rememberNotes.map((note, i) => (
              <View key={i} style={styles.point}>
                <Image
                  source={CHECK_CIRCLE_OUTLINED_GREEN}
                  style={styles.featureIcon2}
                />
                <Text
                  style={styles.pointText}
                  fontSize="standard"
                  color={Colors.textLightGray}
                  fontStyle="medium"
                >
                  {note}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.agreementContainer}>
            <CheckBoxLabel
              active={agreed}
              style={styles.checkBox}
              onChange={handleCheck}
            />
            <ShellButton onPress={handleToggleCheck}>
              <Text
                fontSize="standard"
                color={Colors.textGray}
                fontStyle="medium"
              >
                {'I agree to abide by the community guidelines listed above.'}
              </Text>
            </ShellButton>
          </View>
        </View>
      </ScrollView>
      <View style={[styles.buttons, styles.buttonSpaced]}>
        <Button disabled={!agreed} onPress={handleContinue}>
          Continue
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default VerificationAndSafety
