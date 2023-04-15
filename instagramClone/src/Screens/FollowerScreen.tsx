import { Image, ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useRoute, CompositeNavigationProp, useNavigation, RouteProp} from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, RootURL } from '../Store/Store'
import { getFollowersAction, resetFollow } from '../Store/Actions/FollowAction'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTailwind } from 'tailwind-rn/dist'
import { FlatList } from 'react-native-gesture-handler'
import { FOLLOW } from '../Store/Reducers/FollowReducer'
import { Button } from '@rneui/base'
import LoadingComponent from '../Components/LoadingComponent'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { UserBottomTabProps } from '../Navigators/UserBottomStack';
import { HomeStackParamList } from '../Navigators/HomeStack'
import { RootStackParamList } from '../Navigators/MainStack'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

type FollowerScreenNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<HomeStackParamList, "FollowerScreen">,
NativeStackNavigationProp<RootStackParamList>>;

type FollowerScreenRouteProp = RouteProp<HomeStackParamList, "FollowerScreen">;

// get all followings people in the follows in the follower screen, the userId is the follower in the follow
const FollowerScreen = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isrefreshing, setIsrefreshing] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const {params} = useRoute<FollowerScreenRouteProp>()
  const {userId} = params;
  const navigation = useNavigation<FollowerScreenNavigationProp>();
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
    navigation.navigate("OtherUserHomeScreen", {userId: userId, isSearch: true});
  }

  const renderPostList: ListRenderItem<any> = ({item}: {item: FOLLOW}) => (
    <TouchableOpacity onPress={() => navigateToOtherUserHomeScreen(item?.following?.id)} style={tw('w-full border-b border-gray-300 flex-row items-center justify-start px-6 py-2 my-2 mb-4')}>
      <Image style={tw('w-20 h-20 rounded-full mr-14')} source={item?.following?.avatarUrl ? {uri: RootURL + item?.following?.avatarUrl} : require("../assets/download.png")}></Image>
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

export default FollowerScreen

const styles = StyleSheet.create({})