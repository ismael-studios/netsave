import React, { useEffect, useState } from 'react'
import { View, Image } from 'react-native'
import {
  Text,
  ShowAlert,
  Button,
  ShellButton,
  Header,
  ScrollView,
  ModalBox,
  HintButton,
  Input,
} from '../../../components'
import { Images } from '../../../common'
import styles from './styles'
import moment from 'moment'
import { Calendar, DateData } from 'react-native-calendars'
import { MainStackScreenProps } from '../../../navigation/types'
import { useAppSelector } from '../../../store/hooks'
import { usePostExternalAccountsMutation } from '../../../store/slice/api/features/user'

const { ROUTING_NUMBER, ACCOUNT_NUMBER, CALENDAR } = Images

const formatCalendarDate = (dob: string) => {
  const m = moment(dob, 'MM/DD/YYYY').format('YYYY-MM-DD')
  return m !== 'Invalid date' ? m : '2000-01-31'
}

const BankAccountScreen = ({
  navigation,
}: MainStackScreenProps<'BankAccount'>) => {
  const { user, sub } = useAppSelector((state) => state.session)
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [dob, setDOB] = useState('')
  const [last4, setLast4] = useState('')
  const [routingNumber, setRoutingNumber] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [showRoutingModal, setShowRoutingModal] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [showCalendarModal, setShowCalendarModal] = useState(false)

  const [createExternalAccount, { isLoading, isSuccess, isError, error }] =
    usePostExternalAccountsMutation()

  useEffect(() => {
    if (isSuccess) {
      navigation.navigate('Withdraw')
    }
  }, [isSuccess, navigation])

  useEffect(() => {
    if (isError) {
      ShowAlert({
        title: 'Sorry!',
        message: `Error: ${error.data.message}`,
        actions: [{ name: 'Try Again' }],
      })
    }
  }, [isError, error])

  const renderLabel = (
    label: string,
    label2: string,
    okay: boolean,
    color = 'green'
  ) => {
    return (
      <View>
        <Text>
          <Text style={styles.label} fontStyle="bold">
            {label}
          </Text>
          <Text style={styles.label} color={okay ? color : 'orange'}>
            {label2}
          </Text>
        </Text>
      </View>
    )
  }

  const handleToggleRoutingModal = () => setShowRoutingModal(!showRoutingModal)

  const handleToggleAccountModal = () => setShowAccountModal(!showAccountModal)

  const handleToggleCalendarModal = () =>
    setShowCalendarModal(!showCalendarModal)

  const handleCalendarChange = (day: DateData) => {
    setDOB(moment(day.dateString, 'YYYY-MM-DD').format('L'))
    handleToggleCalendarModal()
  }

  const handleAddAccount = () => {
    const mDOB = moment(dob, 'MM/DD/YYYY')
    const body = {
      firstName,
      lastName,
      dob: {
        day: +mDOB.format('D'),
        month: +mDOB.format('M'),
        year: +mDOB.format('YYYY'),
      },
      ssnLast4: last4,
      routingNumber,
      accountNumber,
    }

    createExternalAccount({
      userId: sub,
      data: body,
    })
  }

  const validDOB = moment(dob, 'MM/DD/YYYY').format() !== 'Invalid date'
  const validSSN = last4 && last4.length === 4
  const validRoutingNumber = routingNumber.length === 9
  const validAccountNumber =
    accountNumber.length > 5 && accountNumber.length < 18
  const canSend =
    !!firstName &&
    !!lastName &&
    validDOB &&
    !!validSSN &&
    validRoutingNumber &&
    validAccountNumber
  return (
    <View style={styles.container}>
      <Header bordered avoidMode showBack title="Add Bank Account" />
      <ScrollView>
        <View style={styles.form}>
          <View>
            <View style={styles.formRow}>
              {renderLabel(
                'Legal Name (as shown in your ID)',
                '*',
                !!firstName && !!lastName
              )}
              <View style={styles.nameInputView}>
                <Input
                  style={[styles.input, styles.nameInput]}
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                />

                <Input
                  style={[styles.input, styles.nameInput]}
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>
            <View style={styles.formRow}>
              <View style={styles.hintLabelView}>
                {renderLabel('Date of birth', '*', validDOB)}
                <ShellButton
                  style={{ marginLeft: 6 }}
                  onPress={handleToggleCalendarModal}
                >
                  <Image source={CALENDAR} style={styles.calendarImage} />
                </ShellButton>
              </View>
              <Input
                style={styles.input}
                placeholder="01/31/2000"
                value={dob}
                onChangeText={setDOB}
              />
            </View>
            <View style={styles.formRow}>
              {renderLabel('Last 4 digits of your SSN', '*', !!validSSN)}
              <Input
                style={styles.input}
                placeholder="1234"
                value={last4}
                maxLength={4}
                keyboardType="number-pad"
                onChangeText={setLast4}
              />
            </View>
            <View style={styles.formRow}>
              <View style={styles.hintLabelView}>
                {renderLabel('Routing Number', '*', validRoutingNumber)}
                <HintButton
                  style={{ marginLeft: 9 }}
                  hitSize={10}
                  onPress={handleToggleRoutingModal}
                />
              </View>
              <Input
                style={styles.input}
                placeholder="Routing Number"
                value={routingNumber}
                keyboardType="number-pad"
                onChangeText={setRoutingNumber}
              />
            </View>
            <View style={styles.formRow}>
              <View style={styles.hintLabelView}>
                {renderLabel('Account Number', '*', validAccountNumber)}
                <HintButton
                  style={{ marginLeft: 6 }}
                  hitSize={10}
                  onPress={handleToggleAccountModal}
                />
              </View>
              <Input
                style={styles.input}
                placeholder="Account Number"
                value={accountNumber}
                keyboardType="number-pad"
                onChangeText={setAccountNumber}
              />
            </View>
          </View>
          <View>
            <Button
              tight
              style={styles.addAccountButton}
              disabled={!canSend}
              loading={isLoading}
              onPress={handleAddAccount}
            >
              Add Account
            </Button>
          </View>
        </View>
      </ScrollView>

      <ModalBox
        onHide={handleToggleCalendarModal}
        visible={showCalendarModal}
        disableOutsideClose
      >
        <View style={styles.calendarView}>
          <Calendar
            current={formatCalendarDate(dob)}
            markedDates={{
              [formatCalendarDate(dob)]: {
                selected: true,
              },
            }}
            onDayPress={handleCalendarChange}
            enableSwipeMonths={true}
          />
        </View>
      </ModalBox>
      <ModalBox
        onHide={handleToggleRoutingModal}
        visible={showRoutingModal}
        title="Routing Number"
      >
        <View style={styles.checkHintView}>
          <Image source={ROUTING_NUMBER} style={styles.checkHintImage} />
        </View>
        <View style={styles.formRow}>
          <Text style={styles.hintText}>
            The routing number is located at the bottom of the check. The first
            set of numbers on the left is the nine-digit bank routing number.
          </Text>
        </View>
        <Button tight block onPress={handleToggleRoutingModal}>
          Got It
        </Button>
      </ModalBox>
      <ModalBox
        onHide={handleToggleAccountModal}
        visible={showAccountModal}
        title="Account Number"
      >
        <View style={styles.checkHintView}>
          <Image source={ACCOUNT_NUMBER} style={styles.checkHintImage} />
        </View>
        <View style={styles.formRow}>
          <Text style={styles.hintText}>
            The account number is located at the bottom of the paper check. The
            middle set of numbers is your account number.
          </Text>
        </View>
        <Button tight block onPress={handleToggleAccountModal}>
          Got It
        </Button>
      </ModalBox>
    </View>
  )
}

export default BankAccountScreen
