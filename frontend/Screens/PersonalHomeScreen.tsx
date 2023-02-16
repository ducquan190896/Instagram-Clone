import { StyleSheet, ListRenderItem, Image, Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native'
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../Navigators/MainStack'
import { Ionicons } from '@expo/vector-icons'
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../Store/Store'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@rneui/base'
import { getPostsOfAuthUser, ResetPosts } from '../Store/Actions/PostsAction'
import LoadingComponent from '../Components/LoadingComponent'
import { Post } from '../Store/Reducers/PostsReducer'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import HomePostCard from '../Components/HomePostCard'
import { DeactivateUser } from '../Store/Actions/UserAction'

const PersonalHomeScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const tw =useTailwind()


    const {user, userSuccess, userError} = useSelector((state: RootState) => state.USERS)
    const {posts, postSuccess, postError} = useSelector((state: RootState) => state.POSTS)
    const dispatch =useDispatch()

    const backToMainPageNavigation = () => {
        // navigation.navigate("Home")
    }


    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitleVisible: false,
            headerBackVisible: false,
            title: "",
            headerLeft: () => (
                <TouchableOpacity onPress={backToMainPageNavigation} style={tw('flex flex-row items-center mx-2')}>
                    <Ionicons name="arrow-back" size={32} color="black" />
                    <Text style={tw('text-lg font-bold ml-4')}>Main Page</Text>
                </TouchableOpacity>
            )

        })
    })

    const loadPosts = useCallback(async () => {
        if(user) {
          await  dispatch(getPostsOfAuthUser() as any)
        }

    }, [user, userSuccess, posts, postSuccess])

    useEffect(() => {
        setIsLoading(true)
        loadPosts().then(() => setIsLoading(false))
    }, [user])

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

    const navigateToChangePasswordScreen = () => {
        // navigation.navigate("ChangePasswordScreen")
    }

    const deactivateAccountFunction = async () => {
        await dispatch(DeactivateUser() as any)
        Alert.alert("deactivated successfully")
        navigation.navigate("Login")
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
    // <KeyboardAwareScrollView style={tw('flex-1')} extraHeight={120}>
    //     <TouchableWithoutFeedback style={tw('flex-1')} onPress={Keyboard.dismiss} >
            <SafeAreaView style={tw('flex-1')}>
                <View style={tw('flex-1')}>
                   {user && (
                <>
                <View style={tw('flex-row px-2 items-center justify-center')}>
                    <View style={tw('items-center justify-center mr-10')}>
                        <Image style={[tw('w-16 h-16 rounded-full bg-white mb-2'), {resizeMode: 'contain'}]} source={user.avatarUrl ? {uri: user.avatarUrl}: require("../assets/download.png")}></Image>
                        <Text style={tw('text-lg font-bold')}>{user.username}</Text>
                    </View>
                    <View style={tw('items-center justify-center mx-2')}>
                        <Text style={tw('text-2xl font-bold')}>{user.postCounts}</Text>
                        <Text style={tw('text-lg   mt-2')}>Posts</Text>              
                    </View>
                    <TouchableOpacity onPress={navigateToFollowerScreen} style={tw('items-center justify-center mx-2')}>
                        <Text style={tw('text-2xl font-bold')}>{user.followersCount}</Text>
                        <Text style={tw('text-lg   mt-2')}>Followers</Text>              
                    </TouchableOpacity>
                    <TouchableOpacity onPress={navigateToFollowingScreen} style={tw('items-center justify-center mx-2')}>
                        <Text style={tw('text-2xl font-bold')}>{user.followingsCount}</Text>
                        <Text style={tw('text-lg   mt-2')}>Followings</Text>              
                    </TouchableOpacity>

                </View>
                <View style={tw('flex-row items-center justify-between px-10 my-2')}>
                    <Button onPress={navigateToChangePasswordScreen} titleStyle={tw('text-black')} title="Edit Password" buttonStyle={tw('rounded-lg bg-gray-300  px-4')}></Button>
                    <Button onPress={deactivateAccountFunction} titleStyle={tw('text-black')} title="Deactive Account" buttonStyle={tw('rounded-lg bg-gray-300 px-4')}></Button>
                </View>
                
                <View style={[tw('w-full mb-2 bg-gray-400'), {height: 2}]}></View>
                
                <FlatList
                 data={posts}
                keyExtractor={(item: any) => item.id}
                renderItem={renderPostList}
                showsVerticalScrollIndicator={false}
                >
                </FlatList>
                {/* {posts && posts.length > 0 && posts.map((item: Post) => <HomePostCard key={item.id} post={item} isLoading={isLoading} setIsLoading={setIsLoading}></HomePostCard> )} */}
                </>
                   )}
                </View>
            </SafeAreaView>
    //      </TouchableWithoutFeedback>
    //  </KeyboardAwareScrollView>
  )
}

export default PersonalHomeScreen

const styles = StyleSheet.create({})