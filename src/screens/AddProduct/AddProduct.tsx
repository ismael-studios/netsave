import React, { useEffect, useRef, useState } from 'react'
import {
  Image,
  KeyboardAvoidingView,
  ScrollView as RNScrollView,
  View,
} from 'react-native'
import styles from './Styles'
import {
  Text,
  Button,
  ModalBox,
  ImageBlock,
  ScrollView,
  ShellButton,
  FloatingMenu,
  ProgressSteps,
  HintButton,
  ShowAlert,
  Header,
  Input,
} from '../../components'
import ImagePicker, {
  Image as ImagePickerImage,
} from 'react-native-image-crop-picker'
import { requestPhotoAccessPermission } from '../../helpers/PermissionsHelper'
import { Images, Colors, Metrics } from '../../common'
import RNPickerSelect from 'react-native-picker-select'
import { trim, clone } from 'ramda'
import { openLimitedPhotoLibraryPicker } from 'react-native-permissions'
import { ProductCondition, ProductImage } from '../../types'
import { useGetCategoriesQuery } from '../../store/slice/api/features/category'
import { useAppSelector } from '../../store/hooks'
import {
  useDeleteProductImageMutation,
  useGetProductConditionsQuery,
  useGetProductDetailsQuery,
  usePostProductMutation,
  useUpdateProductMutation,
  useUploadProductImagesMutation,
} from '../../store/slice/api/features/product'
import { PostListingStackScreenProps } from '../../navigation/types'
import { skipToken } from '@reduxjs/toolkit/dist/query'

const IMAGE_LIMIT = 12
const WORD_LIMIT = 10
const { CARET_DOWN, PHOTO_CAMERA, PHOTOS } = Images
const { ifIOS } = Metrics

const AddProduct = ({
  navigation,
  route,
}: PostListingStackScreenProps<'AddProduct'>) => {
  const { data: categories = [] } = useGetCategoriesQuery()
  const { data: conditions = [] } = useGetProductConditionsQuery()
  const { user } = useAppSelector((state) => state.session)
  const { loading: appLoading } = useAppSelector((state) => state.app)
  const {
    categoryId: routeCategoryId,
    isEditMode,
    productId: routeProductId,
  } = route.params
  const scrollerRef = useRef<RNScrollView>(null)
  const hintModalRef = useRef()
  const [productId, setProductId] = useState('')
  const [images, setImages] = useState<(ProductImage | { path: string })[]>([])
  const [categoryId, setCategoryId] = useState(routeCategoryId)
  const [title, setTitle] = useState('')
  const [productConditionId, setProductConditionId] = useState(1)
  const [description, setDescription] = useState('')
  const [isPublished, setIsPublished] = useState(false)

  const [showAddImageOptions, setShowAddImageOptions] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [intentIndex, setIntentIndex] = useState(null)
  const [draggingIndex, setDraggingIndex] = useState(null)
  const [deleting, setDeleting] = useState<string[]>([])
  const [changes, setChanges] = useState(false)

  const [postProduct] = usePostProductMutation()
  const [updateProduct] = useUpdateProductMutation()
  const [
    uploadProductImages,
    { isError: isUploadProductImagesError, error: uploadProductImagesError },
  ] = useUploadProductImagesMutation()
  const { data: product } = useGetProductDetailsQuery(
    user && productId ? { userId: user.id, productId } : skipToken
  )
  const [deleteProductImage] = useDeleteProductImageMutation()

  useEffect(() => {
    if (routeProductId) {
      setProductId(routeProductId)
    }
  }, [routeProductId])

  useEffect(() => {
    if (product) {
      setTitle(product.title || '')
      setProductConditionId(product.productConditionId || 1)
      setDescription(product.description || '')
      if (product.images && product.images.length) {
        setImages(product.images)
      }
    }
  }, [product])

  useEffect(() => {
    if (isUploadProductImagesError) {
      console.log('ADDING IMAGE ERROR', uploadProductImagesError)
      const {
        response: {
          data: {
            message = 'There was a problem uploading your image. Try again.',
          } = {},
        } = {},
      } = uploadProductImagesError
      ShowAlert({
        message,
      })
    }
  }, [isUploadProductImagesError, uploadProductImagesError])

  const handleShowConditionHint = () => {
    hintModalRef.current?.show()
  }

  const handleToggleImageOptions = () => {
    setShowAddImageOptions(!showAddImageOptions)
  }

  const handleOnDrag = () => {
    setIsDragging(true)
  }

  const handleUploadedImage = (image: {
    id: string
    order: number
    path: string
  }) => {
    console.log('UPLOADED', image)
    const newImageUploaded = clone(images)
    newImageUploaded[image.order] = image
    setImages(newImageUploaded)
  }

  const handleUserAddImage = ({ type }) => {
    if (!user) {
      return
    }
    const isFromCamera = type === 'openCamera'
    const isFromPicker = type === 'openPicker'
    const showImagePicker = async () => {
      let result: ImagePickerImage[] = []
      try {
        if (isFromCamera) {
          result = await ImagePicker.openCamera({
            compressImageMaxHeight: 800,
            compressImageMaxWidth: 800,
            compressImageQuality: 0.8,
            cameraType: 'back',
            mediaType: 'photo',
            multiple: true,
            maxFiles: IMAGE_LIMIT - images.length,
          })
        }
        if (isFromPicker) {
          result = await ImagePicker.openPicker({
            compressImageMaxHeight: 800,
            compressImageMaxWidth: 800,
            compressImageQuality: 0.8,
            cameraType: 'back',
            mediaType: 'photo',
            multiple: true,
            maxFiles: IMAGE_LIMIT - images.length,
          })
        }
      } catch (err) {
        console.log('ERROR!', err)
        if (err.message.match('permission')) {
          ShowAlert({
            message: `There was a permission error: \n${err.message}`,
          })
        }
        return
      }
      console.log(result)
      const selectedImages = result
        .slice(0, IMAGE_LIMIT - images.length)
        .map((image) => ({
          path: image.path,
        }))
      setImages([...images, ...selectedImages])
      if (productId) {
        uploadProductImages({
          productId,
          images: selectedImages,
          offset: images.length,
          progressCallback: handleUploadedImage,
        })
      } else {
        const postedProduct = await postProduct({
          userId: user.id,
          product: { categoryId },
        }).unwrap()
        setProductId(postedProduct.id)
        uploadProductImages({
          productId: postedProduct.id,
          images: selectedImages,
          offset: images.length,
          progressCallback: handleUploadedImage,
        })
      }
    }
    if (isFromCamera) {
      requestPhotoAccessPermission((success) => {
        success ? showImagePicker() : null
      })
    } else {
      // photo library
      openLimitedPhotoLibraryPicker().catch(() => {
        console.log('Cannot open photo library picker')
        showImagePicker()
      })
    }
  }

  const parseImagesOrder = (images) =>
    images
      .filter(({ id }) => id)
      .map(({ id }, order) => ({
        id,
        order,
      }))

  const handleChangeProductCondition = (value: number) => {
    const label = conditions.find((condition) => condition.id === value)?.name
    if (label && label.match(/poor/i)) {
      ShowAlert({
        title: 'Stop!',
        message:
          'Sorry! This item is ineligible to be listed on Netsave. Please consider another product in fair or better condition',
        actions: [
          {
            name: 'Got it',
            positive: true,
          },
        ],
      })
    } else {
      setProductConditionId(value)
    }
  }

  // const handleSelectCategory = () => {
  //   navigation.navigate('ChooseCategory', {
  //     currentProduct: { ...this.state },
  //   })
  // }

  const handleContinue = async ({ redirectCallback }) => {
    if (!user) {
      return
    }
    const body = {
      id: productId,
      title: trim(title),
      description: trim(description),
      images: parseImagesOrder(images),
      categoryId,
      isPublished,
      productConditionId,
    }

    try {
      const updatedProduct = await updateProduct({
        userId: user.id,
        product: body,
      }).unwrap()

      if (!redirectCallback) {
        navigation.navigate('AddProductPricing', {
          isEditMode,
          product: { ...updatedProduct, images },
        })
      } else {
        redirectCallback(updatedProduct)
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const handleSaveAsDraft = () => {
    handleContinue({
      redirectCallback: handleLeaveScreen,
    })
  }

  const handleNext = () => {
    handleContinue({
      redirectCallback: false,
    })
  }

  const handleDeleteImage = ({
    id: imageId,
    index,
  }: {
    id: string
    index: number
  }) => {
    if (!user) {
      return
    }
    ShowAlert({
      title: 'Delete Image',
      message: 'Are you sure?',
      actions: [
        {
          name: 'Yes, Delete',
          positive: true,
          callback: async () => {
            setDeleting([...deleting, imageId])
            try {
              await deleteProductImage({
                userId: user.id,
                productId,
                imageId,
              }).unwrap()
              const newImages = clone(images)
              const newDeleting = deleting.filter((id) => id != imageId)

              newImages.splice(index, 1)
              setImages(newImages)
              setDeleting(newDeleting)
              setDraggingIndex(null)
              setIntentIndex(null)
            } catch (error) {
              console.log('REMOVE IMAGE ERROR', error)
              const restoredDeleting = deleting.splice(0, deleting.length - 1)

              setDeleting(restoredDeleting)
              setDraggingIndex(null)
              setIntentIndex(null)
              const {
                response: {
                  data: {
                    message = 'There was a problem removing your image. Try again.',
                  } = {},
                } = {},
              } = error
              ShowAlert({
                message,
              })
            }
          },
        },
        {
          name: 'Cancel',
        },
      ],
    })
  }

  const handleReorderImage = (image, toIndex) => {
    if (draggingIndex !== intentIndex) {
      let newImages = clone(images)
      const insertImage = clone(image)
      newImages.splice(draggingIndex, 1)
      newImages.splice(toIndex, 0, insertImage)
      setImages(newImages)
      setChanges(true)
    }
    setIntentIndex(null)
    setDraggingIndex(null)
    setIsDragging(false)
  }

  const handleReorderIntent = (index, dragIndex) => {
    const maxIndex = images.length - 1
    setDraggingIndex(dragIndex)
    setIntentIndex(index > maxIndex ? maxIndex : index)
  }

  const handlePressBack = () => {
    if (changes) {
      ShowAlert({
        title: 'Save your listing details\nbefore leaving?',
        message:
          'Your listing details are currently unsaved. Save it as draft so you can come back to it later.',
        actions: [
          {
            block: true,
            positive: true,
            name: isPublished ? 'Save Changes' : 'Save Draft',
            callback: () =>
              handleContinue({
                redirectCallback: handleLeaveScreen,
              }),
          },
          {
            block: true,
            name: 'Leave Without Saving',
            callback: handleLeaveScreen,
          },
        ],
      })
      return true
    }
  }

  const handleLeaveScreen = () => {
    navigation.navigate('Drafts')
  }
  const handleFocusDescription = () => {
    setTimeout(() => scrollerRef.current?.scrollToEnd(), 400)
  }

  const renderLabel = (
    label: string,
    label2: string,
    okay: boolean,
    color = 'green'
  ) => {
    return (
      <Text>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.label} color={okay ? color : 'orange'}>
          {label2}
        </Text>
      </Text>
    )
  }

  const renderConditionTag = ({
    name,
    description,
    color,
  }: ProductCondition) => {
    // const nameSplit = name.split(/[^A-Za-z]/)
    // const shortName = trim(nameSplit[nameSplit.length - 1])
    return (
      <View key={name} style={styles.hintTag}>
        <View style={styles.nameColumn}>
          <View style={[styles.tagName, { backgroundColor: `${color}40` }]}>
            <Text style={[styles.nameText, { color }]}>{name}</Text>
          </View>
        </View>
        <View style={styles.descriptionColumn}>
          <View style={styles.tagDescription}>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>
        </View>
      </View>
    )
  }

  const renderImage = (image: ProductImage, index: number) => {
    const { id: imageId } = image
    const isDeleting = deleting.includes(imageId)
    const hasIntent = intentIndex === index
    const isLess = draggingIndex <= index
    const isRisky = isDeleting || appLoading || !imageId
    const intentIndicator = (
      <View
        key={`moveIntent`}
        style={[
          styles.imageIntent,
          isRisky && {
            borderColor: Colors.red,
            backgroundColor: `${Colors.red}50`,
          },
        ]}
      />
    )
    const renderOut = [
      <ImageBlock
        key={`${imageId}${index}`}
        onDelete={handleDeleteImage}
        onMove={handleReorderImage}
        onDrag={handleOnDrag}
        onMoveIntent={handleReorderIntent}
        appLoading={appLoading}
        image={image}
        index={index}
        isDeleting={isDeleting}
      />,
    ]
    if (hasIntent) {
      isLess
        ? renderOut.push(intentIndicator)
        : renderOut.unshift(intentIndicator)
    }
    return renderOut
  }

  const ConditionText = conditions.find(
    (condition) => condition.id === productConditionId
  )?.name
  const CategoryText = categories.find(
    (category) => category.id === categoryId
  )?.name
  const wordCount = String(description || '').length
  const wordCountOverLimit = wordCount >= WORD_LIMIT
  const wordCountText = wordCountOverLimit ? '' : ` ${WORD_LIMIT - wordCount}`
  const photoCount = images.length > IMAGE_LIMIT ? IMAGE_LIMIT : images.length
  const hasPhotos = photoCount > 0
  const canSend =
    productId &&
    title &&
    trim(title) &&
    productConditionId &&
    description &&
    trim(description) &&
    wordCountOverLimit &&
    hasPhotos

  return (
    <KeyboardAvoidingView
      style={styles.avoidView}
      behavior={ifIOS('padding', 'height')}
    >
      <View style={styles.container}>
        <Header
          bordered
          showBack
          avoidMode
          onBackPress={handlePressBack}
          title={`${isEditMode ? 'Edit' : 'Add'} Listing Details`}
          style={styles.header}
        />
        <View style={styles.container}>
          <ScrollView
            scrollerProps={{
              scrollEnabled: !isDragging,
            }}
            ref={scrollerRef}
            hideScroller={false}
          >
            <View style={styles.topSpacer}>
              <View style={styles.subWrapper}>
                <Text style={styles.spacedLabel}>
                  {renderLabel('Photos', '*', hasPhotos)}
                </Text>
              </View>
              <View style={styles.images}>
                {images.map(renderImage)}
                {photoCount < IMAGE_LIMIT && (
                  <ShellButton
                    key="new"
                    style={styles.addButton}
                    onPress={handleToggleImageOptions}
                  >
                    <Image
                      source={Images.PLUS_SLIM}
                      style={styles.addButtonPlus}
                    />
                  </ShellButton>
                )}
                <View style={styles.instructions}>
                  <Text fontSize="standard">
                    Photos{' '}
                    <Text fontSize="standard">
                      {photoCount}/{IMAGE_LIMIT}
                    </Text>
                    {' - '}
                    {photoCount ? (
                      'Add '
                    ) : (
                      <Text>
                        <Text fontSize="standard" color="orange">
                          Add at least 1
                        </Text>
                        <Text fontSize="standard">{' and '}</Text>
                      </Text>
                    )}
                    up to {IMAGE_LIMIT} photos.{'\n'}Drag and drop to change
                    orders.
                  </Text>
                </View>
              </View>
              <View style={styles.subWrapper}>
                <View style={styles.scrollWrap}>
                  <View>
                    <View style={styles.formRow}>
                      <Input
                        wideFocus={false}
                        style={[styles.input]}
                        label={renderLabel('Title', '*', title, 'green')}
                        placeholder="Title"
                        value={title}
                        onChangeText={setTitle}
                      />
                    </View>
                    <View style={styles.formRow}>
                      <RNPickerSelect
                        placeholder={{
                          label: 'Select a Category',
                          value: '',
                        }}
                        value={categoryId}
                        onValueChange={setCategoryId}
                        items={categories.map((category) => ({
                          label: category.name,
                          value: category.id,
                        }))}
                      >
                        <Input
                          disabled
                          wideFocus={false}
                          style={styles.input}
                          label={renderLabel('Category', '*', !!categoryId)}
                          placeholder="Select a Category"
                          value={CategoryText}
                        />
                      </RNPickerSelect>
                      <View style={styles.arrowDown} pointerEvents={'none'}>
                        <Image source={CARET_DOWN} style={styles.arrowImage} />
                      </View>
                    </View>
                    <View style={styles.conditionContainer}>
                      <View style={styles.conditionHint}>
                        <HintButton
                          hitSize={10}
                          onPress={handleShowConditionHint}
                        />
                      </View>
                      <RNPickerSelect
                        placeholder={{
                          label: 'Select a Condition',
                          value: '',
                        }}
                        value={productConditionId}
                        onValueChange={handleChangeProductCondition}
                        items={conditions.map((condition) => ({
                          label: condition.name,
                          value: condition.id,
                        }))}
                      >
                        <Input
                          disabled
                          wideFocus={false}
                          style={styles.input}
                          label={renderLabel(
                            'Condition',
                            '*',
                            !!productConditionId
                          )}
                          placeholder="New or Used"
                          value={ConditionText}
                        />
                      </RNPickerSelect>
                      <View style={styles.arrowDown} pointerEvents={'none'}>
                        <Image source={CARET_DOWN} style={styles.arrowImage} />
                      </View>
                    </View>
                    <View style={styles.formRow}>
                      <Input
                        multiline
                        wideFocus={false}
                        numberOfLines={5}
                        style={[
                          styles.input,
                          !wordCountOverLimit && styles.noBase,
                        ]}
                        label={renderLabel(
                          'Description',
                          '*',
                          wordCountOverLimit,
                          'green'
                        )}
                        placeholder={'Details'}
                        value={description}
                        onFocus={handleFocusDescription}
                        onChangeText={setDescription}
                      />
                      {!wordCountOverLimit && (
                        <Text
                          fontSize="small"
                          color="orange"
                          style={styles.inputNote}
                        >
                          Add at least{wordCountText} characters
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        <ProgressSteps current={1} total={4} />
        <View style={styles.actionsRow}>
          <Button
            tight
            outlined
            style={styles.draftButton}
            disabled={!changes || !canSend}
            loading={appLoading}
            onPress={handleSaveAsDraft}
          >
            {isEditMode ? 'Save & Exit' : 'Save Draft'}
          </Button>
          <Button
            tight
            style={styles.nextButton}
            disabled={!canSend}
            loading={appLoading}
            onPress={handleNext}
          >
            Next
          </Button>
        </View>
        <ModalBox ref={hintModalRef} title={'Condition'}>
          <Text style={styles.hintTitle}>
            A condition tag will be displayed on your product listing based on
            your selection.
          </Text>
          <View style={styles.hintList}>
            <ScrollView scrollerProps={{ style: styles.hintScroll }}>
              <View style={styles.tags}>
                {conditions.map(renderConditionTag)}
              </View>
            </ScrollView>
          </View>
        </ModalBox>
        {showAddImageOptions && (
          <FloatingMenu
            title="Upload A Photo"
            menu={[
              {
                name: 'Choose From Photo Album',
                icon: PHOTOS,
                callback: handleUserAddImage,
                type: 'openPicker',
              },
              {
                name: 'Capture New Image',
                icon: PHOTO_CAMERA,
                callback: handleUserAddImage,
                type: 'openCamera',
              },
            ]}
            closeCallBack={handleToggleImageOptions}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  )
}

export default AddProduct
