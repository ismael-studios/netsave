import React from 'react'
import { View, Image } from 'react-native'
import {
  Text,
  ScrollView,
  ShellButton,
  ShowAlert,
  Loading,
  Header,
} from '../../components'
import styles from './Styles'
import { Images } from '../../common'
import moment from 'moment'
import * as Animatable from 'react-native-animatable'
import { TransactionStackScreenProps } from '../../navigation/types'
import { useGetTracksQuery } from '../../store/slice/api/features/shipment'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { TrackHistoryData } from '../../types'

const { CHECK_CIRCLE } = Images

const TrackShipment = ({
  route,
}: TransactionStackScreenProps<'TrackShipping'>) => {
  const { product, transaction } = route.params
  const { shipmentId } = transaction

  const { data: tracking, isLoading } = useGetTracksQuery(
    shipmentId ?? skipToken
  )

  const showDetail = (data: string) => ShowAlert({ message: data })

  if (!tracking) {
    return null
  }

  const { title, previewImageUrl } = product
  const { shipment } = transaction
  const { carrier, trackingNumber, isDelivered } = shipment || {}
  const {
    data: {
      eta,
      tracking_history,
      tracking_status: { status_details, status },
    },
  } = tracking
  const arrivalDate = eta ? moment(eta).format('dddd, MMM DD') : null
  const beenDelivered = String(status).match(/delivered/i)

  return (
    <View style={styles.container}>
      <Header
        showBack
        bordered
        avoidMode
        title={'Tracking'}
        style={styles.header}
      />
      <ScrollView>
        <View style={styles.topSpacer}>
          <Loading show={isLoading}>
            <View style={styles.subContainer}>
              <View style={styles.formRow}>
                {!!previewImageUrl && (
                  <Animatable.View
                    delay={80}
                    animation="fadeInUp"
                    duration={600}
                    easing="ease-out-expo"
                    style={styles.product}
                  >
                    <Image
                      style={styles.productImage}
                      source={{ uri: previewImageUrl }}
                    />
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={1}>
                        {title}
                      </Text>
                      <Text style={styles.metadata}>Courier: {carrier}</Text>
                      <Text style={styles.metadata}>
                        Tracking ID: {trackingNumber}
                      </Text>
                    </View>
                  </Animatable.View>
                )}
              </View>
              <View style={styles.formRow}>
                <Animatable.View
                  delay={120}
                  animation="fadeInUp"
                  duration={600}
                  easing="ease-out-expo"
                  style={[
                    styles.trackingHeader,
                    beenDelivered && styles.deliveredHeader,
                  ]}
                >
                  <View style={styles.inlineCenter}>
                    {beenDelivered && (
                      <Image style={styles.checkCricle} source={CHECK_CIRCLE} />
                    )}
                    <Text style={styles.trackingStatement}>
                      {status_details}
                    </Text>
                  </View>
                  {!!arrivalDate && (
                    <Text style={styles.trackingDate}>{arrivalDate}</Text>
                  )}
                </Animatable.View>
              </View>
              <View style={styles.formRow}>
                <View style={styles.events}>
                  {tracking_history &&
                    tracking_history.map(
                      (event: TrackHistoryData, i, { length }) => {
                        const {
                          status_date,
                          status_details,
                          location,
                          status,
                        } = event
                        const { city, state } = location
                        const timestamp =
                          moment(status_date).format('MMM DD, h:mma')
                        const hasIssue = String(status).match(/fail/i)
                        const last = length - 1 === i

                        return (
                          <Animatable.View
                            delay={120 + 50 * i}
                            animation="fadeInRight"
                            duration={600}
                            easing="ease-out-expo"
                            style={styles.event}
                            key={i}
                          >
                            <View style={styles.eventTimeline}>
                              <View
                                style={[
                                  styles.eventDot,
                                  hasIssue && styles.dotFail,
                                ]}
                              />
                              {!last && <View style={styles.eventLine} />}
                            </View>
                            <View style={styles.eventInfo}>
                              <ShellButton
                                data={status_details}
                                onPress={showDetail}
                              >
                                <Text
                                  style={styles.eventName}
                                  numberOfLines={2}
                                >
                                  {status_details}
                                </Text>
                              </ShellButton>
                              <Text style={styles.eventTime}>{timestamp}</Text>
                              <Text style={styles.eventLocation}>
                                {city} {state}
                              </Text>
                            </View>
                          </Animatable.View>
                        )
                      }
                    )}
                </View>
              </View>
            </View>
          </Loading>
        </View>
      </ScrollView>
      {/*<View style={styles.actions}></View>*/}
    </View>
  )
}

export default TrackShipment
