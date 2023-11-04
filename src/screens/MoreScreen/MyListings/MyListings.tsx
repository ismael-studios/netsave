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
  ShellButton,
  Header,
  ScrollView,
  OptionsButton,
  FloatingMenu,
  ShowAlert,
} from '../../../components'
import { Images } from '../../../common'
import styles from './styles'
import currency from 'currency.js'
import { ProductType } from '../../../types'
import { trim } from 'ramda'
import { parsePrice } from '../../../helpers/PriceHelper'
import Share from 'react-native-share'
import short from 'short-uuid'
import { WEB_URL } from '../../../services/ApiConstants'
import moment from 'moment'
import { useAppSelector } from '../../../store/hooks'
import {
  useGetUserProductsQuery,
  useUpdateProductMutation,
} from '../../../store/slice/api/features/product'
import { MainStackScreenProps } from '../../../navigation/types'

const {
  ELLIPSIS,
  IMAGE_PLACEHOLDER,
  PENCIL_O,
  CHECK_CIRCLE,
  CLOSE_CRICLE,
  SHARE,
} = Images

const MyListingsScreen = ({
  navigation,
}: MainStackScreenProps<'MyListings'>) => {
  const [view, setView] = useState('published')
  const [showMenu, setShowMenu] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  )
  const [pageUnpublished, setPageUnpublished] = useState(1)
  const [pagePublished, setPagePublished] = useState(1)

  const { user, sub } = useAppSelector((state) => state.session)
  const { data: userProducts = [], isLoading: isLoadingPublished } =
    useGetUserProductsQuery({
      userId: sub,
      page: pagePublished,
      isPublished: true,
      isSold: false,
    })

  const { data: drafts = [], isLoading: isLoadingUnpublished } =
    useGetUserProductsQuery({
      userId: sub,
      page: pageUnpublished,
      isDraft: true,
    })

  const loading = isLoadingPublished || isLoadingUnpublished

  const [updateProduct, { isLoading: isLoadingUpdateProduct }] =
    useUpdateProductMutation()

  const getMenuOptions = () => {
    const options = [
      {
        name: 'Edit Product',
        icon: PENCIL_O,
        loading: false,
        callback: handleGoToEdit,
      },
    ]

    if (selectedProduct) {
      options.push({
        name: `${selectedProduct.isPublished ? 'Unpublish' : 'Publish'}${
          isLoadingUpdateProduct ? '...' : ' Product'
        }`,
        icon: selectedProduct.isPublished ? CLOSE_CRICLE : CHECK_CIRCLE,
        loading: isLoadingUpdateProduct,
        callback: handleTogglePublish,
      })
      if (selectedProduct.isPublished) {
        options.push({
          name: 'Share via...',
          icon: SHARE,
          loading: false,
          callback: handleShareProduct,
        })
      }
    }
    return options
  }

  const handleTogglePublish = () => {
    if (!selectedProduct || !user) {
      return
    }
    const product = selectedProduct
    const {
      id,
      images,
      isPublished,
      price,
      title,
      productConditionId,
      description,
    } = product
    const productToUpdate = {
      id,
      isPublished: !isPublished,
    }
    const hasPhotos = (images || []).length > 0
    const canPublish =
      Boolean(parsePrice(price, true)) &&
      title &&
      trim(title) &&
      description &&
      trim(description) &&
      productConditionId &&
      hasPhotos
    const shouldPublish = (!isPublished && canPublish) || isPublished

    if (shouldPublish) {
      updateProduct({
        userId: user.id,
        product: productToUpdate,
      })
    } else {
      // not fit to publish
      ShowAlert({
        message:
          'Before publishing a product, ensure your product has at least one image, title, reasonable description and a price. Please edit your product to continue.',
      })
    }
  }

  const handleShareProduct = () => {
    if (!selectedProduct) {
      return
    }
    const { price, title, id } = selectedProduct
    const PrintPrice = parsePrice(price)
    const translator = short()

    Share.open({
      title: 'Tell Friends',
      subject: title || '',
      message: `Check out this Netsave product, ${title} ${PrintPrice} ${WEB_URL}/p/${translator.fromUUID(
        id
      )}`,
      failOnCancel: false,
    })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        err && console.log(err)
        ShowAlert({ message: 'There was an error while sharing.' })
      })
  }

  const handleMenuPress = (value: 'published' | 'unpublished') => {
    setView(value)
  }

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

  const handleGoToEdit = ({ product }: { product: ProductType }) => {
    const currentDraft = product || selectedProduct || {}
    goToEditProduct(currentDraft)
  }

  const handleOnProductPress = ({ product }: { product: ProductType }) => {
    // navigate to show product detail
    navigation.navigate('ProductDetails', {
      userId: product.userId,
      productId: product.id,
      product,
    })
  }

  // handlers
  const handleToggleMenu = (product: ProductType) => {
    setShowMenu(!showMenu)
    setSelectedProduct(product)
  }

  const renderDraft = (product: ProductType) => (
    <ShellButton
      key={product.id}
      data={{ product }}
      style={styles.draft}
      onPress={handleOnProductPress}
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
        <Text fontSize="standard" fontStyle="bold" numberOfLines={2}>
          {product.title || 'No title'}
        </Text>
        <Text fontSize="standard" style={styles.priceText} color="green">
          {currency(product.price).format()}
        </Text>
        <Text fontSize="small" color="lighterGray">
          Created {moment(product.createdAt).fromNow()}
        </Text>
      </View>
      <View style={styles.draftActions}>
        <OptionsButton
          data={product}
          image={ELLIPSIS}
          onPress={!loading && handleToggleMenu}
        >
          {selectedProduct && product.id === selectedProduct.id && loading ? (
            <ActivityIndicator color="green" />
          ) : null}
        </OptionsButton>
      </View>
    </ShellButton>
  )

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
    let data
    if (view === 'published') {
      data = userProducts
    } else {
      data = drafts
    }
    const scrollProgress =
      (contentOffset.y + layoutMeasurement.height) / contentSize.height
    if (scrollProgress > 0.85 && !loading) {
      // default page size is 10
      const divisible = data.length / 10
      const isEmpty = data.length == 0
      const hasRemainder = isEmpty || String(divisible).match(/\./)
      const nextPage = divisible + 1
      if (hasRemainder) {
        // no need to get more since
        // the last result came up short
      } else {
        // fetch the next page
        if (view === 'published') {
          setPagePublished(nextPage)
        } else {
          setPageUnpublished(nextPage)
        }
      }
    } else if (contentOffset.y === 0 && !loading) {
      if (view === 'published') {
        setPagePublished(1)
      } else {
        setPageUnpublished(1)
      }
    }
  }

  return (
    <View style={styles.container}>
      <Header bordered avoidMode showBack title="My Listings" />
      <View style={styles.menu}>
        <ShellButton
          style={[styles.menuButton, view === 'published' && styles.menuActive]}
          onPress={() => handleMenuPress('published')}
        >
          <Text fontSize="h6" fontStyle="bold">
            Published
          </Text>
        </ShellButton>
        <ShellButton
          style={[
            styles.menuButton,
            view === 'unpublished' && styles.menuActive,
          ]}
          onPress={() => handleMenuPress('unpublished')}
        >
          <Text fontSize="h6" fontStyle="bold">
            Unpublished
          </Text>
        </ShellButton>
      </View>

      <View style={styles.wrapper}>
        <ScrollView
          scrollerProps={{
            scrollEventThrottle: 500,
            onScroll: handleScroll,
          }}
        >
          <View style={styles.drafts}>
            {(view === 'published' ? userProducts : drafts).map(renderDraft)}
          </View>
        </ScrollView>
      </View>

      {showMenu && (
        <FloatingMenu
          title={selectedProduct?.title}
          menu={getMenuOptions()}
          closeCallBack={handleToggleMenu}
          style={styles.floatingMenu}
        />
      )}
    </View>
  )
}

export default MyListingsScreen
