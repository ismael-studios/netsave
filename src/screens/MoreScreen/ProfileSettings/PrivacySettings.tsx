import React, { useEffect, useState } from 'react'
import { View, KeyboardAvoidingView } from 'react-native'
import {
  Text,
  Input,
  Button,
  Header,
  ShowAlert,
  ScrollView,
  ShellButton,
} from '../../../components'
import styles from './styles'
import { Images, Metrics } from '../../../common'
import { MainStackScreenProps } from '../../../navigation/types'
import { useAppSelector } from '../../../store/hooks'
import { useUpdateUserMutation } from '../../../store/slice/api/features/user'

const { ifIOS } = Metrics

const regex = new RegExp(
  /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/
)

const InvalidNameText = (
  <Text
    color="orange"
    fontStyle="bold"
    fontSize="tiny"
    style={styles.lastNameNote}
  >
    Name must be more than 2 characters and not include symbols.
  </Text>
)

const PrivacySettings = ({
  navigation,
}: MainStackScreenProps<'PrivacySettings'>) => {
  const { user } = useAppSelector((state) => state.session)

  const [username, setUsername] = useState(user?.username || '')
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [description, setDescription] = useState(user?.description || '')
  const [changes, setChanges] = useState(false)

  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation()

  useEffect(() => {
    if (isSuccess) {
      setChanges(false)
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError) {
      ShowAlert({
        title: 'Hold on!',
        message: error.data.message,
        actions: [{ name: 'Okay', positive: true }],
      })
    }
  }, [isError, error])

  useEffect(() => {
    if (
      username !== user?.username ||
      firstName !== user?.firstName ||
      lastName !== user?.lastName ||
      description !== user?.description
    ) {
      setChanges(true)
    } else {
      setChanges(false)
    }
  }, [username, firstName, lastName, description, user])

  // handlers
  const handleBackPress = () => {
    if (changes) {
      ShowAlert({
        title: 'Hold on!',
        message:
          'You have unsaved changes.\nDo you wish to discard your changes?',
        actions: [
          {
            positive: true,
            name: 'Discard Changes',
            callback: () => {
              navigation.goBack()
              console.log('Discards Changes')
            },
          },
          {
            name: 'Cancel',
          },
        ],
      })
      return true
    }
  }

  const handleUpdate = () => {
    updateUser({
      id: user.id,
      username,
      lastName,
      firstName,
      description,
    })
  }

  const renderChangePassword = () => {
    return (
      <ShellButton style={styles.forgetButton} onPress={handleForgetPassword}>
        <Text color="green" fontSize="h6">
          Change Password
        </Text>
      </ShellButton>
    )
  }

  const handleForgetPassword = () => {
    navigation.navigate('ResetPassword', {
      screen: 'ResetPasswordRequest',
      params: {
        // origin: 'PrivacySettings',
        email: user?.email,
      },
    })
  }

  const fullName = `${firstName} ${lastName}`
  const validFirstName = regex.test(firstName.trim())
  const validLastName = regex.test(lastName.trim())
  const canSend = validFirstName && validLastName && username

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={ifIOS('padding', 'height')}
    >
      <View style={styles.container}>
        <Header
          avoidMode
          showBack
          title="Security & Privacy Settings"
          onBackPress={handleBackPress}
        />
        <ScrollView>
          <View style={[styles.form, styles.noBase]}>
            <View style={styles.row}>
              <View style={styles.colum}>
                <Input
                  label="First Name"
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoComplete="name"
                  autoCapitalize="words"
                />
                {!!firstName && !validFirstName && InvalidNameText}
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.colum}>
                <Input
                  label="Last Name"
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  autoComplete="name"
                  autoCapitalize="words"
                />
                {!!lastName && !validLastName && InvalidNameText}
              </View>
            </View>
            <View style={styles.row}>
              <Input
                label="Username"
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoComplete="username"
                autoCapitalize="words"
              />
            </View>
            <View style={styles.row}>
              <Input
                label="Bio"
                multiline
                autogrow
                numberOfLines={4}
                placeholder="Enter a brief description about yourself"
                value={description}
                onChangeText={setDescription}
                autoCapitalize="sentences"
              />
            </View>

            <View style={styles.row}>
              <Input
                disabled
                secureTextEntry
                selectTextOnFocus
                label="Password"
                autoCompleteType="password"
                autoCapitalize="none"
                placeholder="Password"
                inputStyle={styles.password}
                rightElement={renderChangePassword()}
                value={'••••••••••••••••'}
              />
            </View>

            {/*
              <View style={styles.row}>
                <Input
                  label='Email'
                  placeholder='user@email.com'
                  value={email}
                  onChangeText={this.setChangeValue('email')}
                  autoCompleteType='email'
                  autoCapitalize='none'
                  keyboardType='email-address'
                />
              </View>
              <View style={styles.row}>
                <Input
                  label='Phone Number'
                  placeholder='123-456-7890'
                  value={phone}
                  onChangeText={this.setChangeValue('phone')}
                  autoCapitalize='none'
                  keyboardType='numeric'
                />
              </View>
            */}
          </View>
          <View style={styles.actions}>
            <Button
              loading={isLoading}
              disabled={!(canSend && changes)}
              style={styles.button}
              onPress={handleUpdate}
            >
              Update
            </Button>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}

export default PrivacySettings
