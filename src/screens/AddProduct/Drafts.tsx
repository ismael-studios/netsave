import React, { useState } from 'react'
import {
  View,
  Image,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native'
import {
  Text,
  Header,
  Button,
  Loading,
  ScrollView,
  ShellButton,
  SafeAreaView,
  FloatingMenu,
  OptionsButton,
} from '../../components'
import styles from './DraftStyles'
import { Images } from '../../common'
import { parsePrice } from '../../helpers/PriceHelper'
import analytics from '@react-native-firebase/analytics'
import { useGetUserProductsQuery } from '../../store/slice/api/features/product'
import { useAppSelector } from '../../store/hooks'
import { ProductType } from '../../types'
import { MainTabScreenProps } from '../../navigation/types'
import { skipToken } from '@reduxjs/toolkit/dist/query'

const { ELLIPSIS, IMAGE_PLACEHOLDER, PENCIL_O, SEE } = Images

const Drafts = ({ navigation }: MainTabScreenProps<'Sell'>) => {
  const [showMenu, setShowMenu] = useState(false)
  const [draft, setDraft] = useState<ProductType>()
  const [page, setPage] = useState(1)
  const { user } = useAppSelector((state) => state.session)

  const { data: drafts = [], isLoading } = useGetUserProductsQuery(
    user
      ? {
          userId: user.id,
          page,
          isDraft: true,
        }
      : skipToken
  )

  const getMenuOptions = () => [
    {
      name: 'Continue Editing',
      icon: PENCIL_O,
      callback: handleGoToEdit,
    },
    {
      name: 'Preview Product',
      icon: SEE,
      callback: handleGoToPreview,
    },
  ]
  const goToEditProduct = (product: ProductType) => {
    navigation.navigate('PostListing', {
      screen: 'AddProduct',
      params: {
        isEditMode: true,
        categoryId: product.categoryId,
        productId: product.id,
      },
    })
  }

  // handlers
  const handleToggleMenu = (draft: ProductType) => {
    setShowMenu(!showMenu)
    setDraft(draft)
  }

  const handleGoToNew = () => {
    analytics().logEvent('new_listing_start')

    navigation.navigate('PostListing', {
      screen: 'ChooseCategory',
    })
  }

  const handleGoToEdit = ({ product }: { product: ProductType }) => {
    goToEditProduct(product)
  }

  const handleGoToPreview = () => {
    if (!draft) {
      return
    }
    navigation.navigate('ProductDetails', {
      userId: draft.userId,
      productId: draft.id,
    })
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    console.log('SCROLLING')
    const {
      nativeEvent: {
        contentOffset = { y: 0 }, // : {x, y},
        contentSize = { height: 0 }, // : {height, width},
        layoutMeasurement = { height: 0 }, // : {height, width},
      },
    } = event
    console.log('contentOffset', contentOffset)
    console.log('contentSize', contentSize)
    console.log('layoutMeasurement', layoutMeasurement)
    const scrollProgress =
      (contentOffset.y + layoutMeasurement.height) / contentSize.height
    if (scrollProgress > 0.85 && !isLoading) {
      // default page size is 10
      const divisible = drafts.length / 10
      const isEmpty = drafts.length == 0
      const hasRemainder = isEmpty || String(divisible).match(/\./)
      const nextPage = divisible + 1
      if (hasRemainder) {
        // no need to get more since
        // the last result came up short
      } else {
        // fetch the next page
        setPage(nextPage)
      }
    } else if (contentOffset.y === 0 && !isLoading) {
      setPage(1)
    }
  }

  // renderers
  const renderDraft = (product: ProductType) => (
    <ShellButton
      key={product.id}
      data={{ product }}
      style={styles.draft}
      onPress={handleGoToEdit}
    >
      <Image
        style={styles.draftImage}
        source={
          product.previewImageUrl
            ? { uri: product.previewImageUrl }
            : IMAGE_PLACEHOLDER
        }
      />
      <View style={styles.draftTitle}>
        <Text style={styles.titleText} numberOfLines={2}>
          {product.title || 'No title'}
        </Text>
        <Text style={styles.priceText}>{parsePrice(product.price)}</Text>
      </View>
      <View style={styles.draftActions}>
        <OptionsButton
          data={product}
          image={ELLIPSIS}
          onPress={!isLoading && handleToggleMenu}
        >
          {draft && product.id == draft.id && isLoading ? (
            <ActivityIndicator color="green" />
          ) : null}
        </OptionsButton>
      </View>
    </ShellButton>
  )

  const hasNoDrafts = drafts.length === 0

  return (
    <SafeAreaView style={styles.container}>
      <Header bordered title="Sell an item on Netsave" style={styles.header} />
      <View style={styles.wrapper}>
        <Text style={styles.labelTitle}>Drafts</Text>
        <Loading show={isLoading && hasNoDrafts}>
          <ScrollView
            scrollerProps={{
              scrollEventThrottle: 500,
              onScroll: handleScroll,
            }}
          >
            <View style={styles.drafts}>{drafts.map(renderDraft)}</View>
          </ScrollView>
        </Loading>
      </View>
      <View style={styles.actions}>
        <Button tight onPress={handleGoToNew}>
          <Text fontStyle="bold" white>
            +{' '}
          </Text>
          <Text white>Post A New Listing</Text>
        </Button>
      </View>
      {showMenu && (
        <FloatingMenu
          title="Options"
          menu={getMenuOptions()}
          closeCallBack={handleToggleMenu}
          style={styles.floatingMenu}
        />
      )}
    </SafeAreaView>
  )
}

export default Drafts
