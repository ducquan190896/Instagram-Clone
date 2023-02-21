import {  Image, ListRenderItem,  StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTailwind } from 'tailwind-rn/dist'
import PostDummyData from "../Data/Posts.json"
import { Post } from '../Store/Reducers/PostsReducer'
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons'
import { FontAwesome5 } from '@expo/vector-icons'; 
import { Fontisto } from '@expo/vector-icons';  
import HomePostCard from '../Components/HomePostCard'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../Store/Store'
import { getPostsOfFollowingsAndAuthUser, ResetPosts } from '../Store/Actions/PostsAction'
import LoadingComponent from '../Components/LoadingComponent'
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';

import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../Navigators/MainStack'
import StoryList from '../Components/Story/StoryList'
import { getStoriesOfFollowingsAction } from '../Store/Actions/StoryAction'

const HomeScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    const tw = useTailwind()
    const dispatch = useDispatch()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    // console.log(posts)
    const {posts, postSuccess, postError, message} = useSelector((state: RootState) => state.POSTS)
    const {stories, storySuccess, storyError} = useSelector((state: RootState) => state.STORIES)

    const renderPostList: ListRenderItem<any> = ({item}: {item: Post}) => (
    <HomePostCard post={item} isLoading={isLoading} setIsLoading={setIsLoading}></HomePostCard>  
    )


    const loadPostsMainPage = useCallback(async () => {
       await dispatch(getPostsOfFollowingsAndAuthUser() as any)
    
    }, [posts, postSuccess, dispatch])

    const loadStoryMainPage = useCallback(async () => {
        await dispatch(getStoriesOfFollowingsAction() as any)
    }, [stories, dispatch, storySuccess])


    useEffect(() => {
        setIsLoading(true)
        loadPostsMainPage().then(() => loadStoryMainPage()).then(() => setIsLoading(false))
    }, [postSuccess, dispatch, storySuccess])

    // useEffect(() => {
    //     if(postSuccess || postError) {
    //         dispatch(ResetPosts() as any)
            
    //     }
    //     if(postError) {
    //         setIsError(true)
    //         setTimeout(() => {
    //             setIsError(false)
    //         }, 300)
    //     }
    // }, [postSuccess, postError])

    useEffect(() => {
        console.log(posts)
    }, [postSuccess])

    


    if(isError) {
        return <View style={tw('flex-1 items-center justify-center')}>
            <Text style={tw('text-lg font-bold text-center')}>Error</Text>
        </View>
    }

    if(isLoading) {
        return <LoadingComponent/>
    }

    if(!isLoading && posts && (posts as Post[]).length <= 0) {
        return <View style={tw('flex-1 items-center justify-center')}>
            <Text style={tw('text-lg font-bold text-center')}>No Posts</Text>
        </View>
    }

  return (
    <SafeAreaView style={tw('flex-1')}>
    <View style={tw('w-full flex-row px-2 items-center justify-between')}>
        <Image style={[tw('w-32 h-14 -z-10'), {resizeMode: 'contain'}]} source={require("../assets/logo.png")}></Image>
        <View style={tw('flex-row items-center')}>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}  style={tw('mr-4')}>
                <Text>Go Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={tw('mr-4')}>
                <Feather name="plus-square" size={28} color="black" />
            </TouchableOpacity>
                <TouchableOpacity style={tw('mr-4')}>
                     <FontAwesome5 name="heart" size={28} color="black" />
                </TouchableOpacity>
            <TouchableOpacity style={tw('mr-2')}>
                <FontAwesome5 name="telegram-plane" size={28} color="black" />
            </TouchableOpacity>
        </View>
    </View>
    
   <View style={tw('w-full flex-row py-2 border-b border-t border-gray-300 px-2 items-center justify-between')}>
       
        <StoryList navigation={navigation} stories={stories}></StoryList>
   </View>
    <FlatList
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