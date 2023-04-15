import { GestureResponderEvent, Image, ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { COMMENT } from '../Store/Reducers/CommentReducer'
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, RootURL } from '../Store/Store'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { addCommentLikeAction, errorCommentLikeAction, resetCommentLikeAction, unlikeCommentAction } from '../Store/Actions/CommentLikeAction'
import { getCommentByIdAction } from '../Store/Actions/CommentAction'

type commentItemProps = {
    item: COMMENT,
    setIsReply: (value: boolean) => void,
    setParentCommentId: (value: number | null) => void,
    setParent: (value: string |null) => void
}

const CommentItem = ({item, setIsReply, setParentCommentId, setParent}: commentItemProps) => {
    const [isLike, setIsLike] = useState<boolean>(false)
    const {comments, commentError, commentSuccess} = useSelector((state: RootState) => state.COMMENTS)
    const {user, userSuccess, userError} = useSelector((state: RootState) => state.USERS)
    const {commentLikeSuccess, commentLikes, commentLikeError} = useSelector((state: RootState) => state.COMMENTLIKES)
    const [childrenComments, setChildrenComments] = useState<COMMENT[] | []>(comments.filter((comm: COMMENT) => comm.parentCommentId == item.id))
    const tw = useTailwind()
    const dispatch = useDispatch()
    const loadChildrenComments = useCallback(() => {
        setChildrenComments(comments.filter((comm: COMMENT) => comm.parentCommentId == item.id))
    }, [item, comments, commentSuccess])

    const loadLikeCommentStatusByAuth = useCallback( async () => {
        if(item) {
            try {
                const token = await AsyncStorage.getItem("token")
                console.log(token)
                const res = await fetch(RootURL + `/api/commentLike/checkCommentLikeByAuthUser/${item?.id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": token ?? ""
                    }
                })  
                const data = await res.json()
                console.log(data)
                setIsLike(data)
            } catch (err) {
                dispatch(errorCommentLikeAction("cannot check the comment like of auth user") as any)
            }
        }
    }, [item, user, dispatch, userSuccess, commentLikes, commentLikeSuccess, isLike])

    useEffect(() => {
        loadLikeCommentStatusByAuth()  
    }, [item, commentSuccess, comments, user, commentLikes, commentLikeSuccess, isLike])

    useEffect(() => {
         loadChildrenComments()
    }, [item, commentSuccess, comments])

    useEffect(() => {
        if(commentLikeError || commentLikeError) {
            dispatch(resetCommentLikeAction() as any)
        }
    }, [commentLikeSuccess, commentLikeError])

    const dateOfcomment = new Date(item.dateCreated.replace("--", "-"))
    const currentTime = new Date()
    let timeOfComment = ( currentTime.getTime() - dateOfcomment.getTime()) / 1000 / 60 / 60
    let timeOfComment2 = ( currentTime.getTime() - dateOfcomment.getTime()) / 1000 / 60 
    const handleReplyComment = () => {
        setIsReply(true)
        setParentCommentId(item?.id)
        setParent(item?.content)
    }

    const likeOrUnlikeComment = async () => {
        if(!isLike) {
           await dispatch(addCommentLikeAction(item?.id, item?.postResponse?.id) as any)
        //    loadLikeCommentStatusByAuth()
        } else {
           await dispatch(unlikeCommentAction(item?.id, user?.id) as any)
            // loadLikeCommentStatusByAuth()
        }
        dispatch(getCommentByIdAction(item.id) as any)
    }
    

  return (
    <View>
        <View style={tw('w-full px-2 flex-row items-center justify-between mb-4')}>
            <Image style={[tw('w-12 h-12 rounded-full bg-white mr-4'), {resizeMode: 'contain'}]} source={item?.ownerResposne?.avatarUrl ? {uri: RootURL + item?.ownerResposne?.avatarUrl}: require("../assets/download.png")}></Image>
            <View style={tw('flex-1')}>
                <View style={tw('flex-row items-center justify-start')}>
                    <Text style={tw('font-bold text-base mr-4')}>{item?.ownerResposne?.username}</Text>
                    <Text style={tw('text-sm text-gray-400')}>{timeOfComment < 1 ? (Math.floor(timeOfComment * 60))  + " m": timeOfComment > 24 ? (timeOfComment / 24).toFixed(0) + " d" : Math.floor(timeOfComment) + " h" }</Text>
                </View>
                
                <Text style={tw(' text-lg')}>{item?.content}</Text>
                <TouchableOpacity onPress={handleReplyComment} style={tw('')}>
                        <Text style={tw('text-sm')}>Reply</Text>
                </TouchableOpacity>
            </View>
            <View style={tw('items-center justify-center ml-2')}>
                <TouchableOpacity onPress={likeOrUnlikeComment} style={tw('')}>
                    {isLike ? <AntDesign name="heart" size={20} color="red" /> :<AntDesign name="hearto" size={20} color="black" />}
                </TouchableOpacity>
                {item?.commentLikeCount > 0 && <Text style={tw('text-gray-400 mt-2')}>{item?.commentLikeCount}</Text>}
            </View>   
        </View>
        
        {childrenComments && childrenComments.length > 0 && (
            <View style={tw('w-full pl-6')}>
                {childrenComments.map((item: COMMENT) =>  <CommentItem key={item.id} item={item} setIsReply={setIsReply} setParent={setParent} setParentCommentId={setParentCommentId}></CommentItem>)}
            </View>
        )}
    </View>
  )
}

export default CommentItem

const styles = StyleSheet.create({})