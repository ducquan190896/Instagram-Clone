import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../Store/Store'

import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../Navigators/MainStack'

const StoryAdderItem = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const tw = useTailwind()
    const dispatch = useDispatch()
    const {user, userSuccess, userError} = useSelector((state: RootState) => state.USERS)

    const navigateToStoryCreateForm = () => {
        // navigation.navigate("StoryCreateForm")
    }

  return (
    <TouchableOpacity onPress={navigateToStoryCreateForm} activeOpacity={0.5} style={tw(' mr-2 items-center justify-center')} >
      <View style={tw('relative')} >
        <Image style={[tw('w-14 h-14 rounded-full bg-white  '), {resizeMode: 'contain'}]} source={user.avatarUrl ? {uri: user.avatarUrl}: require("../../assets/download.png")}></Image>
        <View style={[tw('absolute bottom-0 right-0 z-10 bg-white rounded-lg'), {padding: 2}]}>
            <AntDesign  name="pluscircle" size={14} color="#3b82f6" />
        </View>
      </View>
      <Text style={tw('text-xs')}>Your story</Text>
    </TouchableOpacity>
  )
}

export default StoryAdderItem

const styles = StyleSheet.create({})