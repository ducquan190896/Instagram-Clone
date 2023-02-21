import {Dimensions, StyleSheet, Text, View, FlatList, ListRenderItem, KeyboardAvoidingView, TouchableNativeFeedback, Keyboard, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch, useSelector } from 'react-redux'
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { RootStackParamList } from '../Navigators/MainStack';

import { RootState } from '../Store/Store'
import { getAllChatsByAuthAction, getChatByIdAction } from '../Store/Actions/ChatAction'
import { CHAT } from '../Store/Reducers/ChatReducer'
import ChatCard from '../Components/ChatCard'
import { USER } from '../Store/Reducers/UserReducer'
import { TouchableWithoutFeedback } from '@gorhom/bottom-sheet'
import { Entypo, EvilIcons, Ionicons } from '@expo/vector-icons'; 
import { Button } from '@rneui/base'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { addMessageAction, getMessagesOfChatAction } from '../Store/Actions/MessageAction'
import { MESSAGE } from '../Store/Reducers/MessageReducer'
import MessageItem from '../Components/MessageItem'
import LoadingComponent from '../Components/LoadingComponent'


// type ChatSearchScreenRouteProps = RouteProp<RootStackParamList, "ConversationScreen">

const ConversationScreen = () => {
  const chatId = 2
    // const {chatId} = useRoute<ChatSearchScreenRouteProps>()?.params
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    const tw = useTailwind()
    const dispatch = useDispatch()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const {user, userSuccess, userError} = useSelector((state: RootState) => state.USERS)
    const {chats, chat, chatError, chatSuccess} = useSelector((state: RootState) => state.CHATS)
    const {messages, message, messageError, messageSuccess} = useSelector((state: RootState) => state.MESSAGES)
    const scrollRef = useRef<FlatList>(null)
    const height: number = Dimensions.get("window").height
    const [messageInput, setMessageInput] = useState<string>("")
    const [receiver, setReceiver] = useState<USER | null>(null)

    const loadMessages = useCallback(async() => {
      if(chatId) {
        setIsRefreshing(true)
      await dispatch(getMessagesOfChatAction(chatId) as any)
        setIsRefreshing(false)
      }
    }, [chatId, messageSuccess, messages])

    const loadChatById = useCallback(async () => {
      if(chatId) {
        await dispatch( getChatByIdAction(chatId) as any)
      }
    }, [chatId, dispatch, chatSuccess])

    useEffect(() => {
      setIsLoading(true)
      loadMessages().then(() => loadChatById()).then(() => setIsLoading(false))
    }, [chatId]) 

    useEffect(() => {
      if(chat) {
        setReceiver(chat.participantResponses[0].owner.id == user.id ? chat.participantResponses[1].owner : chat.participantResponses[0].owner)
      }
    }, [chat, chatId, dispatch])

    useEffect(() => {
      scrollRef?.current?.scrollToEnd()
    }, [messages])
    
    const renderCommentItem: ListRenderItem<any> = ({item}: {item: MESSAGE}) => (
      <MessageItem item={item}></MessageItem>
    )
    const addMessageFunction = async () => {
      const messageForm = {
        text: messageInput,
        chatId: chatId
      }
      await dispatch(addMessageAction(messageForm) as any)
      setMessageInput("")
    }

    const navigateToChatsScreen = () => {
      navigation.goBack()
    }

    if(isLoading) {
      return <LoadingComponent/>
  }

  return (
    <SafeAreaView style={tw('flex-1')}>
      
        <View style={tw('w-full pl-4 my-2 flex-row items-center justify-start border-b border-gray-300')}>
          <TouchableOpacity onPress={navigateToChatsScreen}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          
          {receiver && 
          <View style={tw('flex-row items-center')}>
            <Image style={[tw('w-12 h-12 rounded-full bg-white ml-2 mr-4'), {resizeMode: 'contain'}]} source={receiver?.avatarUrl ? {uri: receiver.avatarUrl}: require("../assets/download.png")}></Image>
            <Text style={tw('text-base')}>{receiver?.username}</Text>
          </View>
          }
        </View>
      
      <FlatList
            showsVerticalScrollIndicator={false}
            ref={scrollRef}
            refreshing={isRefreshing}
            onRefresh={loadMessages}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderCommentItem}
            scrollEventThrottle={30}
            // inverted
            initialScrollIndex={0}
            onContentSizeChange={() => scrollRef?.current?.scrollToEnd()}
            style={[{height: height - 90}]}
            >
      </FlatList>
      <KeyboardAvoidingView >
        <TouchableWithoutFeedback    onPress={Keyboard.dismiss}>         
          < >
 
          <View style={tw('w-full py-2 flex-row items-center justify-center')}>
            {user && <Image style={[tw('w-8 h-8 rounded-full bg-white ml-2 mr-2'), {resizeMode: 'contain'}]} source={user.avatarUrl ? {uri: user.avatarUrl}: require("../assets/download.png")}></Image>}
            <TextInput value={messageInput} onChangeText={(text: string) => setMessageInput(text)} placeholder='your comment'  style={tw('flex-1  text-base bg-gray-300 rounded-full py-2 px-6')} ></TextInput>
            <TouchableOpacity onPress={addMessageFunction}  style={tw('mx-2')}>
              <Ionicons name="send-sharp" size={24} color="#3b82f6" />
            </TouchableOpacity>
          </View>
          </>
          
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    
    </SafeAreaView>
  )
}

export default ConversationScreen

const styles = StyleSheet.create({})