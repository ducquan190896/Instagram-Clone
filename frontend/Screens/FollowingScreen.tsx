import { Image, ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../Store/Store'
import { getFollowersAction, getFollowingsAction, resetFollow } from '../Store/Actions/FollowAction'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTailwind } from 'tailwind-rn/dist'
import { FlatList } from 'react-native-gesture-handler'
import { FOLLOW } from '../Store/Reducers/FollowReducer'
import { Button } from '@rneui/base'
import LoadingComponent from '../Components/LoadingComponent'

//get all followers people in the follows in the following screen, the userId is the following in the follow
const FollowingScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    // const {params} = useRoute()
    // const {userId} = params
    const userId = 3
    const dispatch = useDispatch()
    const tw = useTailwind()
  
    const {follows, followSuccess, followError} = useSelector((state : RootState) => state.FOLLOWS)
  
    const loadFollowings = useCallback( async () => {
     if(userId) {
      dispatch(getFollowingsAction(userId) as any)
     }
  
    }, [userId, follows, followSuccess, dispatch])
    
    useEffect(() => {
      setIsLoading(true)
      loadFollowings().then(() => setIsLoading(false))
    }, [userId, dispatch]) 
  
    useEffect(() => {
      if(followSuccess) {
        dispatch(resetFollow() as any)
      }
      if(followError) {
        setIsError(true)
        dispatch(resetFollow() as any)
        setTimeout(() => {    
          setIsError(false)
        }, 3000);
      }
  
    }, [followSuccess, followError, dispatch])

    const navigateToOtherUserHomeScreen = (userId: number) => {
        //navigation.navigate("OtherUserHomeScreen", {userId: userId})
    }
  
    const renderPostList: ListRenderItem<any> = ({item}: {item: FOLLOW}) => (
      <TouchableOpacity onPress={() => navigateToOtherUserHomeScreen(item.follower.id)} style={tw('w-full border-b border-gray-300 flex-row items-center justify-start px-6 py-2 my-2 mb-4')}>
     
        <Image style={tw('w-20 h-20 rounded-full mr-14')} source={item.follower.avatarUrl ? {uri: item.follower.avatarUrl} : require("../assets/download.png")}></Image>
        <Text style={tw('text-lg font-bold')}>{item.follower.username}</Text>
   
      </TouchableOpacity>
    )
  
    if(isError) {
      return <View style={tw('flex-1 items-center justify-center')}>
          <Text style={tw('text-lg font-bold text-center')}>Error</Text>
      </View>
  }
  
  if(isLoading) {
      return <LoadingComponent/>
  }
  
  if(!isLoading && follows && (follows as FOLLOW[]).length <= 0) {
      return <View style={tw('flex-1 items-center justify-center')}>
          <Text style={tw('text-lg font-bold text-center')}>No Posts</Text>
      </View>
  }
  
  
    return (
      <SafeAreaView style={tw('flex-1')}>
         <FlatList 
                   data={follows}
                  keyExtractor={(item: any) => item.id}
                  renderItem={renderPostList}
                  showsVerticalScrollIndicator={false}
                  
                  >
          </FlatList>
      </SafeAreaView>
    )
}

export default FollowingScreen

const styles = StyleSheet.create({})