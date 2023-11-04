import React, { useState } from 'react'
import { View, Image } from 'react-native'
import {
  Text,
  Button,
  ShellButton,
  ErrorBoundary,
  Header,
  Loading,
  ScrollView,
  ModalBox,
  HintButton,
} from '../../../components'
import { Colors, Images } from '../../../common'
import styles from './styles'
import moment from 'moment'
import currency from 'currency.js'
import { BalanceTransaction, RewardTransaction } from '../../../types'
import { useAppSelector } from '../../../store/hooks'
import { MainStackScreenProps } from '../../../navigation/types'
import { useGetRewardTransactionsQuery } from '../../../store/slice/api/features/reward'
import {
  useGetBalanceQuery,
  useGetBalanceTransactionsQuery,
} from '../../../store/slice/api/features/user'

const MyEarningsScreen = ({
  navigation,
}: MainStackScreenProps<'MyEarnings'>) => {
  const { user, sub } = useAppSelector((state) => state.session)
  const [showPendingModal, setShowPendingModal] = useState(false)
  const [view, setView] = useState<'earnings' | 'rewards'>('earnings')

  const { data: balance = {}, isLoading: isLoadingBalance } =
    useGetBalanceQuery(sub)
  const {
    data: balanceTransactions = [],
    isLoading: isLoadingBalanceTransactions,
  } = useGetBalanceTransactionsQuery(sub)
  const {
    data: rewardsTransactions = [],
    isLoading: isLoadingRewardsTransactions,
  } = useGetRewardTransactionsQuery()

  const handleEarningDetails = (balanceTransaction: BalanceTransaction) => {
    navigation.navigate('EarningsDetails', { balanceTransaction })
  }

  const handleWithdraw = () => {
    navigation.navigate('Withdraw')
  }

  const handleCrashError = () => {}

  const renderBalanceTransaction = (balanceTransaction: BalanceTransaction) => {
    return (
      <ErrorBoundary onError={handleCrashError}>
        <View
          style={[
            styles.balanceTransaction,
            {
              backgroundColor:
                balanceTransaction.status === 'pending'
                  ? Colors.pastalGreen
                  : Colors.white,
            },
          ]}
        >
          <View style={styles.descriptionView}>
            <Text fontSize="h6" fontStyle="bold" numberOfLines={1}>
              {balanceTransaction.description}
            </Text>
            <Text fontSize="h6" color="lighterGray">
              {balanceTransaction.status === 'pending'
                ? 'Pending'
                : balanceTransaction.status === 'available'
                ? moment(balanceTransaction.created).format('l')
                : balanceTransaction.status}
            </Text>
          </View>
          <View style={styles.netView}>
            <Text fontSize="h6" fontStyle="bold">
              {balanceTransaction.net > 0 && '+'}
              {currency(balanceTransaction.net).format()}
            </Text>
            {balanceTransaction.type === 'payment' ? (
              <ShellButton
                style={styles.exclamationButton}
                onPress={() => handleEarningDetails(balanceTransaction)}
              >
                <Image
                  source={Images.EXCLAMATION_BLACK}
                  style={styles.exclamationImage}
                />
              </ShellButton>
            ) : (
              <View style={styles.placeholderAction} />
            )}
          </View>
        </View>
      </ErrorBoundary>
    )
  }

  const handleTogglePendingModal = () => setShowPendingModal(!showPendingModal)

  const handleMenuPress = (view: 'earnings' | 'rewards') => {
    setView(view)
  }

  const handleSellItem = () => {
    navigation.navigate('Main', {
      screen: 'Sell',
    })
  }

  const renderRewardTransaction = (rewardTransaction: RewardTransaction) => {
    return (
      <ErrorBoundary onError={handleCrashError} key={rewardTransaction.id}>
        <View style={[styles.balanceTransaction]}>
          <View style={styles.descriptionView}>
            <Text fontSize="h6" fontStyle="bold" numberOfLines={1}>
              {rewardTransaction.description}
            </Text>
            <Text fontSize="h6" color="lighterGray">
              {moment(rewardTransaction.createdAt).format('l')}
            </Text>
          </View>
          <View style={styles.netView}>
            <Text fontSize="h6" fontStyle="bold">
              {rewardTransaction.net > 0 && '+'}
              {rewardTransaction.net} PTS
            </Text>
          </View>
        </View>
      </ErrorBoundary>
    )
  }

  return (
    <View style={styles.container}>
      <Header bordered avoidMode showBack title="My Wallet" />
      <View style={styles.menu}>
        <ShellButton
          style={[styles.menuButton, view === 'earnings' && styles.menuActive]}
          onPress={() => handleMenuPress('earnings')}
        >
          <Text fontSize="h6" fontStyle="bold">
            Earnings
          </Text>
        </ShellButton>
        <ShellButton
          style={[styles.menuButton, view === 'rewards' && styles.menuActive]}
          onPress={() => handleMenuPress('rewards')}
        >
          <Text fontSize="h6" fontStyle="bold">
            Rewards
          </Text>
        </ShellButton>
      </View>

      {view === 'earnings' ? (
        <View style={styles.container}>
          <View style={styles.balanceView}>
            <View style={styles.availableBalanceView}>
              <Text fontSize="h6" fontStyle="bold">
                Available Balance
              </Text>
              <Text fontSize="h0" fontStyle="extraBold">
                {currency(balance.available).format()}
              </Text>
            </View>

            <View style={styles.pendingBalanceView}>
              <Text fontSize="h6">Pending </Text>
              <Text fontSize="h6" fontStyle="bold">
                {currency(balance.pending).format()}
              </Text>
              <HintButton
                style={{ marginLeft: 6 }}
                hitSize={10}
                onPress={handleTogglePendingModal}
              />
            </View>
            <View style={{ width: '100%' }}>
              <Button
                tight
                style={styles.withdrawButton}
                onPress={handleWithdraw}
              >
                Withdraw
              </Button>
            </View>
          </View>
          <ScrollView>
            <View style={styles.balanceTransactionsView}>
              <Loading
                show={
                  isLoadingBalanceTransactions &&
                  balanceTransactions.length === 0
                }
              >
                {balanceTransactions.map(renderBalanceTransaction)}
              </Loading>
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.balanceView}>
            <View style={styles.availableBalanceView}>
              <Text fontSize="h6" fontStyle="bold">
                Available Balance
              </Text>
              <Text fontSize="h0" fontStyle="extraBold">
                {user?.rewardBalance} <Text fontStyle="extraBold">PTS</Text>
              </Text>
            </View>
            <View style={styles.pendingBalanceView}>
              <Text fontSize="h6">Credits Value: </Text>
              <Text fontSize="h6" fontStyle="bold">
                {currency(user?.rewardBalance || 0 * 0.005).format()}
              </Text>
            </View>

            <View>
              <Text fontSize="standard" paragraph>
                Your points or credit value can be applied to lower the costs of
                your purchases when electing to pay through our secure online
                payment option.
              </Text>
              <Text fontSize="standard">
                You may also earn additional points by taking the action below:
              </Text>
            </View>

            <View style={{ width: '100%' }}>
              <Button
                tight
                style={styles.withdrawButton}
                color="orange"
                onPress={handleSellItem}
              >
                List a Sale & Earn 1000 Points
              </Button>
            </View>
          </View>
          <ScrollView>
            <View style={styles.balanceTransactionsView}>
              <Loading
                show={
                  isLoadingRewardsTransactions &&
                  rewardsTransactions.length === 0
                }
              >
                {rewardsTransactions.map(renderRewardTransaction)}
              </Loading>
            </View>
          </ScrollView>
        </View>
      )}

      <ModalBox
        onHide={handleTogglePendingModal}
        visible={showPendingModal}
        title="Pending Earnings"
      >
        <View style={styles.formRow}>
          <Text style={styles.hintText}>
            Pending payments become available for you to withdraw after the
            standard seven day security period.
          </Text>
        </View>
        <Button tight block onPress={handleTogglePendingModal}>
          Got It
        </Button>
      </ModalBox>
    </View>
  )
}

export default MyEarningsScreen
