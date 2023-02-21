import { Alert, Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useCallback, useEffect, useState,  useMemo, useRef  } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../Navigators/MainStack'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../Store/Store'
import { useTailwind } from 'tailwind-rn/dist'
import { deleteStoryAction, getStoryByidAction } from '../Store/Actions/StoryAction'
import LoadingComponent from '../Components/LoadingComponent'
import { AntDesign } from '@expo/vector-icons'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { declaredStateStory, STORY } from '../Store/Reducers/StoryReducer'
import { checkStoryLikeStatus, errorStoryLikeAction, likeStoryAction, unlikeStoryAction } from '../Store/Actions/StoryLikeAction'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Entypo } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 

// type StoryScreenRouteProp = RouteProp<RootStackParamList, "StoryScreen">

const StoryScreen = () => {
    // const {params} = useRoute<StoryScreenRouteProp>()
    // const {activeIndexProp, storyIndex} = params
    const storyIndex = 2
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [activeIndex, setActiveIndex] = useState<number>(0)
    const [isLike, setIsLike] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(true)
    const {stories, story,  storySuccess, storyError} = useSelector((state: RootState) => state.STORIES)
    const {storyLike, storyLikeSuccess, storyLikeError, storyLikeStatus} = useSelector((state: RootState) => state.STORYLIKES)
    const {user, userSuccess, userError} = useSelector((state: RootState) => state.USERS)
    const dispatch = useDispatch()
    const tw = useTailwind()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
   
   

    const LoadStoryLikeStatus = useCallback(async () => {
        // if(storyIndex && stories && stories.length > 0) {
            const token = await AsyncStorage.getItem("token")
            const res = await fetch(`http://10.0.2.2:8080/api/storyLikes/checkStoryLikeByAuthUser/${stories[storyIndex]?.id}`, {
                method: "GET",
                headers: {
                    "Authorization": token ?? ""
                }
            })
            const data = await res.json()
    
            console.log("check_storyLike_By_AuthUser")
            console.log(data) 
            setIsLike(data)
        // }
    }, [user, storyIndex, dispatch, storyLike]) 

    const loadStory = useCallback( async () => {
      
    
       
            dispatch(getStoryByidAction(stories[storyIndex].id) as any)
        
       
    }, [ storyIndex, dispatch, story])

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
    }, [storyLikeSuccess, isLike, dispatch, storyIndex])
    // storyLike, isLike, dispatch, stories

    const handlePrevStory = () => {
        console.log("previous story")
        if(activeIndex <= 0) {
            if(storyIndex <= 0) {
                return;
            } else {
                // navigation.push("StoryScreen", { storyIndex: storyIndex - 1, activeIndexProp: 0})
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
                // navigation.push("StoryScreen", { storyIndex: storyIndex + 1, activeIndexProp: 0})
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
        // navigation.navigate("Home")
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
      <ImageBackground style={[tw('flex-1 '), styles.image]} source={{uri: "http://10.0.2.2:8080" + story?.imageUrls[activeIndex]}}>
        { story?.imageUrls && story?.imageUrls.length > 0 && (
            <View style={tw('flex-row w-full mt-2 mb-4 items-center justify-between')}>
                {story?.imageUrls && story?.imageUrls.length > 0 && story?.imageUrls.map((img: string, index: number) => <View key={index} style={[tw(`rounded-full ${index <= activeIndex ? "bg-blue-500": "bg-gray-300"}`), {height: 4, paddingRight: 2, width: `${(1 / story?.imageUrls.length * 100) - 2}%`}]}></View>)}
            </View>
        )}
        <View  style={tw(' flex-row items-center  justify-between px-6')} >
            <Image style={[tw('w-14 h-14 rounded-full bg-white'), {resizeMode: 'contain'}]} source={story?.owner?.avatarUrl ? {uri: story?.owner?.avatarUrl}: require("../assets/download.png")}></Image>
            <Text  style={tw('text-xs')}>{story?.id}</Text>
           
           <View style={tw('flex-row items-center')}>
            <TouchableOpacity onPress={handleLikeStory} style={tw('')}>
                {isLike ? <AntDesign name="heart" size={30} color="red" /> :<AntDesign name="hearto" size={30} color="black" />}         
            </TouchableOpacity>
            <TouchableOpacity onPress={handleBackToHomeNavigation} style={tw('ml-4')}>
             <AntDesign name="home" size={30} color="black" />             
            </TouchableOpacity>
            {user?.id == story?.owner?.id && (
                <TouchableOpacity onPress={handleDeleteStory} style={tw('ml-4')}>
                  <FontAwesome name="trash-o" size={30} color="black" />            
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