import {TouchableOpacity, Image,FlatList, ListRenderItem, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useRef, useState, useEffect } from 'react'
import { Post } from '../Store/Reducers/PostsReducer'
import { useTailwind } from 'tailwind-rn/dist'
import PostCardDot from './PostCardDot'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, RootURL } from '../Store/Store'
import { deletePostAction, getPostByPostIdAfterUpdate, getPostsOfFollowingsAndAuthUser } from '../Store/Actions/PostsAction'
import LoadingComponent from './LoadingComponent'
import PollingComponent from './PollingComponent'
import { addVoteToPoll } from '../Store/Actions/VoteAction'
import { POSTLIKE } from '../Store/Reducers/PostLikeReducer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TAG } from '../Store/Reducers/TagReducer'
import AdminPolling from './AdminPolling'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../Navigators/MainStack'

const AdminPostCard = ({post, isLoading, setIsLoading}: {post: Post, isLoading?: boolean, setIsLoading?: (value: boolean) => void}) => {
    const [activeIndex, setActiveIndex] = useState<number>(0)   
    const [postLikes, setPostlikes] = useState<POSTLIKE[] | []>([])
    const [isLike, setIsLike] = useState<boolean>(false)
    const tw = useTailwind();
    const dispatch = useDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const windownWith = useWindowDimensions().width
    const {votes, vote, voteSuccess, voteError, message} = useSelector((state: RootState) => state.VOTES)
    const {user, userSuccess, userError} = useSelector((state: RootState) => state.USERS)
    const imagesDefault = [
        require("../assets/skysports-cristiano-ronaldo_5823297.jpg"),
        require("../assets/0x0.jpg"),
        require("../assets/gettyimages-1246567729.jpg")
    ]
    const dateOfPost = new Date(post.dateCreated.replace("--", "-"))
    const currentTime = new Date()
    let timeOfPosting = ( currentTime.getTime() - dateOfPost.getTime()) / 1000 / 60 / 60
    let timeOfPosting2 = ( currentTime.getTime() - dateOfPost.getTime()) / 1000 / 60 

    const handleRenderItem: ListRenderItem<any> = ({item}) => (
        <Image source={post?.imageUrls && post?.imageUrls.length > 0 ? {uri: RootURL + item} : item} style={[tw('text-base'), {width: windownWith, height: 400, resizeMode: 'cover'}]}></Image>       
    )

    const onViewableItemsChanged = useRef(({viewableItems, changed}: {viewableItems: any, changed: any}) => {
        
            if(viewableItems.length > 0) {
                setActiveIndex(viewableItems[0].index)
            }
    })

    const loadPostLike = useCallback(async () => {
      try {
        const res = await fetch(RootURL + `/api/postlikes/getAllByPost/${post.id}`)
        const data = await res.json()
        console.log(data)

       setPostlikes(data)

    } catch (err) {
        dispatch({
            type: "error_post_like",
            payload: err
        })
    }
    }, [post, postLikes])

    const addPostLike = async () => {
      try {

        const token = await AsyncStorage.getItem("token")
        console.log(token)
        const res = await fetch(RootURL + `/api/postlikes/likePost/${post.id}`, {
            method: "POST",
            headers: {
                "Authorization": token ?? ""
            }
        })
        const data = await res.json()
        console.log(data)
        // setIsLike(prev => !prev)
       await dispatch(getPostByPostIdAfterUpdate(post.id) as any)
       await loadPostLike()
        // checkLikeCallBack()
    } catch (err) {
        dispatch({
            type: "error_post_like",
            payload: err
        })
    }
    }

    const removePostLike = async () => {
      try {
        const token = await AsyncStorage.getItem("token")
        console.log(token)
         await fetch(RootURL + `/api/postlikes/removeLikeFromPost/${post.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": token ?? ""
            }
        })
        // setIsLike(prev => !prev)
        await dispatch(getPostByPostIdAfterUpdate(post.id) as any)
        await loadPostLike()
        //  checkLikeCallBack()
    } catch (err) {
        dispatch({
            type: "error_post_like",
            payload: err
        })
    }
    }

    useEffect(() => {
      loadPostLike()
    }, [])

    const checkLikeCallBack = () => {
      if(user && postLikes && postLikes.length > 0) {
        const isCheck = postLikes.some((like: POSTLIKE) => like.userResponse.id == user.id)
        console.log(isCheck)
        setIsLike(isCheck)
      }
    }

    useEffect(() => {
     checkLikeCallBack()
    }, [dispatch, postLikes, user, post, setPostlikes, isLike])

    const onComment = () => {
        navigation.navigate("AdminCommentScreen", {postId: post.id})
    }

    const onDelete = async () => {
        await dispatch(deletePostAction(post.id) as any)
    }
 
   if (isLoading) {
    return <LoadingComponent></LoadingComponent>
   } 
   
  return (
    <View style={tw('w-full my-2')}>
      <View style={tw('relative w-full px-4 pb-2 flex-row items-center')}>
        <View style={tw('rounded-full border border-red-600 border-2')}>
            <Image style={[tw('w-10 h-10 rounded-full bg-white '), {resizeMode: 'contain'}]} source={post?.userResponse?.avatarUrl ? {uri: RootURL + post?.userResponse?.avatarUrl}: require("../assets/download.png")}></Image>
        </View>
        <Text style={tw('ml-4 text-lg font-bold text-black')}>{post?.userResponse?.username}</Text>
        <TouchableOpacity onPress={onDelete}  activeOpacity={0.5} style={tw('mr-4 absolute top-2 right-0')}>
            <AntDesign name="delete" size={28} color="red" />
        </TouchableOpacity>
      </View>
      {!post?.poll && (
        <FlatList
          data={ post?.imageUrls && post?.imageUrls.length > 0 ?  post?.imageUrls : imagesDefault}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          snapToAlignment='center'
          decelerationRate='fast'
          snapToInterval={windownWith}
          viewabilityConfig={{
            viewAreaCoveragePercentThreshold: 50,
          }}
          onViewableItemsChanged={onViewableItemsChanged.current}
          keyExtractor={(item: string) => item}
          renderItem={handleRenderItem}
        >
        </FlatList>
      )}
        {post?.poll && (
          <AdminPolling postParams={post}></AdminPolling>
        )}
      <View style={tw('flex-row w-full px-6 items-center my-2')}>
        <View style={tw('flex-row mr-24 items-center')}>
            <TouchableOpacity onPress={onComment} activeOpacity={0.5} style={tw('mr-4')}>
                <Feather name="message-circle" size={28} color="black" />
            </TouchableOpacity>
        </View>
       {!post?.poll && (
         <PostCardDot activeIndex={activeIndex} arrayLength={post?.imageUrls && post?.imageUrls.length > 0 ?  post?.imageUrls?.length : imagesDefault.length}></PostCardDot>
       )}
      </View>
      <Text style={tw('text-base font-bold ml-4')}>{post?.likeCount} Likes</Text>
      <Text style={tw('text-base font-bold mt-2 ml-4 text-black')}>{post?.content}</Text>
      {post?.tags && post?.tags.length > 0 && (
        <View style={tw('flex-row my-2')}>
        {post?.tags && post?.tags.length > 0 && post?.tags.map((tag, index) => <Text key={index} style={tw('text-lg ml-4')}>{tag}</Text>)}
        </View>
      )}
      <Text style={tw('text-base ml-4')}>{timeOfPosting < 1 ? (Math.floor(timeOfPosting * 60))  + " minutes ago": timeOfPosting > 24 ? (timeOfPosting / 24).toFixed(0) + " days ago" : Math.floor(timeOfPosting) + " hours ago" }</Text>
      {post?.commentCount > 0 && (
        <Text style={tw('text-base font-bold ml-4')}>{post?.commentCount > 0 ? post?.commentCount + " comments" : null}</Text>
      )}
    </View>
  )
}

export default AdminPostCard

const styles = StyleSheet.create({})