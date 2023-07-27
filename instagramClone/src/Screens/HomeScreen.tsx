import {  Image, ListRenderItem,  StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTailwind } from 'tailwind-rn/dist'
import { Post } from '../Store/Reducers/PostsReducer'
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomePostCard from '../Components/HomePostCard'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../Store/Store'
import { getPostsOfFollowingsAndAuthUser, ResetPosts } from '../Store/Actions/PostsAction'
import LoadingComponent from '../Components/LoadingComponent'
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { useNavigation, CompositeNavigationProp, useIsFocused } from '@react-navigation/native';
import { RootStackParamList } from '../Navigators/MainStack'
import StoryList from '../Components/Story/StoryList'
import { getStoriesOfFollowingsAction } from '../Store/Actions/StoryAction'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { HomeStackParamList } from '../Navigators/HomeStack'

type HomeScreenNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<HomeStackParamList, "Home">,
NativeStackNavigationProp<RootStackParamList>>;

const HomeScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    const tw = useTailwind();
    const dispatch = useDispatch();
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const isFocused = useIsFocused();
    const {posts, postSuccess, postError, message} = useSelector((state: RootState) => state.POSTS);
    const {stories, storySuccess, storyError} = useSelector((state: RootState) => state.STORIES);

    const renderPostList: ListRenderItem<any> = ({item}: {item: Post}) => (
        <HomePostCard post={item} isLoading={isLoading} setIsLoading={setIsLoading} navigation={navigation}></HomePostCard>  
    );

    const loadPostsMainPage = useCallback(async () => {
        setIsRefreshing(true);
        await dispatch(getPostsOfFollowingsAndAuthUser() as any)
        setIsRefreshing(false);
    }, [posts, dispatch, navigation, isFocused])

    // const loadPostsMainPage = async () => {
    //     setIsRefreshing(true);
    //     await dispatch(getPostsOfFollowingsAndAuthUser() as any)
    //     setIsRefreshing(false);
    // }

    const loadStoryMainPage = useCallback(async () => {
        await dispatch(getStoriesOfFollowingsAction() as any)
    }, [stories, dispatch, storySuccess, isFocused])


    useEffect(() => {
        setIsLoading(true)
        loadPostsMainPage().then(() => loadStoryMainPage()).then(() => setIsLoading(false))
    }, [ dispatch, navigation, isFocused])


    if(isError) {
        return  <View style={tw('flex-1 items-center justify-center')}>
                    <Text style={tw('text-lg font-bold text-center')}>Error</Text>
                </View>
    }

    if(isLoading) {
        return <LoadingComponent/>
    }

    // if(!isLoading && posts && (posts as Post[]).length <= 0) {
    //     return  <View style={tw('flex-1 items-center justify-center')}>
    //                 <Text style={tw('text-lg font-bold text-center')}>No Posts</Text>
    //             </View>
    // }

  return (
    <SafeAreaView style={tw('flex-1')}>
        <View style={tw('w-full flex-row px-2 items-center justify-between')}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}  style={tw('mr-4 ml-2')}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <View style={tw('flex-1 items-start justify-center')}>
                <Image style={[tw(''), {resizeMode: 'contain', zIndex: -10, height: 60, width: 150}]} source={require("../assets/logo.png")}></Image>
            </View>
            <View style={tw('flex-row items-center')}>
                <TouchableOpacity onPress={() => navigation.navigate("UserBottomStack", {screen: "CreatePostForm"})} style={tw('mr-4')}>
                    <Feather name="plus-square" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("ChatsScreen")} style={tw('mr-2')}>
                    <FontAwesome5 name="telegram-plane" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View> 
        <View style={tw('w-full flex-row py-2 border-b border-t border-gray-300 px-2 items-center justify-between')}> 
            <StoryList navigation={navigation} stories={stories}></StoryList>
        </View>
        {!isLoading && posts && (posts as Post[]).length <= 0 && (
                        <View style={tw('flex-1 items-center justify-center')}>
                            <Text style={tw('text-lg font-bold text-center')}>No Posts</Text>
                        </View>
        )}
        <FlatList
            onRefresh={loadPostsMainPage}
            refreshing={isRefreshing}
            data={posts}
            keyExtractor={(item: any) => item.id}
            renderItem={renderPostList}
            showsVerticalScrollIndicator={false}
        >
        </FlatList>
    </SafeAreaView> 
  )
}

export default HomeScreen

const styles = StyleSheet.create({})