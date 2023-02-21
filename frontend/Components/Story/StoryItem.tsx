import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { STORY } from '../../Store/Reducers/StoryReducer'
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch } from 'react-redux'
import { AntDesign } from '@expo/vector-icons'

const StoryItem = ({story, index, navigation}: {story: STORY, index: number, navigation: any}) => {
    const tw = useTailwind()
    const dispatch = useDispatch()

    const navigateToStoryScreen = () => {
        navigation.navigate("StoryScreen", {storyIndex: index})
    }

  return (
    <TouchableOpacity onPress={navigateToStoryScreen}  style={tw(' mr-2 items-center justify-center')} >
        <Image style={[tw('w-14 h-14 rounded-full bg-white -z-10 '), {resizeMode: 'contain'}]} source={story?.owner?.avatarUrl ? {uri: story?.owner?.avatarUrl}: require("../../assets/download.png")}></Image>
       <Text  style={tw('text-xs')}>{story?.owner?.username}</Text>
    </TouchableOpacity>
  )
}

export default StoryItem

const styles = StyleSheet.create({})