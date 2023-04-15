import { StyleSheet, ListRenderItem, Image, Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert, KeyboardAvoidingView, Dimensions } from 'react-native'
import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react'
import { useNavigation, useRoute, RouteProp, CompositeNavigationProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../Navigators/MainStack'
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../Store/Store'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@rneui/base'
import { getPostsOfActiveUserAction, getPostsOfAuthUser, ResetPosts } from '../../Store/Actions/PostsAction'
import LoadingComponent from '../../Components/LoadingComponent'
import { Post } from '../../Store/Reducers/PostsReducer'
import { FlatList, ScrollView, TextInput } from 'react-native-gesture-handler'
import HomePostCard from '../../Components/HomePostCard'
import { DeactivateUser, deleteUserAction, getActiveUserAction } from '../../Store/Actions/UserAction'
import { addFollowAction, removeFollowAction } from '../../Store/Actions/FollowAction'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AdminPostCard from '../../Components/AdminPostCard'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { UserBottomTabProps } from '../../Navigators/UserBottomStack'
import { COMMENT } from '../../Store/Reducers/CommentReducer'
import { addCommentToParentComment, addCommentToPost, getCommentsOfPost } from '../../Store/Actions/CommentAction'
import CommentItem from '../../Components/CommentItem'
import AdminCommentItem from '../../Components/AdminCommentItem'

type AdminCommentScreenRouteProp = RouteProp<RootStackParamList, "AdminCommentScreen">

const AdminCommentScreen = () => {
    const {params} = useRoute<AdminCommentScreenRouteProp>();
    const {postId} = params;
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
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const scrollRef = useRef<FlatList>(null)

    const loadCommentsOfPost = useCallback(async () => {
      //  if(!isRefreshing) {
        setIsRefreshing(true)
        dispatch(getCommentsOfPost(postId) as any)
        setIsRefreshing(false)
      //  }
    }, [postId, comments])

    useEffect(() => {
        setIsLoading(true)
        loadCommentsOfPost().then(() => setIsLoading(false))
    }, [postId])

    useEffect(() => {
      scrollRef.current?.scrollToEnd()
    }, [comments])

    useLayoutEffect(() => {
      navigation.setOptions({
        title: "Comments"
      })
    })

    const renderCommentItem: ListRenderItem<any> = ({item}: {item: COMMENT}) => (
      <AdminCommentItem item={item} setIsReply={setIsReply} setParent={setParent} setParentCommentId={setParentCommentId}></AdminCommentItem>
    )

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
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default AdminCommentScreen

const styles = StyleSheet.create({})