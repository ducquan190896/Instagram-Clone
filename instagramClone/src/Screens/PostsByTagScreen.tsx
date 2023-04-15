import { StyleSheet, Text, View, ListRenderItem, FlatList } from 'react-native'
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import {  getPostsByTag } from '../Store/Actions/PostsAction'
import { RootState } from '../Store/Store'
import { Post } from '../Store/Reducers/PostsReducer'
import HomePostCard from '../Components/HomePostCard'
import LoadingComponent from '../Components/LoadingComponent'
import { useNavigation, useRoute, RouteProp, CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../Navigators/MainStack'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { HomeStackParamList } from '../Navigators/HomeStack'

type PostsByTagScreenNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<RootStackParamList, "PostsByTagScreen">,
BottomTabNavigationProp<HomeStackParamList>>;

type PostsByTagScreenRouteProp = RouteProp<RootStackParamList, "PostsByTagScreen">;

const PostsByTagScreen = () => {
    const {params} = useRoute<PostsByTagScreenRouteProp>()
    const {tag} = params
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isrefreshing, setIsrefreshing] = useState<boolean>(false);
    const tw = useTailwind()
    const dispatch = useDispatch()
    const navigation = useNavigation<PostsByTagScreenNavigationProp>();
    const {posts, postSuccess, postError} = useSelector((state: RootState) => state.POSTS) 
    const loadPostBytag = useCallback(async ()=> {
        if(tag && tag.length > 0) {
          setIsrefreshing(true);
          await dispatch(getPostsByTag(tag) as any);
          setIsrefreshing(false);
        }
    }, [tag])
  
    useEffect(() => {
      setIsLoading(true)
      loadPostBytag().then(() => setIsLoading(false))
    }, [tag])
  
    useLayoutEffect(() => {
        navigation.setOptions({
            title: "#" + tag
        })
    }, [tag])
    const renderPostList: ListRenderItem<any> = ({item}: {item: Post}) => (
      <HomePostCard post={item} isLoading={isLoading} setIsLoading={setIsLoading}></HomePostCard>  
      )
  
      if(isLoading) {
        return <LoadingComponent/>
    }
  
    if(!isLoading && posts && (posts as Post[]).length <= 0) {
        return <View style={tw('flex-1 items-center justify-center')}>
            <Text style={tw('text-lg font-bold text-center')}>No Posts</Text>
        </View>
    }
  
  
    return (
      <View style={tw('flex-1 bg-white')}>
        <FlatList
                  data={posts}
                  refreshing={isrefreshing}
                  onRefresh={loadPostBytag}
                  keyExtractor={(item: any) => item.id}
                  renderItem={renderPostList}
                  showsVerticalScrollIndicator={false}
                  >
          </FlatList>
      </View>
    )
}

export default PostsByTagScreen

const styles = StyleSheet.create({})