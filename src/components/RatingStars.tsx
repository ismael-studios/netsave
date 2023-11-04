import React, { Component } from 'react'
import { Image, View, TouchableOpacity } from 'react-native'
import Text from './Text'
import styles from './RatingStarsStyles'
import { Images } from '../common'

const { STAR_OUTLINE, STAR_SOLID } = Images

export default class RatingStars extends Component {
  renderStars(empty) {
    const { score = 5, base = 5, size } = this.props
    const stars = []
    const sizeStyle = size
      ? { width: size, height: size, marginRight: size / 2 }
      : {}

    for (i = 0; i < (empty ? base : Math.round(score)); i++) {
      stars.push(
        <Image
          key={i}
          source={empty ? STAR_OUTLINE : STAR_SOLID}
          style={[styles.star, empty ? styles.empty : styles.solid, sizeStyle]}
        />
      )
    }
    return stars
  }
  render() {
    const { style } = this.props
    return (
      <View style={[styles.container, style]}>
        <View style={[styles.stars, styles.outlineStars]}>
          {this.renderStars(true)}
        </View>
        <View style={[styles.stars, styles.solidStars]}>
          {this.renderStars(false)}
        </View>
      </View>
    )
  }
}
