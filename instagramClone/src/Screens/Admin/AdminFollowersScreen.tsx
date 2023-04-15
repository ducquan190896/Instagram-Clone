import { Image, ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useRoute, CompositeNavigationProp, useNavigation, RouteProp } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTailwind } from 'tailwind-rn/dist'
import { FlatList } from 'react-native-gesture-handler'
import { Button } from '@rneui/base'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { HomeStackParamList } from '../../Navigators/HomeStack'
import LoadingComponent from '../../Components/LoadingComponent'
import { FOLLOW } from '../../Store/Reducers/FollowReducer'
import { getFollowersAction, getFollowingsAction } from '../../Store/Actions/FollowAction'
import { RootState, RootURL } from '../../Store/Store'
import { RootStackParamList } from '../../Navigators/MainStack'

type FollowingScreenRouteProp = RouteProp<RootStackParamList, "AdminFollowersScreen">;

const AdminFollowersScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isrefreshing, setIsrefreshing] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    const {params} = useRoute<FollowingScreenRouteProp>()
    const {userId} = params;
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useDispatch()
    const tw = useTailwind()
    const {follows, followSuccess, followError} = useSelector((state : RootState) => state.FOLLOWS)
    const loadFollowers = useCallback( async () => {
     if(userId) {
      setIsrefreshing(true);
      console.log("userId: " + userId);
      await dispatch(getFollowersAction(userId) as any);
      setIsrefreshing(false);
     }
    }, [userId, follows, followSuccess, dispatch])
    
    useEffect(() => {
      setIsLoading(true)
      loadFollowers().then(() => setIsLoading(false))
    }, [userId, dispatch]) 
  
    const navigateToOtherUserHomeScreen = (userId: number) => {
        navigation.navigate("AdminOtherUserHomeScreen", {userId: userId});
    }
  
    const renderPostList: ListRenderItem<any> = ({item}: {item: FOLLOW}) => (
      <TouchableOpacity onPress={() => navigateToOtherUserHomeScreen(item?.following?.id)} style={tw('w-full border-b border-gray-300 flex-row items-center justify-start px-6 py-2 my-2 mb-4')}>
        <Image style={tw('w-20 h-20 rounded-full mr-14')} source={item?.following?.avatarUrl ? {uri: RootURL + item?.following?.avatarUrl} : require("../../assets/download.png")}></Image>
        <Text style={tw('text-lg font-bold text-black')}>{item?.following?.username}</Text>
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
                <Text style={tw('text-lg font-bold text-center')}>No Followers</Text>
            </View>
    }
  
  
    return (
      <SafeAreaView style={tw('flex-1')}>
          <FlatList 
            data={follows}
            keyExtractor={(item: any) => item.id}
            renderItem={renderPostList}
            showsVerticalScrollIndicator={false}
            refreshing={isrefreshing}    
            onRefresh={loadFollowers}
          >
          </FlatList>
      </SafeAreaView>
    )
}

export default AdminFollowersScreen

const styles = StyleSheet.create({})