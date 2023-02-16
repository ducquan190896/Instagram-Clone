import { StyleSheet, ListRenderItem, Image, Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native'
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../Navigators/MainStack'
import { Ionicons } from '@expo/vector-icons'
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../Store/Store'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@rneui/base'
import { getPostsOfActiveUserAction, getPostsOfAuthUser, ResetPosts } from '../Store/Actions/PostsAction'
import LoadingComponent from '../Components/LoadingComponent'
import { Post } from '../Store/Reducers/PostsReducer'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import HomePostCard from '../Components/HomePostCard'
import { DeactivateUser, getActiveUserAction } from '../Store/Actions/UserAction'
import { addFollowAction, removeFollowAction } from '../Store/Actions/FollowAction'
import AsyncStorage from '@react-native-async-storage/async-storage'

const OtherUserHomeScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    const [isFollowing, setIsFollowing] = useState<boolean>(false)
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const tw =useTailwind()
    // const {params} = useRoute()
    // const {userId} = params
    const userId  = 2

    const {user, otherUser, userSuccess, userError} = useSelector((state: RootState) => state.USERS)
    const {posts, postSuccess, postError} = useSelector((state: RootState) => state.POSTS)
    const {follows, followSuccess, followError} = useSelector((state : RootState) => state.FOLLOWS)
    const dispatch =useDispatch()

    const backToMainPageNavigation = () => {
        navigation.goBack()
    }


    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitleVisible: false,
            headerBackVisible: false,
            title: "",
            headerLeft: () => (
                <TouchableOpacity onPress={backToMainPageNavigation} style={tw('flex flex-row items-center mx-2')}>
                    <Ionicons name="arrow-back" size={32} color="black" />
                    <Text style={tw('text-lg font-bold ml-4')}>Back</Text>
                </TouchableOpacity>
            )

        })
    })

    const loadOtherUser = useCallback(async () => {
        dispatch(getActiveUserAction(userId) as any)
    }, [otherUser, userSuccess, userId, dispatch])

    const loadPosts = useCallback(async () => {
        if(userId) {
          await  dispatch(getPostsOfActiveUserAction(userId) as any)
        }

    }, [otherUser, userId, userSuccess, posts, postSuccess, dispatch])

    const isFollowingAction = useCallback(async () => {
        if(userId) {
            const token = await AsyncStorage.getItem("token")
            const res = await fetch(`http://10.0.2.2:8080/api/follow/isFollowByAuthUser/2`, {
            method: "GET",
            headers: {
                "Authorization": token ?? ""
            }
        })
     
        const data = await res.json()
        console.log(data)
        setIsFollowing(data)
        }
    }, [userId, user, isFollowing, setIsFollowing])


    useEffect(() => {
        setIsLoading(true)
        loadOtherUser().then(() => loadPosts()).then(() => isFollowingAction()).then(() => setIsLoading(false))
    }, [userId, dispatch])

    useEffect(() => {
        if(postSuccess || postError) {
            dispatch(ResetPosts() as any)
            
        }
        if(postError) {
            setIsError(true)
            setTimeout(() => {
                setIsError(false)
            }, 300)
        }
    }, [postSuccess, postError])

    const renderPostList: ListRenderItem<any> = ({item}: {item: Post}) => (
        <HomePostCard post={item} isLoading={isLoading} setIsLoading={setIsLoading}></HomePostCard>  
        )

    
    const navigateToFollowerScreen = () => {
        // navigation.navigate("FollowerScreen", {userId: user.id})
    }

    const navigateToFollowingScreen = () => {
        // navigation.navigate("FollowingScreen", {userId: user.id})
    }

   

    const NavigateToMessageScreen = async () => {
        // navigation.navigate("MessageScreen")
    }

    const CheckFollowingFunction = async () => {
        if(!isFollowing && userId && user) {
          await  dispatch(addFollowAction(userId) as any)
        //   setIsFollowing(true)
        isFollowingAction()
        }
        if(isFollowing && userId && user) {
           await  dispatch(removeFollowAction(userId) as any)
        //    setIsFollowing(false)
        isFollowingAction()
        }

    }

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
                <View style={tw('flex-1')}>
                   {otherUser && (
                <>
                <View style={tw('flex-row px-2 items-center justify-center')}>
                    <View style={tw('items-center justify-center mr-10')}>
                        <Image style={[tw('w-16 h-16 rounded-full bg-white mb-2'), {resizeMode: 'contain'}]} source={otherUser.avatarUrl ? {uri: otherUser.avatarUrl}: require("../assets/download.png")}></Image>
                        <Text style={tw('text-lg font-bold')}>{otherUser.username}</Text>
                    </View>
                    <View style={tw('items-center justify-center mx-2')}>
                        <Text style={tw('text-2xl font-bold')}>{otherUser.postCounts}</Text>
                        <Text style={tw('text-lg   mt-2')}>Posts</Text>              
                    </View>
                    <TouchableOpacity onPress={navigateToFollowerScreen} style={tw('items-center justify-center mx-2')}>
                        <Text style={tw('text-2xl font-bold')}>{otherUser.followersCount}</Text>
                        <Text style={tw('text-lg   mt-2')}>Followers</Text>              
                    </TouchableOpacity>
                    <TouchableOpacity onPress={navigateToFollowingScreen} style={tw('items-center justify-center mx-2')}>
                        <Text style={tw('text-2xl font-bold')}>{otherUser.followingsCount}</Text>
                        <Text style={tw('text-lg   mt-2')}>Followings</Text>              
                    </TouchableOpacity>

                </View>
                <View style={tw('flex-row items-center justify-center px-10 my-2')}>
                    <Button onPress={CheckFollowingFunction} titleStyle={tw('text-black')} title={isFollowing ? "Unfollow" : "Following"} buttonStyle={tw('rounded-lg bg-gray-300  px-4 mr-10')}></Button>
                    <Button onPress={NavigateToMessageScreen} titleStyle={tw('text-black')} title="Message" buttonStyle={tw('rounded-lg bg-gray-300 px-6')}></Button>
                </View>
                
                <View style={[tw('w-full mb-2 bg-gray-400'), {height: 2}]}></View>
                
                <FlatList
                 data={posts}
                keyExtractor={(item: any) => item.id}
                renderItem={renderPostList}
                showsVerticalScrollIndicator={false}
                >
                </FlatList>
               
                </>
                   )}
                </View>
            </SafeAreaView>
  
  )
}

export default OtherUserHomeScreen

const styles = StyleSheet.create({})