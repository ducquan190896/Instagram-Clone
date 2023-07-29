import { StyleSheet, ListRenderItem, Image, Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native'
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react'
import { useNavigation, useRoute, RouteProp, CompositeNavigationProp, useIsFocused} from '@react-navigation/native'
import { NativeStackNavigationProp  } from '@react-navigation/native-stack'
import { RootStackParamList } from '../Navigators/MainStack'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, RootURL } from '../Store/Store'
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
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { UserBottomTabProps } from '../Navigators/UserBottomStack';
import { HomeStackParamList } from '../Navigators/HomeStack'

type OtherUserHomeScreenNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<HomeStackParamList, "OtherUserHomeScreen">,
NativeStackNavigationProp<RootStackParamList>>;

type OtherUserHomeScreenRouteProp = RouteProp<HomeStackParamList, "OtherUserHomeScreen">;

const OtherUserHomeScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isrefreshing, setIsrefreshing] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false)
    const [isFollowing, setIsFollowing] = useState<boolean>(false)
    const navigation = useNavigation<OtherUserHomeScreenNavigationProp>();
    const isFocused = useIsFocused();
    const tw =useTailwind()
    const {params} = useRoute<OtherUserHomeScreenRouteProp>();
    const {userId, isSearch} = params
    const {user, otherUser, userSuccess, userError} = useSelector((state: RootState) => state.USERS)
    const {posts, postSuccess, postError} = useSelector((state: RootState) => state.POSTS)
    const {follows, followSuccess, followError} = useSelector((state : RootState) => state.FOLLOWS)
    const dispatch =useDispatch();

    const backToMainPageNavigation = () => {
        if(isSearch) {
            navigation.navigate('Home');
        } else {
            navigation.goBack();
        }
    }
    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitleVisible: false,
            headerBackVisible: false,
            title: "",
            headerLeft: () => (
                <TouchableOpacity onPress={backToMainPageNavigation} style={tw('flex flex-row items-center mx-2')}>
                    <Ionicons name="arrow-back" size={32} color="black" />
                    <Text style={tw('text-lg text-black ml-4')}>back</Text>
                </TouchableOpacity>
            )
        })
    }, [otherUser])

    const loadOtherUser = useCallback(async () => {
        dispatch(getActiveUserAction(userId) as any)
    }, [otherUser, userSuccess, userId, dispatch, isFollowing])

    const loadPosts = useCallback(async () => {
        if(userId) {
            setIsrefreshing(true);
            await  dispatch(getPostsOfActiveUserAction(userId) as any);
            setIsrefreshing(false);
        }

    }, [otherUser, userId, userSuccess, posts, postSuccess, dispatch])

    const isFollowingAction = useCallback(async () => {
        if(userId) {
            const token = await AsyncStorage.getItem("token")
            const res = await fetch(RootURL + `/api/follow/isFollowByAuthUser/` + userId, {
            method: "GET",
            headers: {
                "Authorization": token ?? ""
            }
        })
        const data = await res.json();
        console.log("isfollowing: ")
        console.log(data)
        setIsFollowing(data)
        }
    }, [userId, user, otherUser, isFollowing, setIsFollowing, dispatch])


    useEffect(() => {
        setIsLoading(true)
        loadOtherUser().then(() => loadPosts()).then(() => setIsLoading(false))
    }, [userId, dispatch])

    useEffect(() => {
        loadOtherUser();
    }, [dispatch, isFollowing])

    useEffect(() => {
        isFollowingAction();
    }, [userId, user, otherUser, isFollowing, setIsFollowing, dispatch])


    const renderPostList: ListRenderItem<any> = ({item}: {item: Post}) => (
        <HomePostCard post={item} isLoading={isLoading} setIsLoading={setIsLoading} navigation={navigation}></HomePostCard>
    )

    const navigateToFollowerScreen = () => {
        console.log("userId: " + otherUser.id);
        navigation.navigate("FollowerScreen", {userId: otherUser.id});
    }

    const navigateToFollowingScreen = () => {
        navigation.navigate("FollowingScreen", {userId: otherUser.id});
    }

    const NavigateToMessageScreen = async () => {
        if (otherUser) {
            console.log("chatpersonId: " + otherUser?.id);
            navigation.navigate("ConversationScreen", {chatPersonId: otherUser?.id});
        }
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

    // if(!isLoading && posts && (posts as Post[]).length <= 0) {
    //     return <View style={tw('flex-1 items-center justify-center')}>
    //                 <Text style={tw('text-lg font-bold text-center')}>No Posts</Text>
    //             </View>
    // }

  return (
    <SafeAreaView style={tw('flex-1 bg-white')}>
        <View style={tw('flex-1')}>
            {otherUser && (
                <>
                    <View style={[tw('bg-white'), styles.shadow]}>
                    <View style={tw('flex-row px-2 items-center justify-center mt-2')}>
                        <View style={tw('items-center justify-center mr-10')}>
                            <Image style={[tw('w-16 h-16 rounded-full bg-white mb-2'), {resizeMode: 'contain'}]} source={otherUser.avatarUrl ? {uri: RootURL + otherUser.avatarUrl}: require("../assets/download.png")}></Image>
                            <Text style={tw('text-lg font-bold text-[#03b1fc]')}>{otherUser.username}</Text>
                        </View>
                        <View style={tw('items-center justify-center mx-2')}>
                            <Text style={tw('text-2xl font-bold text-[#03b1fc]')}>{otherUser.postCounts}</Text>
                            <Text style={tw('text-sm text-gray-500  mt-2')}>Posts</Text>
                        </View>
                        <TouchableOpacity onPress={navigateToFollowerScreen} style={tw('items-center justify-center mx-2')}>
                            <Text style={tw('text-2xl font-bold text-[#03b1fc]')}>{otherUser.followersCount}</Text>
                            <Text style={tw('text-sm text-gray-500  mt-2')}>Followers</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={navigateToFollowingScreen} style={tw('items-center justify-center mx-2')}>
                            <Text style={tw('text-2xl font-bold text-[#03b1fc]')}>{otherUser.followingsCount}</Text>
                            <Text style={tw('text-sm text-gray-500  mt-2')}>Followings</Text>
                        </TouchableOpacity>
                    </View>
                    {user?.id != userId && (
                         <View style={tw('flex-row items-center justify-center px-10 my-2')}>
                            <Button onPress={CheckFollowingFunction} titleStyle={tw('text-[#03b1fc]')} title={isFollowing == true ? "Unfollow" : "Follow"} buttonStyle={tw('rounded-lg bg-gray-200  px-4 mr-10')}></Button>
                            <Button onPress={NavigateToMessageScreen} titleStyle={tw('text-[#03b1fc]')} title="Message" buttonStyle={tw('rounded-lg bg-gray-200 px-6')}></Button>
                        </View>
                    )}
                    </View>
                    {/* <View style={[tw('w-full mb-2 bg-gray-400'), {height: 2}]}></View> */}
                    {!isLoading && posts && (posts as Post[]).length <= 0 && (
                        <View style={tw('flex-1 items-center justify-center')}>
                            <Text style={tw('text-lg font-bold text-center')}>No Posts</Text>
                        </View>
                    )}
                    <FlatList
                        onRefresh={loadPosts}
                        refreshing={isrefreshing}
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

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
    }
})