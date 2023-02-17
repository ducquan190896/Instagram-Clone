import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../Store/Store'
import { useTailwind } from 'tailwind-rn/dist'
import { getCommentsOfPost } from '../Store/Actions/CommentAction'
import { COMMENT } from '../Store/Reducers/CommentReducer'
import LoadingComponent from '../Components/LoadingComponent'

const CommentScreen = () => {
    //const {params} = useRoute()
    //const {postId} = params
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const postId = 2
    const dispatch = useDispatch()
    const tw = useTailwind()
    const {comments, commentSuccess, commentError, comment} = useSelector((state: RootState) => state.COMMENTS);

    const loadCommentsOfPost = useCallback(async () => {
        dispatch(getCommentsOfPost(postId) as any)
    }, [postId, comments, commentSuccess])

    useEffect(() => {
        setIsLoading(true)
        loadCommentsOfPost().then(() => setIsLoading(false))
    }, [postId])

    if(isLoading) {
        return <LoadingComponent/>
    }
  
    if(!isLoading && comments && (comments as COMMENT[]).length <= 0) {
        return <View style={tw('flex-1 items-center justify-center')}>
                  <Text style={tw('text-lg font-bold text-center')}>No comments</Text>
                </View>
    }

  return (
    <View>
      <Text>CommentScreen</Text>
    </View>
  )
}

export default CommentScreen

const styles = StyleSheet.create({})