import { StyleSheet, ListRenderItem, Image, Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native'
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react'
import { useNavigation, useRoute, RouteProp, CompositeNavigationProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../Navigators/MainStack'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, RootURL } from '../../Store/Store'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@rneui/base'
import { getPostsOfActiveUserAction, getPostsOfAuthUser, ResetPosts } from '../../Store/Actions/PostsAction'
import LoadingComponent from '../../Components/LoadingComponent'
import { Post } from '../../Store/Reducers/PostsReducer'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import HomePostCard from '../../Components/HomePostCard'
import { DeactivateUser, deleteUserAction, getActiveUserAction } from '../../Store/Actions/UserAction'
import { addFollowAction, removeFollowAction } from '../../Store/Actions/FollowAction'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AdminPostCard from '../../Components/AdminPostCard'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { UserBottomTabProps } from '../../Navigators/UserBottomStack'


type AdminOtherUserHomeScreenRouteProp = RouteProp<RootStackParamList, "AdminOtherUserHomeScreen">

const AdminOtherUserHomeScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const tw =useTailwind()
    const {params} = useRoute<AdminOtherUserHomeScreenRouteProp>()
    const {userId} = params
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
                    <Text style={tw('text-lg font-bold ml-4 text-black')}>Back</Text>
                </TouchableOpacity>
            )
        })
    })

    const loadOtherUser = useCallback(async () => {
        dispatch(getActiveUserAction(userId) as any)
    }, [userId, dispatch])

    const loadPosts = useCallback(async () => {
        if(userId) {
          await  dispatch(getPostsOfActiveUserAction(userId) as any)
        }
    }, [ userId, dispatch])

    useEffect(() => {
        setIsLoading(true)
        loadOtherUser().then(() => loadPosts()).then(() => setIsLoading(false))
    }, [userId, dispatch])

    const renderPostList: ListRenderItem<any> = ({item}: {item: Post}) => (
        <AdminPostCard post={item}></AdminPostCard>  
    )
    
    const navigateToFollowerScreen = () => {
        navigation.navigate("AdminFollowersScreen", {userId: user.id})
    }

    const navigateToFollowingScreen = () => {
        navigation.navigate("AdminFollowingScreen", {userId: user.id})
    }

    const deleteUserFunction = async () => {
        await dispatch(deleteUserAction(otherUser?.id) as any)
        navigation.goBack()
    }

    if(isError) {
        return <View style={tw('flex-1 items-center justify-center')}>
                    <Text style={tw('text-lg font-bold text-center')}>Error</Text>
                </View>
    }

    if(isLoading) {
        return <LoadingComponent/>
    }

  return (
    <SafeAreaView style={tw('flex-1')}>
        <View style={tw('flex-1')}>
            {otherUser && (
                <>
                    <View style={tw('flex-row px-2 items-center justify-center')}>
                        <View style={tw('items-center justify-center mr-10')}>
                            <Image style={[tw('w-16 h-16 rounded-full bg-white mb-2'), {resizeMode: 'contain'}]} source={otherUser.avatarUrl ? {uri: RootURL + otherUser.avatarUrl}: require("../../assets/download.png")}></Image>
                            <Text style={tw('text-lg font-bold text-black')}>{otherUser.username}</Text>
                        </View>
                        <View style={tw('items-center justify-center mx-2')}>
                            <Text style={tw('text-lg text-lg font-bold text-black')}>{otherUser.postCounts}</Text>
                            <Text style={tw('text-base text-black  mt-2')}>Posts</Text>              
                        </View>
                        <TouchableOpacity onPress={navigateToFollowerScreen} style={tw('items-center justify-center mx-2')}>
                            <Text style={tw('text-lg text-lg font-bold text-black')}>{otherUser.followersCount}</Text>
                            <Text style={tw('text-base text-black  mt-2')}>Followers</Text>              
                        </TouchableOpacity>
                        <TouchableOpacity onPress={navigateToFollowingScreen} style={tw('items-center justify-center mx-2')}>
                            <Text style={tw('text-lg text-lg font-bold text-black')}>{otherUser.followingsCount}</Text>
                            <Text style={tw('text-base text-black  mt-2')}>Followings</Text>              
                        </TouchableOpacity>
                    </View>
                    <View style={tw('flex-row items-center justify-center px-10 my-2')}>                        
                        <View style={tw('rounded-lg bg-gray-300  px-4 mr-10 py-2')}>
                            <Text  style={tw('text-black font-bold')}>{otherUser?.role}</Text>
                        </View>
                        <Button onPress={deleteUserFunction} titleStyle={tw('text-black')} title="Delete User" buttonStyle={tw('rounded-lg bg-gray-300 px-6')}></Button>
                    </View>                   
                    <View style={[tw('w-full mb-2 bg-gray-400'), {height: 2}]}></View>
                    { !isLoading && posts && (posts as Post[]).length <= 0 && (
                        <View style={tw('flex-1 items-center justify-center')}>
                                <Text style={tw('text-lg font-bold text-center')}>No Posts</Text>
                        </View>
                    )}
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

export default AdminOtherUserHomeScreen

const styles = StyleSheet.create({})