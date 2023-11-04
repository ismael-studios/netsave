import React, { Component } from 'react'
import { View, Image } from 'react-native'
import * as Animatable from 'react-native-animatable'
import Text from '../Text'
import ScrollView from '../ScrollView'
import ShellButton from '../ShellButton'
import Collapsible from 'react-native-collapsible'
import styles from './styles'
import { SvgUri } from 'react-native-svg'
import { Images, Colors } from '../../common'
import { CategoryType, CallBackFunction } from '../../types'

const { ALL_CATEGORIES, ELLIPSIS, LOCATION_OUTLINE } = Images
const TOP_LIMIT = 3

interface Props {
  categories: CategoryType[]
  category: CategoryType
  onChange: CallBackFunction
}

interface State {
  showAll: boolean
}

export default class Categories extends Component<Props, State> {
  state = {
    showAll: false,
  }

  handleSelect = (category: CategoryType) => {
    const { onChange } = this.props
    const { showAll } = this.state
    if (category.id == 'more') return this.setState({ showAll: !showAll })
    // normal
    this.setState({ showAll: false })
    onChange && onChange(category)
  }

  renderCategory = (cat: CategoryType) => {
    const { id, name, shortName, iconType, icon, iconUrl } = cat
    const { showAll } = this.state
    const { category, categories } = this.props
    const isSelected = category.name === name && category.id === id
    const textStyles = [styles.categoryName]
    const iconWrapStyles = [styles.categoryIconWrap]
    const iconStyles = [styles.categoryIcon]
    const svgStyles = [styles.svgIcon]
    const selectedInMore =
      category.id != 'all' &&
      !categories.slice(0, TOP_LIMIT).find(({ id }) => id === category.id)
    const isMORE = id === 'more'
    if (isSelected || (isMORE && (showAll || selectedInMore))) {
      textStyles.push(styles.categorySelectedText)
      iconWrapStyles.push(styles.IconWrapSelected)
      iconStyles.push(styles.categoryIconSelected)
    }
    return (
      <ShellButton
        key={id}
        data={cat}
        style={[styles.categoryButton, showAll && styles.blockCategory]}
        onPress={this.handleSelect}
      >
        <Animatable.View
          transition={['backgroundColor']}
          style={iconWrapStyles}
        >
          {iconType === 'image' ? (
            <Image source={icon} style={iconStyles} />
          ) : (
            <View style={svgStyles}>
              <SvgUri
                width="100%"
                height="100%"
                uri={iconUrl}
                fill={isSelected ? Colors.white : Colors.green}
              />
            </View>
          )}
        </Animatable.View>
        <Text
          center
          style={textStyles}
          numberOfLines={!showAll ? 2 : 4}
          textBreakStrategy={'simple'}
        >
          {showAll ? name : shortName || name}
        </Text>
      </ShellButton>
    )
  }

  render() {
    const { categories } = this.props
    const { showAll } = this.state
    const scrollerProps = {
      horizontal: !showAll,
      showsHorizontalScrollIndicator: false,
      showsVerticalScrollIndicator: false,
    }
    const allButton: CategoryType = {
      id: 'all',
      name: 'All',
      iconType: 'image',
      icon: ALL_CATEGORIES,
    }
    const localDealsButton: CategoryType = {
      id: 'localDeals',
      name: 'Local Deals',
      iconType: 'image',
      icon: LOCATION_OUTLINE,
    }
    const moreButton: CategoryType = {
      id: 'more',
      name: 'More',
      iconType: 'image',
      icon: ELLIPSIS,
    }
    const lessButton = {
      ...moreButton,
      name: 'Less',
    }
    return (
      <View>
        <ScrollView
          scrollerProps={scrollerProps}
          style={styles.categoriesScroll}
        >
          <Collapsible collapsed={!showAll}>
            <View style={[styles.categories, showAll && styles.allCategories]}>
              {this.renderCategory(localDealsButton)}
              {showAll && categories.map(this.renderCategory)}
              {showAll && (
                <View style={styles.moreCategory}>
                  {this.renderCategory(lessButton)}
                </View>
              )}
            </View>
          </Collapsible>
          <Collapsible collapsed={showAll}>
            <View style={styles.categories}>
              {this.renderCategory(allButton)}
              {this.renderCategory(localDealsButton)}
              {categories.slice(0, TOP_LIMIT).map(this.renderCategory)}
              {this.renderCategory(moreButton)}
            </View>
          </Collapsible>
        </ScrollView>
      </View>
    )
  }
}
