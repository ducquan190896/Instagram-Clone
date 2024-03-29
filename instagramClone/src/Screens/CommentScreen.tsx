import { Dimensions, FlatList, KeyboardAvoidingView, ListRenderItem, StyleSheet, Text, TouchableWithoutFeedback, View, TextInput, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, RootURL } from '../Store/Store'
import { useTailwind } from 'tailwind-rn/dist'
import { ReceiveCommentFromWebSocket, addCommentToParentComment, addCommentToPost, getCommentsOfPost, resetCommentAction } from '../Store/Actions/CommentAction'
import { COMMENT } from '../Store/Reducers/CommentReducer'
import LoadingComponent from '../Components/LoadingComponent'
import { useNavigation, useRoute, CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { RootStackParamList } from '../Navigators/MainStack';
import { SafeAreaView } from 'react-native-safe-area-context'
import CommentItem from '../Components/CommentItem'
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { HomeStackParamList } from '../Navigators/HomeStack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import SockJS from "sockjs-client";
import {over} from "stompjs"

type CommentScreenNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<RootStackParamList, "CommentScreen">,
BottomTabNavigationProp<HomeStackParamList>>;

type CommentScreenRouteProp = RouteProp<RootStackParamList, "CommentScreen">;

const CommentScreen = () => {
    const [stompClient, setStompClient] = useState<any | null>(null);
    const {postId} = useRoute<CommentScreenRouteProp>().params;
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    const [isReply, setIsReply] = useState<boolean>(false)
    const [parentCommentId, setParentCommentId] = useState<number | null>(null)
    const [parent, setParent] = useState<string| null>(null)
    const [commentInput, setCommentInput] = useState<string>("")
    const dispatch = useDispatch()
    const tw = useTailwind();
    const height: number = Dimensions.get("window").height
    const {comments, commentSuccess, commentError, comment} = useSelector((state: RootState) => state.COMMENTS);
    const {user, userSuccess, userError} = useSelector((state: RootState) => state.USERS)
    const navigation = useNavigation<CommentScreenNavigationProp>();
    const scrollRef = useRef<FlatList>(null)

    const loadCommentsOfPost = useCallback(async () => {
        setIsRefreshing(true)
        dispatch(getCommentsOfPost(postId) as any)
        setIsRefreshing(false)
    }, [postId, comments])

    useEffect(() => {
        setIsLoading(true)
        loadCommentsOfPost().then(() => setIsLoading(false))
    }, [postId])

    useEffect(() => {
      if(stompClient == null && postId) {
        connect();
      }
    }, [stompClient, postId])

    useEffect(() => {
      scrollRef.current?.scrollToEnd()
    }, [comments])

    useLayoutEffect(() => {
      navigation.setOptions({
        title: "Comments"
      })
    })

    const connect = useCallback(async () => {
      if(postId) {
        const token = await AsyncStorage.getItem("token");
        let sock = SockJS(RootURL + "/socket");
        let stompClient = over(sock);
        setStompClient(stompClient);
        if(stompClient.status !== "CONNECTED") {
          stompClient.connect({username: user.username, token: token}, (frame: any) => {
            stompClient.subscribe("/post/" + postId, messageReceived)
          }, notConnected)
        }
      }
    }, [stompClient, postId])

    const messageReceived = (payload: any) => {
      const comment : COMMENT =  JSON.parse(payload.body);
      console.log("message received");
      console.log(comment);
      if(comment.ownerResposne.id != user?.id) {
        dispatch(ReceiveCommentFromWebSocket(comment) as any);
        console.log(payload.body);
      }
    }

    const notConnected = () => {
      console.log("not connected");
    }

    const renderCommentItem: ListRenderItem<any> = ({item}: {item: COMMENT}) => (
      <CommentItem item={item} setIsReply={setIsReply} setParent={setParent} setParentCommentId={setParentCommentId}></CommentItem>
    )

    const sendMessageFunction = async () => {
      if (isReply && parent && parentCommentId) {  
        const commentOfComment = {
          content: commentInput,
          postId: postId,
          parentCommentId: parentCommentId
        }
         dispatch(addCommentToParentComment(commentOfComment) as any)
          console.log("message: " + parent + " : id " + parentCommentId)
          setIsReply(false)
          setParentCommentId(null)
          setParent(null)
          setCommentInput("")
      } else if(!isReply && !parent && !parentCommentId) {
        const commentOfPost = {
          content: commentInput,
          postId: postId
        }
        dispatch(addCommentToPost(commentOfPost) as any)
        setCommentInput("")
      } else if(!commentInput || commentInput == "") {
        Alert.alert("please type your comment")
      }
    }
    const removeReplyComment = () => {
      setIsReply(false)
      setParentCommentId(null)
      setParent(null)
      setCommentInput("")
      console.log("message: " + parent + " : id " + parentCommentId)
    }
    if(isLoading) {
        return <LoadingComponent/>
    }

  return (
    <SafeAreaView style={tw('flex-1')}>
      <KeyboardAvoidingView style={tw('flex-1')}>
        <TouchableWithoutFeedback style={tw('flex-1')}>
          <>
            <View style={tw('flex-1')}>
              {comments && comments?.length > 0 && (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  ref={scrollRef}
                  refreshing={isRefreshing}
                  onRefresh={loadCommentsOfPost}
                  data={comments?.filter((comm: COMMENT) => comm.parentCommentId == null)}
                  keyExtractor={(item) => item.id}
                  renderItem={renderCommentItem}
                  scrollEventThrottle={30}
                  style={{height: height - 50}}
                >
                </FlatList>
              )}
              {isReply && parent && parentCommentId && (
                <View style={tw('w-full z-10 bg-gray-200 py-2 px-4 flex-row items-center justify-center')}>
                  <Text style={tw('text-zinc-500 text-base  flex-1')}>Replying to {parent}</Text>
                  <TouchableOpacity onPress={removeReplyComment} style={tw('mx-2')}>
                    <EvilIcons name="close" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={tw('w-full py-2 flex-row items-center justify-center')}>
              {user && <Image style={[tw('w-8 h-8 rounded-full bg-white ml-2 mr-2'), {resizeMode: 'contain'}]} source={user.avatarUrl ? {uri: RootURL + user.avatarUrl}: require("../assets/download.png")}></Image>}
              <TextInput placeholder='your comment'  style={tw('flex-1  text-base bg-gray-300 rounded-full py-2 px-6')} value={commentInput} onChangeText={(text: string) => setCommentInput(text)}></TextInput>
              <TouchableOpacity onPress={sendMessageFunction} style={tw('mx-2')}>
                <Ionicons name="send-sharp" size={24} color="#3b82f6" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default CommentScreen

const styles = StyleSheet.create({})