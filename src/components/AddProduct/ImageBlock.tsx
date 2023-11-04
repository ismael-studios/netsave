import React, { Component } from 'react'
import { Image, ActivityIndicator, PanResponder, View } from 'react-native'
import styles, {
  IMAGE_WIDTH,
  IMAGE_HEIGHT,
  IMAGES_WIDTH,
} from './ImageBlockStyles'
import { OptionsButton } from '../../components'
import { Colors, Metrics, Images } from '../../common'
import Text from '../Text'
const { CLOSE_X, EXCLAMATION } = Images

export default class ImageBlock extends Component {
  state = {
    offsetX: 0,
    offsetY: 0,
    xIndex: null,
    yIndex: null,
  }

  calculateMove = ({ dx, dy }) => {
    const { index } = this.props
    const multiple = 4
    const indexDivisible = index / multiple
    const verticalIndex = Math.floor(indexDivisible)
    const subtractIndex = verticalIndex * multiple
    const horizontalIndex = index - verticalIndex * multiple
    const offsetX =
      dx +
      horizontalIndex * IMAGE_WIDTH +
      Metrics.doubleBaseMargin +
      horizontalIndex * Metrics.baseMargin
    const offsetY =
      dy + verticalIndex * IMAGE_HEIGHT + verticalIndex * Metrics.baseMargin
    const trueX = offsetX - Metrics.baseMargin // 0
    const trueY = offsetY + Metrics.doubleBaseMargin // 0
    const xIndex = trueX < 0 ? 0 : Math.floor(trueX / IMAGE_WIDTH)
    const yIndex = trueY < 0 ? 0 : Math.floor(trueY / IMAGE_HEIGHT)
    const blockIndex = xIndex + yIndex * multiple
    return { offsetX, offsetY, xIndex, yIndex, blockIndex }
  }

  _panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderRelease: (event, dragInfo) => {
      const { onMove, image } = this.props
      const { blockIndex } = this.calculateMove(dragInfo)
      this.setState({ offsetY: 0, offsetX: 0, xIndex: null, yIndex: null })
      onMove && onMove(image, blockIndex)
      this.blockIndex = null
    },
    onPanResponderStart: (event, gesture) => {
      const { onDrag } = this.props
      onDrag && onDrag(event, gesture)
    },
    onPanResponderMove: (event, dragInfo) => {
      const { onMoveIntent, index } = this.props
      const { offsetX, offsetY, blockIndex } = this.calculateMove(dragInfo)
      if (this.blockIndex !== blockIndex) {
        this.blockIndex = blockIndex
        onMoveIntent && onMoveIntent(blockIndex, index)
      }
      this.setState({
        offsetX,
        offsetY,
      })
    },
  })

  render() {
    const { image, index, isDeleting, onDelete, appLoading } = this.props
    const { offsetX, offsetY, xIndex, yIndex } = this.state
    const { path, url, localIdentifier, id } = image
    const isProcessing = !id || isDeleting
    const isDragging = offsetX + offsetY
    const offsetStyle = {
      position: 'absolute',
      left: offsetX,
      top: offsetY,
      zIndex: 9,
    }
    const isRisky = isDragging && appLoading
    return (
      <View
        key={`${id}${index}`}
        style={[styles.imageContainer, isDragging && offsetStyle]}
      >
        <OptionsButton
          floatRight
          shadowed
          image={isRisky ? EXCLAMATION : CLOSE_X}
          data={{ ...image, index }}
          style={styles.closeButton}
          iconStyle={[styles.closeIcon, isRisky && { tintColor: Colors.red }]}
          noninteractive={isProcessing}
          onPress={onDelete}
        >
          {isRisky
            ? null
            : isProcessing && <ActivityIndicator color={Colors.green} />}
        </OptionsButton>
        <View style={styles.imageWrapper} {...this._panResponder.panHandlers}>
          <Image source={{ uri: path || url }} style={styles.image} />
        </View>
      </View>
    )
  }
}
