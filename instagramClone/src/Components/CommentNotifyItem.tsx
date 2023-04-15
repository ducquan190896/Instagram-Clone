import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { POSTNOTIFY } from '../Store/Reducers/PostNotifyReducer'
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, RootURL } from '../Store/Store'
import { USER } from '../Store/Reducers/UserReducer'
import { commentLikeType, postCommentType, postLikeType } from '../Screens/NotificationsScreen'
import { COMMENTNOTIFY } from '../Store/Reducers/CommentNofifyReducer'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../Navigators/MainStack'
import { useNavigation } from '@react-navigation/native';

const CommentNotifyItem = ({item, authUser}: {item: COMMENTNOTIFY, authUser: USER}) => {
    const [creator, setCreator] = useState<USER>(item?.creatorResponse)
    const tw = useTailwind()
    const dispatch = useDispatch()
    // const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    const dateOfcomment = new Date(item.dateCreated.replace("--", "-"))
    const currentTime = new Date()
    let timeOfComment = ( currentTime.getTime() - dateOfcomment.getTime()) / 1000 / 60 / 60
    let timeOfComment2 = ( currentTime.getTime() - dateOfcomment.getTime()) / 1000 / 60 

    const navigationToPost = () => {
        //navigate to Creator home page
        // navigation.navigate("")
    }

    if(item?.creatorResponse.id == authUser.id) {
        return null;
    }

  return (
    <TouchableOpacity onPress={navigationToPost} style={tw('my-2 mx-2 flex-row items-center justify-center')}>
     <View style={[tw('rounded-full bg-red-400 mr-6'), {padding: 2}]}>
        <Image style={[tw('w-12 h-12 rounded-full bg-white'), {resizeMode: 'contain'}]} source={creator?.avatarUrl ? {uri: RootURL + creator.avatarUrl}: require("../assets/download.png")}></Image>        
    </View>
    <View style={tw('flex-row items-center justify-start flex-1')}>
        <Text style={tw('text-2xl text-zinc-700 font-bold mr-2')}>{creator.username} </Text>
        <Text style={tw('text-base')}>{item?.type == commentLikeType ? " like your comment" : " reply to your comment" }</Text>
        <Text style={tw('text-sm text-gray-500 ml-4')}>{timeOfComment < 1 ? (Math.floor(timeOfComment * 60))  + " m": timeOfComment > 24 ? (timeOfComment / 24).toFixed(0) + " d" : Math.floor(timeOfComment) + " h" }</Text>
    </View>
    
    </TouchableOpacity>
  )
}

export default CommentNotifyItem

const styles = StyleSheet.create({})