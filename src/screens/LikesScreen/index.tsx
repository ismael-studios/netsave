import React, { useState } from 'react'
import { View } from 'react-native'
import { ProductsList, Header } from '../../components'
import styles from './styles'
import { useGetProductLikesQuery } from '../../store/slice/api/features/user'
import { useAppSelector } from '../../store/hooks'

const LikesScreen = () => {
  const { user } = useAppSelector((state) => state.session)
  const [page, setPage] = useState(1)
  const { data: likes = [], isLoading } = useGetProductLikesQuery({
    userId: user.id,
    page,
  })

  const handleScroll = (event) => {
    const {
      nativeEvent: {
        contentOffset = { y: 0 }, //: {x, y},
        contentSize = { height: 0 }, //: {height, width},
        layoutMeasurement = { height: 0 }, //: {height, width},
      },
    } = event
    const scrollProgress =
      (contentOffset.y + layoutMeasurement.height) / contentSize.height
    if (scrollProgress > 0.85 && !isLoading) {
      // default page size is 10
      const divisible = likes.length / 10
      const isEmpty = likes.length == 0
      const hasRemainder = isEmpty || String(divisible).match(/\./)
      const nextPage = divisible + 1
      if (hasRemainder) {
        // no need to get more since
        // the last result came up short
      } else {
        // fetch the next page
        setPage(nextPage)
      }
    }
  }

  const likedProducts = likes.map(({ product }) => product)
  return (
    <View style={styles.container}>
      <Header avoidMode bordered title="Likes" />
      <View style={styles.list}>
        <ProductsList
          hidePreloader
          city={'Likes'}
          loading={isLoading}
          products={likedProducts}
          onScroll={handleScroll}
          noProductsText={'You have not liked any products.'}
        />
      </View>
    </View>
  )
}

export default LikesScreen
