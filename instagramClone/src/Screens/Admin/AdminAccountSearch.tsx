import { StyleSheet, Text, View, ListRenderItem, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import { getPostsBySearchKeyword } from '../../Store/Actions/PostsAction'
import { RootState, RootURL } from '../../Store/Store'
import { Post } from '../../Store/Reducers/PostsReducer'
import HomePostCard from '../../Components/HomePostCard'
import LoadingComponent from '../../Components/LoadingComponent'
import { getActiveUserBySearchKeyword, getAllUsersForAdminAction, getUsersBySearchKeywordForAdminAction, ResetUser } from '../../Store/Actions/UserAction'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../Navigators/MainStack'
import { USER } from '../../Store/Reducers/UserReducer'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'

type searchProps = {
  keyword: string
}

const AdminAccountSearch = ({keyword}: searchProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const tw = useTailwind()
    const dispatch = useDispatch()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const {users, userSuccess, userError} = useSelector((state: RootState) => state.USERS)
    const loadUsersByKeyword = useCallback(async ()=> {
        if(keyword && keyword.length > 0) {
          dispatch(getUsersBySearchKeywordForAdminAction(keyword) as any)
        }
    }, [keyword])
    const loadAllUsers = useCallback(async ()=> {
      if(!keyword) {
        dispatch(getAllUsersForAdminAction() as any)
      }
    }, [keyword])
  
    useEffect(() => {
      setIsLoading(true)
      if (keyword) {
        loadUsersByKeyword().then(() => setIsLoading(false))
      } else {
        loadAllUsers().then(() => setIsLoading(false))
      }
    }, [keyword])
  
  
    const navigateToOtherUserHomeScreen = (userId: number) => {
      navigation.navigate("AdminOtherUserHomeScreen", {userId: userId});
    }
  
    const renderPostList: ListRenderItem<any> = ({item}: {item: USER}) => (
      <TouchableOpacity onPress={() => navigateToOtherUserHomeScreen(item.id)} style={tw('w-full border-b border-gray-300 flex-row items-center justify-start px-6 py-2 my-2 mb-4')}>
          <Image style={tw('w-20 h-20 rounded-full mr-14')} source={item.avatarUrl ? {uri: RootURL + item.avatarUrl} : require("../../assets/download.png")}></Image>
          <Text style={tw('text-lg font-bold')}>{item.username}</Text>     
      </TouchableOpacity> 
    )
  
    if (isLoading) {
      return <LoadingComponent/>
    }
  
    if (!isLoading && users && (users as Post[]).length <= 0) {
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

export default AdminAccountSearch

const styles = StyleSheet.create({})