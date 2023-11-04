import React from 'react'
import { SvgUri } from 'react-native-svg'
import { View } from 'react-native'
import { Colors } from '../../common'
import {
  Text,
  Header,
  Loading,
  ScrollView,
  ShellButton,
  SafeAreaView,
} from '../../components'
import styles from './Styles'
import { CategoryType } from '../../types'
import { useGetCategoriesQuery } from '../../store/slice/api/features/category'
import { PostListingStackScreenProps } from '../../navigation/types'

const ChooseCategory = ({
  navigation,
}: PostListingStackScreenProps<'ChooseCategory'>) => {
  const { data: categories = [], isLoading } = useGetCategoriesQuery()

  const handleCategory = (categoryId: number) => {
    navigation.navigate('AddProduct', {
      categoryId,
      isEditMode: false,
    })
  }

  const renderCategory = (category: CategoryType) => {
    const { id, name, iconUrl } = category
    const iconWrapStyles = [styles.categoryIconWrap]
    // const iconStyles = [styles.categoryIcon]
    return (
      <ShellButton
        key={id}
        data={id}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 6,
        }}
        onPress={handleCategory}
      >
        <View style={iconWrapStyles}>
          <SvgUri width="50%" height="50%" uri={iconUrl} fill={Colors.green} />
        </View>
        <Text color="green" style={{ marginLeft: 16 }}>
          {name}
        </Text>
      </ShellButton>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header showBack title="Sell an item on Netsave" style={styles.header} />
      <View style={styles.titleHead}>
        <Text fontSize="h3" fontStyle="bold">
          Choose a category
        </Text>
      </View>
      <ScrollView>
        <View style={styles.subContainer}>
          <Loading show={isLoading && categories.length == 0}>
            <View>{categories.map(renderCategory)}</View>
          </Loading>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ChooseCategory
