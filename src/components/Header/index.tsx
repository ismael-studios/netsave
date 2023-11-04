import React, { useEffect, useState } from 'react'
import { View, Image, BackHandler } from 'react-native'
import { Images, Colors } from '../../common'
import Text from '../Text'
import Input from '../Input'
import ShellButton from '../ShellButton'
import { BackButton, CloseButton } from '../MiscButtons'
import styles from './styles'
import { trim } from 'ramda'
import analytics from '@react-native-firebase/analytics'
import { useNavigation } from '@react-navigation/native'
import { useAppSelector } from '../../store/hooks'
import LinearGradient from 'react-native-linear-gradient'

type searchFunction = (search: string) => void
type emptyFunction = () => void
type boolFunction = () => void

interface HeaderProps {
  title?: string
  style?: object
  onSearch?: searchFunction
  onSearchChangeText?: searchFunction
  onBackPress?: boolFunction
  onClosePress?: emptyFunction
  onRightPress?: emptyFunction
  rightElement?: React.ReactNode
  tight?: boolean
  bordered?: boolean
  showLogo?: boolean
  showBack?: boolean
  avoidMode?: boolean
  showClose?: boolean
  showSearch?: boolean
  rightButton?: string
  progress?: number
}

const Header = ({
  progress = 0,
  avoidMode,
  showLogo,
  bordered,
  showBack,
  showSearch,
  showClose,
  tight,
  title,
  style,
  rightElement,
  rightButton,
  onSearch,
  onSearchChangeText,
  onBackPress,
  onClosePress,
  onRightPress,
}: HeaderProps) => {
  const { showHeader } = useAppSelector((state) => state.app)
  const navigation = useNavigation()
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress)

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress)
    }
  }, [])

  const handleSearch = () => {
    const cleanedSearch = trim(searchText)
    cleanedSearch && onSearch && onSearch(cleanedSearch)
    cleanedSearch &&
      onSearch &&
      analytics().logSearch({
        search_term: cleanedSearch,
      })
  }

  const handleSearchText = (value: string) => {
    setSearchText(value)
    onSearchChangeText && onSearchChangeText(value)
  }

  const handleBackPress = () => {
    if (!onBackPress || (onBackPress && !onBackPress())) {
      navigation.goBack()
    }
    return true
  }

  const handleClosePress = () => {
    if (onClosePress && onClosePress()) {
      navigation.goBack()
    }
  }

  const handleRightPress = () => {
    onRightPress && onRightPress()
  }

  const handleClearSearch = () => {
    setSearchText('')
    onSearch && onSearch('')
    // searchRef.current.focus()
  }

  const renderLeftElement = () => {
    if (showBack) {
      return (
        <BackButton
          float
          rounded
          hitSize={49}
          onPress={handleBackPress}
          style={styles.leftButton}
          color={'textDarkGray'}
        />
      )
    }

    if (showClose) {
      return (
        <CloseButton
          float
          onPress={handleClosePress}
          style={styles.leftButton}
        />
      )
    }
  }

  const renderRightElement = () => {
    return (
      <View style={styles.right}>
        {rightElement}
        {!!rightButton && (
          <ShellButton style={styles.rightButton} onPress={handleRightPress}>
            <Text style={styles.rightButtonText}>{rightButton}</Text>
          </ShellButton>
        )}
      </View>
    )
  }

  const renderTitleSection = () => {
    return title != null ? (
      <View style={styles.baseContainer}>
        {/* LEFT ELEMENT*/}
        {renderLeftElement()}
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
        {/* RIGHT ELEMENT*/}
        {renderRightElement()}
      </View>
    ) : null
  }

  const renderLogo = () => {
    return (
      showLogo && (
        <View style={styles.logoContainer}>
          {/* LEFT ELEMENT*/}
          {renderLeftElement()}
          <Image source={Images.LOGO} style={styles.logo} />
          {/* RIGHT ELEMENT*/}
          {renderRightElement()}
        </View>
      )
    )
  }

  const renderSearch = () => {
    const isEmpty = searchText === ''
    return showSearch ? (
      <View style={styles.searchBase}>
        <View style={styles.searchContainer}>
          <Input
            // ref={searchRef}
            value={searchText}
            returnKeyType="search"
            onChangeText={handleSearchText}
            placeholder="Search Netsave"
            style={styles.searchInput}
            inputStyle={styles.searchInputText}
            placeholderTextColor={Colors.green}
            onSubmitEditing={handleSearch}
          />
          <ShellButton
            style={styles.clearSearchButton}
            hitSize={7}
            onPress={handleClearSearch}
          >
            <Image source={Images.CLOSE_X} style={styles.clearSearchIcon} />
          </ShellButton>
          <ShellButton
            style={styles.searchButton}
            noninteractive={isEmpty}
            onPress={handleSearch}
          >
            <Image source={Images.MAGNIFYING_GLASS} style={styles.searchIcon} />
          </ShellButton>
        </View>
      </View>
    ) : null
  }

  const renderProgress = () =>
    progress ? (
      <LinearGradient
        useAngle
        angle={45}
        colors={['#367cc4', '#367cc4', '#408d8e', '#408d8e', '#4ca450']}
        style={[styles.progressBar, { width: `${progress * 110}%` }]}
      />
    ) : null

  const headerStyles = [
    styles.container,
    tight && styles.tight,
    bordered && styles.bordered,
    !showLogo && !title && styles.topPadded,
    avoidMode && styles.avoidMode,
    style,
  ]
  return showHeader ? (
    <View style={headerStyles}>
      {renderLogo()}
      {renderSearch()}
      {renderTitleSection()}
      {renderProgress()}
    </View>
  ) : null
}

export default Header
