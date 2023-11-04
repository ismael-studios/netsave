import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import {
  Text,
  Button,
  Header,
  ScrollView,
  SafeAreaView,
  SeeNotSee,
  Input,
} from '../../components'
import styles from './Styles'
import TermsAndConditions from './TermsAndConditions'
import { usePostUserMutation } from '../../store/slice/api/features/user'
import { AuthStackScreenProps } from '../../navigation/types'
const regex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/)

const InvalidPasswordText = (
  <>
    <Text color="orange" fontStyle="bold" fontSize="tiny">
      Include at least one number and one letter.
    </Text>
    <Text color="orange" fontStyle="bold" fontSize="tiny">
      Only the following symbols are allowed: @$!%*#?&#38;
    </Text>
  </>
)
const ChoosePassword = ({
  navigation,
  route,
}: AuthStackScreenProps<'ChoosePassword'>) => {
  const { firstName, lastName, email } = route.params
  const [seePassword, setSeePassword] = useState(false)
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [postUser, { isLoading, isSuccess }] = usePostUserMutation()

  useEffect(() => {
    if (isSuccess) {
      navigation.navigate('CheckEmail', {
        destination: 'VerifyCode',
        email,
      })
    }
  }, [isSuccess, navigation, email, password])

  const toggleSeePassword = () => {
    setSeePassword(!seePassword)
  }

  const toggleSeeConfirmPassword = () => {
    setSeeConfirmPassword(!setSeeConfirmPassword)
  }

  const handleContinue = async () => {
    postUser({
      firstName,
      lastName,
      password,
      email,
    })
  }

  const renderPasswordNote = () => {
    return (
      <Text fontStyle="bold" fontSize="h6" style={{ flexDirection: 'row' }}>
        {'Password  '}
        <Text fontStyle="light" fontSize="h6">
          (Must be at least 8 characters)
        </Text>
      </Text>
    )
  }

  const passwordMatch = password === passwordConfirmation
  const validPassword = regex.test(password) && regex.test(passwordConfirmation)
  const canSend = passwordMatch && validPassword

  return (
    <SafeAreaView style={styles.container}>
      <Header showLogo showBack />
      <ScrollView>
        <View style={styles.subContainer}>
          <View style={styles.form}>
            <Text fontStyle="bold" fontSize="h2" style={styles.title}>
              Choose Password
            </Text>
            <View style={styles.row}>
              <Input
                secureTextEntry={!seePassword}
                selectTextOnFocus
                label={renderPasswordNote()}
                autoCompleteType="password"
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
                placeholder="********"
              />

              <SeeNotSee
                style={styles.notSeeButton}
                seeing={seePassword}
                onPress={toggleSeePassword}
              />
            </View>

            {!!password && !regex.test(password) && InvalidPasswordText}
            <View style={styles.row}>
              <Input
                secureTextEntry={!seeConfirmPassword}
                selectTextOnFocus
                label="Confirm Password"
                autoCompleteType="password"
                autoCapitalize="none"
                placeholder="********"
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
              />
              <SeeNotSee
                style={styles.notSeeButton}
                seeing={seeConfirmPassword}
                onPress={toggleSeeConfirmPassword}
              />
            </View>
            {!!passwordConfirmation &&
              !regex.test(passwordConfirmation) &&
              InvalidPasswordText}

            {validPassword && !passwordMatch && (
              <View style={styles.spaced}>
                <Text color="orange" fontStyle="bold" fontSize="tiny">
                  Passwords do not match
                </Text>
              </View>
            )}

            <Button
              loading={isLoading}
              disabled={!canSend}
              onPress={handleContinue}
              style={[styles.button, styles.spaced]}
            >
              Continue
            </Button>
          </View>
        </View>
      </ScrollView>
      <TermsAndConditions />
    </SafeAreaView>
  )
}

export default ChoosePassword
