import React, { useState } from 'react'
import { View, Image } from 'react-native'
import {
  Text,
  Button,
  Header,
  ScrollView,
  ModalBox,
  HintButton,
  Loading,
} from '../../../components'
import FastImage from 'react-native-fast-image'
import { Colors, Images } from '../../../common'
import styles from './styles'
import moment from 'moment'
import currency from 'currency.js'
import short from 'short-uuid'
import { MainStackScreenProps } from '../../../navigation/types'
import { useGetTransactionByIdQuery } from '../../../store/slice/api/features/transaction'

const translator = short()
const { IMAGE_PLACEHOLDER, USER_PROFILE_CIRCLE } = Images

const EarningsDetailsScreen = ({
  route,
}: MainStackScreenProps<'EarningsDetails'>) => {
  const { balanceTransaction } = route.params
  const [showServiceFeeModal, setShowServiceFeeModal] = useState(false)

  const { data: transaction } = useGetTransactionByIdQuery({
    transactionId: balanceTransaction.transactionId,
    params: {
      expand: ['product', 'offer', 'buyer', 'shipment'],
    },
  })

  const handleToggleServiceFeeModal = () =>
    setShowServiceFeeModal(!showServiceFeeModal)

  const { product, offer, buyer, shipment, pickedUpAt } = transaction || {}
  const { title, previewImageUrl } = product || {}
  const { profileImageUrl } = buyer || {}
  const userProfileImage = profileImageUrl
    ? { uri: profileImageUrl }
    : USER_PROFILE_CIRCLE
  const deliveryMethod = shipment ? 'shipping' : 'local'
  const deliveryTime = shipment ? shipment.deliveredAt : pickedUpAt

  return (
    <View style={styles.container}>
      <Header
        bordered
        avoidMode
        showBack
        title={balanceTransaction.description}
      />
      {transaction ? (
        <ScrollView>
          <View style={styles.topSection}>
            <View style={styles.detailImageView}>
              <View style={styles.titleView}>
                <Text fontSize="medium" fontStyle="bold" numberOfLines={1}>
                  {title}
                </Text>
              </View>

              <View style={styles.imageContainer}>
                {previewImageUrl ? (
                  <Image
                    source={{ uri: previewImageUrl }}
                    style={styles.productImage}
                  />
                ) : (
                  <FastImage
                    source={IMAGE_PLACEHOLDER}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                )}
              </View>
            </View>
            <View>
              <View style={styles.detailView}>
                <View style={styles.detailRow}>
                  <Text fontSize="standard">Buyer</Text>
                  <View style={styles.userView}>
                    <Image
                      source={userProfileImage}
                      style={styles.profileImage}
                    />
                    <Text fontSize="standard">{buyer?.username}</Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Text fontSize="standard">Transaction ID</Text>
                  <Text fontSize="standard">
                    {translator.fromUUID(balanceTransaction.transactionId)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text fontSize="standard">Delivery - {deliveryMethod}</Text>
                  <Text fontSize="standard">
                    {moment(deliveryTime).format('lll')}
                  </Text>
                </View>
              </View>

              <View style={styles.detailView}>
                <View style={styles.detailRow}>
                  <Text fontSize="standard">Listing Price</Text>
                  <Text fontSize="standard" strikethrough color="gray">
                    {currency(product?.price || 0).format()}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text fontSize="standard">Offer Accepted at</Text>
                  <Text fontSize="standard" fontStyle="bold">
                    {balanceTransaction.net > 0 && '+ '}
                    {currency(offer?.price || 0).format()}
                  </Text>
                </View>
                {!!balanceTransaction.insurance && (
                  <View style={styles.detailRow}>
                    <Text fontSize="standard">Insurance</Text>

                    <Text fontSize="standard" fontStyle="bold" color="orange2">
                      - {currency(balanceTransaction.insurance).format()}
                    </Text>
                  </View>
                )}
                <View style={styles.detailRow}>
                  <View style={styles.serviceFeeView}>
                    <Text fontSize="standard">Service Fee</Text>
                    <HintButton
                      style={{ marginLeft: 6 }}
                      hitSize={10}
                      onPress={handleToggleServiceFeeModal}
                    />
                  </View>

                  <Text fontSize="standard" fontStyle="bold" color="orange2">
                    - {currency(balanceTransaction.fee).format()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={[
              styles.totalEarningView,
              {
                backgroundColor:
                  balanceTransaction.status === 'pending'
                    ? Colors.pastalGreen
                    : Colors.white,
              },
            ]}
          >
            <View style={styles.detailRow}>
              <View>
                <Text fontSize="standard" fontStyle="bold">
                  {balanceTransaction.status === 'pending'
                    ? 'Pending'
                    : 'Total'}{' '}
                  Earning:
                </Text>
                {balanceTransaction.status === 'pending' && (
                  <Text fontSize="small" color="gray" leading={20}>
                    Available On:{' '}
                    {moment(balanceTransaction.availableOn).format('ll')}
                  </Text>
                )}
              </View>
              <Text fontSize="h1" fontStyle="bold">
                {currency(balanceTransaction.net).format()}
              </Text>
            </View>
          </View>
        </ScrollView>
      ) : (
        <Loading show={true} />
      )}

      <ModalBox
        onHide={handleToggleServiceFeeModal}
        visible={showServiceFeeModal}
        title="Service Fee"
      >
        <View style={styles.formRow}>
          <Text style={styles.hintText}>
            Service fee is 9.95% of the offer accepted price.
          </Text>
          <Text style={styles.hintText}>
            For example, a product is listed at $100 USD and sold for $90 USD,
            the service fee would be 90 X 0.0995 = $8.96 USD
          </Text>
        </View>
        <Button tight block onPress={handleToggleServiceFeeModal}>
          Got It
        </Button>
      </ModalBox>
    </View>
  )
}

export default EarningsDetailsScreen
