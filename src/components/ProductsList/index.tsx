import React, { useState } from 'react'
import { View, ActivityIndicator, FlatList } from 'react-native'
import Text from '../Text'
import Loading from '../Loading'
import ErrorBoundary from '../ErrorBoundary'
import NoProductsDisplay from './NoProductsDisplay'
import EmptyContent from '../EmptyContent'
import { Colors, Images } from '../../common'
import styles from './styles'
import Product from './Product'
import Categories from './Categories'
import LocationSelector from './LocationSelector'
import Collapsible from 'react-native-collapsible'
import { useNavigation } from '@react-navigation/native'
import { useAppDispatch } from '../../store/hooks'
import { CategoryType, ProductType } from '../../types'
import { resetProducts } from '../../store/slice/productsSlice'

const { MAP_POINT } = Images

interface ProductsListProps {}

const ProductsList = ({
  categories,
  category,
  query,
  city,
  postalCode,
  filters = {},
  radius,
  location,
  loading,
  fetchingAllProducts,
  showPostLoader,
  postEmpty,
  hidePreloader,
  noProductsText,
  title,
  products,
  onScroll,
  showCategories,
  showLocation,
  onChangeMode,
  requestLocation,
  hideNoProductsText,
  HeaderComponent,
  onChangeCategory,
}: ProductsListProps): JSX.Element => {
  const navigation = useNavigation()
  const dispatch = useAppDispatch()
  const [collapseTop, setCollapseTop] = useState(false)

  const handleSetCategory = (value: CategoryType) => {
    onChangeCategory && onChangeCategory(value)
  }

  const handleOnProductPress = (product: ProductType) => {
    navigation.navigate('ProductDetails', {
      product,
      userId: product.userId,
      productId: product.id,
    })
  }

  const handleCrashError = () => {
    dispatch(resetProducts())
  }

  const handleScroll = (event) => {
    const {
      nativeEvent: {
        contentOffset: { y },
      },
    } = event
    const value = y > 100
    if (value !== collapseTop) {
      setCollapseTop(collapseTop)
    }
    onScroll && onScroll(event)
  }

  const handleScrollToTop = () => {
    setCollapseTop(false)
    handleScroll({ nativeEvent: { contentOffset: { y: 0 } } })
  }

  const renderProduct = ({ item: product, index }) => (
    <Product key={index} product={product} onPress={handleOnProductPress} />
  )

  const productVerb = radius ? `within ${radius} miles of` : 'in'
  const hasNoProducts = products.length == 0
  const emptyProductsStyle = { paddingLeft: 0, paddingBottom: 0 }
  const postLoading = loading && products.length >= 10
  const notDefaultCategory =
    category && category.name != 'All' ? category.name : ''
  const isLocal = filters.mode === 'local'
  return (
    <ErrorBoundary onError={handleCrashError}>
      <View style={styles.container}>
        <Collapsible
          collapsed={collapseTop}
          style={[styles.autoCollapseSection]}
        >
          {showCategories && (
            <Categories
              categories={categories}
              category={category}
              onChange={handleSetCategory}
            />
          )}
          {title && (
            <View style={styles.titleSection}>
              <Text
                fontStyle="semiBold"
                fontSize="small"
                color={Colors.darkGray}
              >
                {title}
              </Text>
            </View>
          )}
          {showLocation && (
            <LocationSelector
              city={city}
              location={location}
              radius={radius}
              postalCode={postalCode}
              filters={filters}
              onChangeMode={onChangeMode}
              requestLocation={requestLocation}
            />
          )}
          {HeaderComponent}
        </Collapsible>
        <Collapsible collapsed={!hasNoProducts}>
          <Loading
            minHeight={30}
            show={!hidePreloader}
            style={styles.preLoader}
          />
        </Collapsible>
        <View style={[styles.products, hasNoProducts && emptyProductsStyle]}>
          <Loading show={loading && hasNoProducts}>
            <View style={styles.list}>
              {!hasNoProducts && (
                <FlatList
                  style={styles.flatlist}
                  data={products}
                  numColumns={2}
                  initialNumToRender={8}
                  renderItem={renderProduct}
                  keyExtractor={({ id }) => id}
                  // scrollEventThrottle={100}
                  onScroll={handleScroll}
                  // onScrollToTop={this.handleScrollToTop}
                  showsVerticalScrollIndicator={false}
                  ListFooterComponent={View}
                  ListFooterComponentStyle={{ height: 10 }}
                />
              )}
            </View>
            {hasNoProducts && postEmpty && !loading && (
              <View key="post" style={styles.newPostContainer}>
                {fetchingAllProducts ? (
                  <ActivityIndicator color={Colors.orange} />
                ) : (
                  <NoProductsDisplay />
                )}
              </View>
            )}
            {hasNoProducts && !postEmpty && !hideNoProductsText && (
              <EmptyContent
                color="lightGray"
                show={!loading && hasNoProducts}
                message={
                  noProductsText ||
                  `No Products available${
                    city ? `\n${productVerb} ${city}` : ''
                  }`
                }
              />
            )}
            {/*isLocal && (
                <ShellButton
                  data='nation'
                  style={styles.switchMode}
                  onPress={onChangeMode}>
                  <View style={styles.row}>
                    <Text fontSize='standard'>
                      Don't see enough items locally?
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text fontSize='standard'>Try shopping</Text>
                    <Image
                      source={MAP_POINT}
                      style={[styles.mapPoint, styles.smallPoint]}
                    />
                    <Text fontSize='standard' color='green' fontStyle='bold'>
                      Nationwide
                    </Text>
                  </View>
                </ShellButton>
              )*/}
          </Loading>
        </View>
        {showPostLoader ? (
          <Loading
            minHeight={20}
            show={postLoading}
            style={styles.postLoader}
          />
        ) : null}
      </View>
    </ErrorBoundary>
  )
}

export { Product, Categories, LocationSelector }
export default ProductsList
