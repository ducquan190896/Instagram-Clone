import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch } from 'react-redux'
import { CHAT } from '../Store/Reducers/ChatReducer'
import { USER } from '../Store/Reducers/UserReducer'
import { Button } from '@rneui/base'
import { RootURL } from '../Store/Store'

const ChatCard = ({item, user, navigation}: {item: CHAT, user: USER, navigation: any}) => {
    const tw = useTailwind()
    const dispatch = useDispatch()
    const [receiver, setReceiver] =  useState<USER>(item?.participantResponses[0].owner.id == user.id ? item?.participantResponses[1].owner: item?.participantResponses[0].owner)

    const navigateToOtherUserHomeScreen = () => {
        navigation.navigate("ConversationScreen", {chatId: item?.id});
    }

  return (
    <View  style={tw('w-full border-b border-gray-300 flex-row items-center justify-between px-6 py-2')}>
        <View style={tw('items-center justify-center flex-row')}>
            <Image style={tw('w-14 h-14 rounded-full mr-4')} source={receiver?.avatarUrl ? {uri: RootURL + receiver?.avatarUrl} : require("../assets/download.png")}></Image>
            <Text style={tw('text-lg  text-black')}>{receiver?.username}</Text>
        </View>
        <Button onPress={navigateToOtherUserHomeScreen} title="send message" containerStyle={tw('w-32 h-10')} buttonStyle={tw('rounded-2xl')}></Button>
  </View>
  )
}

export default ChatCard

const styles = StyleSheet.create({})