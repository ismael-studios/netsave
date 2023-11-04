import React, { useState } from 'react'
import { View } from 'react-native'
import { Input, ScrollView, ShellButton, Text } from '../../components'
import { useUpdateUserMutation } from '../../store/slice/api/features/user'
import styles from './UserProfileStyles'

interface BioProps {
  description: string
  username: string
  isMine: boolean
  id: string
}

const Bio = ({
  description: initialDescription,
  username,
  isMine,
  id,
}: BioProps) => {
  const [isEditMode, setIsEditMode] = useState(false)
  const [description, setDescription] = useState(initialDescription)

  const [updateUser] = useUpdateUserMutation()

  const handleSave = () => {
    updateUser({
      id,
      description,
    })
    setIsEditMode(false)
  }

  return (
    <ScrollView>
      <View style={styles.aboutView}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text fontSize="standard" fontStyle="bold">
            Bio
          </Text>

          {isMine &&
            (isEditMode ? (
              <ShellButton onPress={handleSave}>
                <Text color="green" fontSize="standard" fontStyle="bold">
                  Save
                </Text>
              </ShellButton>
            ) : (
              <ShellButton onPress={() => setIsEditMode(true)}>
                <Text color="green" fontSize="standard" fontStyle="bold">
                  Edit
                </Text>
              </ShellButton>
            ))}
        </View>

        {isEditMode ? (
          <Input
            multiline
            numberOfLines={4}
            placeholder="Enter a brief description about yourself"
            value={description}
            onChangeText={setDescription}
            autoCapitalize="sentences"
          />
        ) : description ? (
          <Text paragraph fontSize="standard" color="darkGray">
            {description}
          </Text>
        ) : (
          <Text paragraph fontSize="standard" color="darkGray">
            {isMine
              ? 'You have not added a bio.'
              : `${username} hasn't added a bio.`}
          </Text>
        )}
      </View>
    </ScrollView>
  )
}

export default Bio
