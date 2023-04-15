import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, RootURL } from '../../Store/Store'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../Navigators/MainStack'

const StoryAdderItem = ({onPress} : {onPress: () => void}) => {
    const tw = useTailwind()
    const {user, userSuccess, userError} = useSelector((state: RootState) => state.USERS)

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.5} style={tw(' mr-2 items-center justify-center')} >
      <View style={tw('relative')} >
        <Image style={[tw('w-14 h-14 rounded-full bg-white  '), {resizeMode: 'contain'}]} source={user.avatarUrl ? {uri: RootURL + user.avatarUrl}: require("../../assets/download.png")}></Image>
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