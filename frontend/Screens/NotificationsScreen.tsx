import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../Store/Store'
import { getPostNotifyByAuthUserAction } from '../Store/Actions/PostNotifyAction'
import { getStoryNotifyByAuthUserAction } from '../Store/Actions/StoryNotifyAction'
import { getFollowNotifyByAuthUserAction } from '../Store/Actions/FollowNotifyAction'
import { getCommentNotifyByAuthUserAction } from '../Store/Actions/CommentNotifyAction'
import { SafeAreaView } from 'react-native-safe-area-context'
import { POSTNOTIFY } from '../Store/Reducers/PostNotifyReducer'
import PostNotifyItem from '../Components/PostNotifyItem'
import LoadingComponent from '../Components/LoadingComponent'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../Navigators/MainStack'
import { useNavigation } from '@react-navigation/native';
import { COMMENT } from '../Store/Reducers/CommentReducer'
import { COMMENTNOTIFY } from '../Store/Reducers/CommentNofifyReducer'
import CommentNotifyItem from '../Components/CommentNotifyItem'
import { ScrollView } from 'react-native-gesture-handler'
import { STORYNOTIFY } from '../Store/Reducers/StoryNotifyReducer'
import StoryNotifyItem from '../Components/StoryNotifyItem'
import FollowNotifyItem from '../Components/FollowNotifyItem'
import { FOLLOWNOTIFY } from '../Store/Reducers/FollowNotifyReducer'

export const postLikeType: string = "POST_Like"
export const postCommentType: string = "POST_COMMENT"
export const commentLikeType: string = "COMMENT_LIKE"
export const addToParentCommentType: string = "ADD_COMMENT_TO_PARENT_COMMENT"
export const followNotifyType: string = "follow_notification"
export const storyLikeNotifyType: string = "story_like"

const NotificationsScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isRefeshing, setIsRefreshing] = useState<boolean>(false)
    const tw = useTailwind()
    const dispatch = useDispatch()
    const {postNotifies, postNotifySuccess, postNotifyError} = useSelector((state: RootState) => state.POSTNOTIFIES)
    const {storyNotifies, storyNotifySuccess, storyNotifyError} = useSelector((state: RootState) => state.STORYNOTIFIES)
    const {followNotifies, followNotifySuccess, followNotifyError} = useSelector((state: RootState) => state.FOLLOWNOTIFIES)
    const {commentNotifies, commentNotifySuccess, commentNotifyError} = useSelector((state: RootState) => state.COMMENTNOTIFIES)
    const {user, userSuccess, userError} = useSelector((state: RootState) => state.USERS)
  

    const loadNotifications = useCallback(async() => {
        setIsRefreshing(true)
        await dispatch(getPostNotifyByAuthUserAction() as any)
        await dispatch(getStoryNotifyByAuthUserAction() as any)
        await dispatch(getFollowNotifyByAuthUserAction() as any)
        await dispatch(getCommentNotifyByAuthUserAction() as any)
        setIsRefreshing(false)
    }, [postNotifies, storyNotifies, followNotifies, commentNotifies, dispatch])

    useEffect(() => {
        setIsLoading(true)
        loadNotifications().then(() => setIsLoading(false))
    }, [dispatch, user])


      if(isLoading) {
        return <LoadingComponent/>
    }

  return (
    <SafeAreaView style={tw('flex-1')}>
     <ScrollView
     style={tw('flex-1')}
     showsVerticalScrollIndicator={false}
     >
      {postNotifies && postNotifies.length > 0 && postNotifies.map((postnoti: POSTNOTIFY) => <PostNotifyItem key={postnoti.id} item={postnoti} authUser={user}></PostNotifyItem>)}
      {commentNotifies && commentNotifies.length > 0 && commentNotifies.map((commentnoti: COMMENTNOTIFY) => <CommentNotifyItem key={commentnoti.id} item={commentnoti} authUser={user}></CommentNotifyItem>)}
      {storyNotifies && storyNotifies.length > 0 && storyNotifies.map((storyNoti: STORYNOTIFY) => <StoryNotifyItem key={storyNoti.id} item={storyNoti} authUser={user}></StoryNotifyItem>)}
      {followNotifies && followNotifies.length > 0 && followNotifies.map((followNoti: FOLLOWNOTIFY) => <FollowNotifyItem key={followNoti.id} item={followNoti} authUser={user}></FollowNotifyItem>)}
      </ScrollView>
    </SafeAreaView >
  )
}

export default NotificationsScreen

const styles = StyleSheet.create({})