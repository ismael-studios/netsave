import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Text, ShowAlert, Button, Header, Input } from '../../../components'
import styles from './styles'
import currency from 'currency.js'
import { MainStackScreenProps } from '../../../navigation/types'
import {
  useGetBalanceQuery,
  useGetExternalAccountsQuery,
  usePostBalanceTransactionsMutation,
} from '../../../store/slice/api/features/user'
import { useAppSelector } from '../../../store/hooks'

const WithdrawScreen = ({ navigation }: MainStackScreenProps<'Withdraw'>) => {
  const { sub } = useAppSelector((state) => state.session)
  const { data: balance } = useGetBalanceQuery(sub)
  const [amount, setAmount] = useState(String(balance?.available || 0))

  const { data: externalAccounts = [] } = useGetExternalAccountsQuery(sub)

  const [postBalanceTransaction, { isLoading, isSuccess, isError, error }] =
    usePostBalanceTransactionsMutation()

  useEffect(() => {
    if (isSuccess) {
      navigation.navigate('MyEarnings')
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

  const handleBankAccount = () => {
    navigation.navigate('BankAccount')
  }

  const handleWithdraw = () => {
    postBalanceTransaction({
      userId: sub,
      data: {
        amount: currency(amount).value,
      },
    })
  }

  const renderLabel = (
    label: string,
    label2: string,
    okay: boolean,
    color = 'green'
  ) => {
    return (
      <Text>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.label} color={okay ? color : 'orange'}>
          {label2}
        </Text>
      </Text>
    )
  }

  const isGreaterThanZero = currency(amount) > currency(0)
  const isFundsAvailable = currency(amount) <= currency(balance?.available || 0)
  const canSend = isGreaterThanZero && isFundsAvailable

  return (
    <View style={styles.container}>
      <Header bordered avoidMode showBack title="Withdraw" />
      <View style={styles.withdrawView}>
        {externalAccounts.length > 0 ? (
          <View style={styles.withdrawWrapper}>
            <View>
              <Text fontSize="h6">Available Balance</Text>
              <Text fontSize="medium" fontStyle="bold" paragraph>
                {currency(balance?.available || 0).format()}
              </Text>
              <View style={styles.formRow}>
                <Input
                  leftElement={<Text style={styles.dollarSign}>$</Text>}
                  rightElement={<Text style={styles.usdText}>USD</Text>}
                  inputStyle={styles.inputText}
                  label={renderLabel(
                    "Enter the amount you'd like to withdraw",
                    '*',
                    canSend
                  )}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>
            </View>
            <View>
              {!isFundsAvailable ? (
                <Text fontSize="h6" leading={25} center color="red">
                  Cannot withdraw more than{' '}
                  <Text fontSize="h6" fontStyle="bold" color="red">
                    {currency(balance?.available || 0).format()}
                  </Text>
                </Text>
              ) : !isGreaterThanZero ? (
                <Text fontSize="h6" leading={25} center color="red">
                  Amount must be greater than 0.
                </Text>
              ) : (
                <Text fontSize="h6" leading={25} center>
                  Withdraw{' '}
                  <Text fontSize="h6" fontStyle="bold">
                    {currency(amount).format()}
                  </Text>{' '}
                  direct to{' '}
                  <Text fontSize="h6" fontStyle="bold">
                    {externalAccounts[0].bankName}
                  </Text>{' '}
                  account ending in{' '}
                  <Text fontSize="h6" fontStyle="bold">
                    {externalAccounts[0].last4}
                  </Text>
                  ?
                </Text>
              )}

              <Button
                tight
                style={styles.withdrawButton}
                disabled={!canSend}
                loading={isLoading}
                onPress={handleWithdraw}
              >
                Withdraw
              </Button>
            </View>
          </View>
        ) : (
          <View>
            <Text fontSize="standard" center>
              Add a bank account to withdraw your earnings to.
            </Text>
            <View>
              <Button
                tight
                style={styles.withdrawButton}
                onPress={handleBankAccount}
              >
                Add Bank Account
              </Button>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

export default WithdrawScreen
