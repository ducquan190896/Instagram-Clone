import {Dimensions, StyleSheet, Text, View, FlatList, ListRenderItem, KeyboardAvoidingView, TouchableNativeFeedback, Keyboard, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch, useSelector } from 'react-redux'
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { RootStackParamList } from '../Navigators/MainStack';
import { RootState, RootURL } from '../Store/Store'
import { getAllChatsByAuthAction, getChatByIdAction, getOrAddChatAction } from '../Store/Actions/ChatAction'
import { USER } from '../Store/Reducers/UserReducer'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RouteProp, useNavigation, useRoute, CompositeNavigationProp } from '@react-navigation/native'
import { addMessageAction, clearMessagesAction, getMessagesOfChatAction, receiveMessageSocket } from '../Store/Actions/MessageAction'
import { MESSAGE } from '../Store/Reducers/MessageReducer'
import MessageItem from '../Components/MessageItem'
import LoadingComponent from '../Components/LoadingComponent'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { HomeStackParamList } from '../Navigators/HomeStack'
import { UserBottomTabProps } from '../Navigators/UserBottomStack'
import SockJS from "sockjs-client";
import {over} from "stompjs"
import AsyncStorage from '@react-native-async-storage/async-storage'

type ChatsScreenNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<RootStackParamList, "ConversationScreen">,
BottomTabNavigationProp<UserBottomTabProps>>;

type ChatsScreenRouteProp = RouteProp<RootStackParamList, "ConversationScreen">;

const ConversationScreen = () => {
    const [stompClient, setStompClient] = useState<any | null>(null);
    const {chatId, chatPersonId} = useRoute<ChatsScreenRouteProp>()?.params
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    const tw = useTailwind()
    const dispatch = useDispatch()
    const navigation = useNavigation<ChatsScreenNavigationProp>()
    const {user, userSuccess, userError} = useSelector((state: RootState) => state.USERS)
    const {chats, chat, chatError, chatSuccess} = useSelector((state: RootState) => state.CHATS)
    const {messages, message, messageError, messageSuccess} = useSelector((state: RootState) => state.MESSAGES)
    const scrollRef = useRef<FlatList>(null)
    const height: number = Dimensions.get("window").height
    const [messageInput, setMessageInput] = useState<string>("")
    const [receiver, setReceiver] = useState<USER | null>(null)

    const loadMessages = useCallback(async() => {
      if (chat) {
        setIsRefreshing(true)
        await dispatch(getMessagesOfChatAction(chat?.id) as any)
        setIsRefreshing(false)
      }
    }, [ chat, dispatch])


    const loadChat = useCallback(async () => {
      if (chatId) {
        await dispatch(getChatByIdAction(chatId) as any)
      }
      if(chatPersonId) {
        await dispatch(getOrAddChatAction(chatPersonId) as any)
      }
    }, [chatId, dispatch, chatPersonId])

    useEffect(() => {
      setIsLoading(true)
      loadChat().then(() => setIsLoading(false))
    }, [chatId, chatPersonId, dispatch]) 

    useEffect(() => {
      dispatch(clearMessagesAction() as any);
      setIsLoading(true)
      loadMessages().then(() => setIsLoading(false))
      if(stompClient == null) {
        connect();
      }
    }, [chat, dispatch, stompClient]) 

    useEffect(() => {
      if (chat && chat?.participantResponses && chat?.participantResponses.length > 0 ) {
        setReceiver(chat?.participantResponses[0].owner.id == user.id ? chat.participantResponses[1].owner : chat.participantResponses[0].owner)
      }
    }, [chat, chatId, dispatch, chatPersonId])

    useEffect(() => {
      scrollRef?.current?.scrollToEnd()
    }, [messages])

    const connect = useCallback(async () => {
      if(chat != null) {
        const token = await AsyncStorage.getItem("token");
        let sock = SockJS(RootURL + "/socket");
        let stompClient = over(sock);
        setStompClient(stompClient);
        if(stompClient.status !== "CONNECTED") {
          stompClient.connect({username: user.username, token: token}, (frame: any) => {
            stompClient.subscribe("/chatroom/" + chat.id, messageReceived)
          }, notConnected)
        }
      }
    }, [stompClient, chat])

    const messageReceived = (payload: any) => {
      const message : MESSAGE =  JSON.parse(payload.body);
      console.log("message received");
      console.log(message);
      if(message.participant.owner.id != user?.id) {
        dispatch(receiveMessageSocket(message) as any);
        console.log(payload.body);
      }
    }

    const notConnected = () => {
      console.log("not connected");
    }
    
    const renderCommentItem: ListRenderItem<any> = ({item}: {item: MESSAGE}) => (
      <MessageItem item={item}></MessageItem>
    )
    const addMessageFunction = async () => {
      if(chat && messageInput) {
        const messageForm = {
          text: messageInput,
          chatId: chat?.id
        }
        await dispatch(addMessageAction(messageForm) as any)
        setMessageInput("")
      }
    }

    const navigateToChatsScreen = () => {
      navigation.goBack()
    }

    const navigateToOtherUserProfileScreen = () => {
      if(receiver) {
        navigation.navigate("HomeStack", {screen: "OtherUserHomeScreen", params: {userId: receiver?.id, isSearch: false}});
      }
    }

    if(isLoading) {
      return <LoadingComponent/>
    }

  return (
    <SafeAreaView style={tw('flex-1 bg-white relative')}>
      <View style={tw('w-full pl-4 py-2 flex-row items-center justify-start border-b border-gray-300')}>
        <TouchableOpacity onPress={navigateToChatsScreen}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>  
        {receiver && 
          <TouchableOpacity onPress={navigateToOtherUserProfileScreen} style={tw('flex-row items-center')}>
            <Image style={[tw('w-12 h-12 rounded-full bg-white ml-2 mr-4'), {resizeMode: 'contain'}]} source={receiver?.avatarUrl ? {uri:RootURL + receiver.avatarUrl}: require("../assets/download.png")}></Image>
            <Text style={tw('text-lg text-black')}>{receiver?.username}</Text>
          </TouchableOpacity>
        }
      </View>
      <KeyboardAvoidingView style={tw('absolute bottom-0 w-full flex-1')}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>         
          <>
            <View style={tw('flex-1')}>
            {messages && messages?.length > 0 && (
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
                style={[{height: height - 125}, tw('bg-gray-100 flex-1')]}
              >
              </FlatList>
            )}
            </View>
            <View style={tw('w-full py-2 flex-row items-center justify-center')}>
              {user && <Image style={[tw('w-8 h-8 rounded-full bg-white ml-2 mr-2'), {resizeMode: 'contain'}]} source={user.avatarUrl ? {uri: RootURL + user.avatarUrl}: require("../assets/download.png")}></Image>}
              <TextInput value={messageInput} onChangeText={(text: string) => setMessageInput(text)} placeholder='your message'  style={tw('flex-1  text-base bg-gray-300 rounded-full py-2 px-6')} ></TextInput>
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