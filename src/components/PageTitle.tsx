import React from 'react'
import { View, ViewProps, ViewStyle } from 'react-native'
import Text from './Text'
import styles from './PageTitleStyle'

export interface Props extends ViewProps {
  style?: ViewStyle | ViewStyle[]
  title: string
  summary?: string
}

const PageTitle: React.FC<Props> = (props) => {
  const { title, summary, style }: Props = props
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {summary ? <Text style={styles.summary}>{summary}</Text> : null}
    </View>
  )
}

export default PageTitle
