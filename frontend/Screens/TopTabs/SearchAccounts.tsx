import { StyleSheet, Text, View, ListRenderItem, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import { getPostsBySearchKeyword } from '../../Store/Actions/PostsAction'
import { RootState } from '../../Store/Store'
import { Post } from '../../Store/Reducers/PostsReducer'
import HomePostCard from '../../Components/HomePostCard'
import LoadingComponent from '../../Components/LoadingComponent'
import { getActiveUserBySearchKeyword, ResetUser } from '../../Store/Actions/UserAction'

import { USER } from '../../Store/Reducers/UserReducer'
 type searchProps = {
  keyword: string
}
const SearchAccounts = ({keyword}: searchProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const tw = useTailwind()
  const dispatch = useDispatch()

  const {users, userSuccess, userError} = useSelector((state: RootState) => state.USERS)

  const loadActiveUsersByKeyword = useCallback(async ()=> {
      if(keyword && keyword.length > 0) {
        dispatch(getActiveUserBySearchKeyword(keyword) as any)
      }
  }, [keyword])

  useEffect(() => {
    setIsLoading(true)
    loadActiveUsersByKeyword().then(() => setIsLoading(false))
  }, [keyword])

  useEffect(() => {
    if(userSuccess || userError) {
      dispatch(ResetUser() as any)
    }
  }, [userSuccess, userError])

  const navigateToOtherUserHomeScreen = (userId: number) => {
    //navigation.navigate("OtherUserHomeScreen", {userId: userId})
}

  const renderPostList: ListRenderItem<any> = ({item}: {item: USER}) => (
    <TouchableOpacity onPress={() => navigateToOtherUserHomeScreen(item.id)} style={tw('w-full border-b border-gray-300 flex-row items-center justify-start px-6 py-2 my-2 mb-4')}>
     
        <Image style={tw('w-20 h-20 rounded-full mr-14')} source={item.avatarUrl ? {uri: item.avatarUrl} : require("../../assets/download.png")}></Image>
        <Text style={tw('text-lg font-bold')}>{item.username}</Text>
   
      </TouchableOpacity> 
    )

    if(isLoading) {
      return <LoadingComponent/>
  }

  if(!isLoading && users && (users as Post[]).length <= 0) {
      return <View style={tw('flex-1 items-center justify-center')}>
                <Text style={tw('text-lg font-bold text-center')}>No users</Text>
              </View>
  }


  return (
    <View style={tw('flex-1')}>
      <FlatList
                 data={users}
                keyExtractor={(item: any) => item.id}
                renderItem={renderPostList}
                showsVerticalScrollIndicator={false}
                >
        </FlatList>
    </View>
  )
}

export default SearchAccounts

const styles = StyleSheet.create({})