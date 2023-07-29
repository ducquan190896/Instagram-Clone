import { Alert, Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useCallback, useEffect, useState,  useMemo, useRef  } from 'react'
import { RouteProp, useNavigation, useRoute, CompositeNavigationProp } from '@react-navigation/native'
import { RootStackParamList } from '../Navigators/MainStack'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, RootURL } from '../Store/Store'
import { useTailwind } from 'tailwind-rn/dist'
import { deleteStoryAction, getStoryByidAction } from '../Store/Actions/StoryAction'
import LoadingComponent from '../Components/LoadingComponent'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { declaredStateStory, STORY } from '../Store/Reducers/StoryReducer'
import { checkStoryLikeStatus, errorStoryLikeAction, likeStoryAction, unlikeStoryAction } from '../Store/Actions/StoryLikeAction'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { HomeStackParamList } from '../Navigators/HomeStack'

type StoryScreenNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<RootStackParamList, "StoryScreen">,
BottomTabNavigationProp<HomeStackParamList>>;

type StoryScreenRouteProp = RouteProp<RootStackParamList, "StoryScreen">;


const StoryScreen = () => {
    const {params} = useRoute<StoryScreenRouteProp>()
    const {activeIndexProp, storyIndex} = params
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [activeIndex, setActiveIndex] = useState<number>(0)
    const [isLike, setIsLike] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(true)
    const {stories, story,  storySuccess, storyError} = useSelector((state: RootState) => state.STORIES)
    const {storyLike, storyLikeSuccess, storyLikeError, storyLikeStatus} = useSelector((state: RootState) => state.STORYLIKES)
    const {user, userSuccess, userError} = useSelector((state: RootState) => state.USERS)
    const dispatch = useDispatch()
    const tw = useTailwind()
    const navigation = useNavigation<StoryScreenNavigationProp>()
   
   

    const LoadStoryLikeStatus = useCallback(async () => {
        console.log("hello story");
        console.log("storyIndex: " + storyIndex);
        console.log("stories ");
        console.log(stories)
        if(storyIndex && stories) {
            const token = await AsyncStorage.getItem("token")
            const res = await fetch(RootURL + `/api/storyLikes/checkStoryLikeByAuthUser/${stories[storyIndex]?.id}`, {
                method: "GET",
                headers: {
                    "Authorization": token ?? ""
                }
            })
            const data = await res.json()
    
            console.log("check_storyLike_By_AuthUser: " + data);
            // console.log(data) 
            setIsLike(data)
        }
    }, [user, storyIndex, dispatch, storyLike, stories]) 

    const loadStory = useCallback( async () => {
            dispatch(getStoryByidAction(stories[storyIndex].id) as any) 
    }, [ storyIndex, dispatch, story, stories])

    const loadStoryById = useCallback( async () => {
       if(story) {
        dispatch(getStoryByidAction(story?.id) as any)
       }   
    }, [ storyIndex, dispatch, story, storySuccess, stories])

    useEffect(() => {
        setIsLoading(true)
        loadStory().then(() => setIsLoading(false))
    }, [ storyIndex, user, dispatch, isLike])

    useEffect(() => {
        LoadStoryLikeStatus()
    }, [storyLikeSuccess, isLike, dispatch, storyIndex, storyLike, stories])
    // storyLike, isLike, dispatch, stories

    const handlePrevStory = () => {
        console.log("previous story")
        if(activeIndex <= 0) {
            if(storyIndex <= 0) {
                return;
            } else {
                navigation.push("StoryScreen", { storyIndex: storyIndex - 1, activeIndexProp: 0})
            }
        } else {
            setActiveIndex(prev => prev - 1)
        }
    }
    const handleNextStory = () => {
        console.log("next story")
        if(activeIndex >= story.imageUrls.length - 1) {
            if(storyIndex >= stories?.length - 1) {
                return;
            }else {
                navigation.push("StoryScreen", { storyIndex: storyIndex + 1, activeIndexProp: 0})
            }      
        } else {
            setActiveIndex(prev => prev + 1)
        }
    }

    const handlePress = (evt: any) => {
        const x = evt.nativeEvent.locationX;
        const screenWith = Dimensions.get("window").width
        if(x < screenWith / 2) {
            handlePrevStory()
        } else {
            handleNextStory()
        }
    }
    
    const handleLikeStory = async () => {
        if(isLike && story) {
           await dispatch(unlikeStoryAction(story?.id) as any)
            setIsLike(false)
        }
         if(!isLike && story) {
           await dispatch(likeStoryAction(story?.id) as any)
          setIsLike(true)
        }
    }
    
    const handleBackToHomeNavigation = () => {
        navigation.navigate('Home');
    }

    const handleDeleteStory = async () => {
        await dispatch(deleteStoryAction(story?.id) as any)
        Alert.alert("deleted story")
        if(storyIndex >= stories?.length -1 && stories?.length > 0) {       
                // navigation.push("StoryScreen", { storyIndex: storyIndex - 1, activeIndexProp: 0}) 
        } 
         if(stories?.length == 0) {
            // navigation.navigate("Home")
        }  
         if(storyIndex >= 0 && stories?.length > 0)  {
            // navigation.push("StoryScreen", { storyIndex: storyIndex + 1, activeIndexProp: 0})
        }     
    }


    // useEffect(() => {
      
    //     const storyInterval = setInterval(() => {
           
    //     if(storyIndex < stories?.length - 1) {
    //         console.log("next story")
    //         if(activeIndex >= story.imageUrls.length - 1) {
    //                 console.log("activeIndex: " + activeIndex)
    //                 console.log("storyIndex: " + storyIndex)
    //                 navigation.push("StoryScreen", { storyIndex: storyIndex + 1, activeIndexProp: 0})
                  
    //         } else {
    //             console.log("activeIndex: " + activeIndex)
    //             console.log("storyIndex: " + storyIndex)
    //             setActiveIndex(activeIndex + 1)
    //         }
          
    //     } else {
    //         clearInterval(storyInterval)
    //     }
    //     }, 3000)
    //     // if(storyIndex >= stories?.length - 1) {
    //     //     clearInterval(storyInterval)
    //     // } else {
    //     //     storyInterval
    //     // }
  
    //     return () => {clearInterval(storyInterval)}
    // }, [activeIndex, storyIndex])

    // if(isLoading) {
    //     return <LoadingComponent/>
    // }

    if(!isLoading && !story) {
        return <View style={tw('flex-1 items-center justify-center')}>
            <Text style={tw('text-lg font-bold text-center')}>No story</Text>
        </View>
    }

    return (
        <SafeAreaView style={[{height: "100%"}]}>
            <TouchableWithoutFeedback onPress={handlePress}>
                <ImageBackground style={[tw('flex-1 bg-black'), { resizeMode: "cover"}]} imageStyle={{resizeMode: "contain"}} source={story && story?.imageUrls && story?.imageUrls?.length > 0 ? {uri: RootURL + story?.imageUrls[activeIndex]} : require("../assets/skysports-cristiano-ronaldo_5823297.jpg")}> 
                    { story?.imageUrls && story?.imageUrls?.length > 0 && (
                        <View style={tw('flex-row w-full mt-2 mb-4 items-center justify-between px-2')}>
                            {story?.imageUrls && story?.imageUrls.length > 0 && story?.imageUrls.map((img: string, index: number) => <View key={index} style={[tw(`rounded-full ${index <= activeIndex ? "bg-blue-500": "bg-gray-300"}`), {height: 4, paddingRight: 2, width: `${(1 / story?.imageUrls.length * 100) - 2}%`}]}></View>)}
                        </View>
                    )}
                    <View style={tw(' flex-row items-center  justify-between px-6')} >
                        <Image style={[tw('w-14 h-14 rounded-full bg-white'), {resizeMode: 'contain'}]} source={story?.owner?.avatarUrl ? {uri: RootURL + story?.owner?.avatarUrl}: require("../assets/download.png")}></Image>
                        {/* <Text  style={tw('text-xs')}>{story?.id}</Text> */}
                        <View style={tw('flex-row items-center')}>
                            <TouchableOpacity onPress={handleLikeStory} style={tw('')}>
                                {isLike == true ? <Entypo name="heart" size={32} color="red" /> :<Entypo name="heart" size={32} color="white" />}         
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleBackToHomeNavigation} style={tw('ml-4')}>
                                <Entypo name="home" size={30} color="white" />             
                            </TouchableOpacity>
                            {user?.id == story?.owner?.id && (
                                <TouchableOpacity onPress={handleDeleteStory} style={tw('ml-4')}>
                                    <FontAwesome5 name="trash-alt" size={26} color="white" />            
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </ImageBackground>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default StoryScreen

const styles = StyleSheet.create({
    image: {
        resizeMode: 'center'
    }
})