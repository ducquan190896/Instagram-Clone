import {TouchableOpacity, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TouchableWithoutFeedback, View, TextInput, Platform, Alert, FlatList, useWindowDimensions, Image, ListRenderItem } from 'react-native'
import React, {useLayoutEffect, useState, useRef} from 'react'
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigators/MainStack';
import { useTailwind } from 'tailwind-rn/dist';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button, CheckBox, Badge } from '@rneui/base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { useDispatch } from 'react-redux';
import { createPollAction, createPostAction } from '../Store/Actions/PostsAction';
import PollChoice from '../Components/PollChoice';
import {Picker} from '@react-native-picker/picker';
import { RootURL } from '../Store/Store';
import { UserBottomTabProps } from '../Navigators/UserBottomStack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import PostCardDot from '../Components/PostCardDot';

type CreatePostFormNavigationProp = CompositeNavigationProp<
BottomTabNavigationProp<UserBottomTabProps, "CreatePostForm">,
NativeStackNavigationProp<RootStackParamList>>;

const CreatePostForm = () => {
    const [activeIndex, setActiveIndex] = useState<number>(0)   
    const [isPoll, setIsPoll] = useState<boolean>(false)
    const [images, setImages] = useState<string[] | []>([])
    const [tags, setTags] = useState<string[] | []>([])
    const [tag, setTag] = useState<string>("")
    const [content, setContent] = useState<string>("")
    const [question, setQuestion] = useState<string>("")
    const [dayExpire, setDayExpire] = useState<number>(1)
    const [choices, setChoices] = useState<string[]>(["", ""])
    const navigation = useNavigation<CreatePostFormNavigationProp>()
    const tw = useTailwind()
    const dispatch = useDispatch()
    const windownWith = useWindowDimensions().width

    const backToMainPageNavigation = () => {
        // navigation.navigate("Home")
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitleVisible: false,
            title: "",
            headerLeft: () => (
                <TouchableOpacity onPress={backToMainPageNavigation} style={tw('flex flex-row items-center mx-2')}>
                    <Ionicons name="arrow-back" size={32} color="black" />
                    <Text style={tw('text-lg font-bold ml-4')}>Main Page</Text>
                </TouchableOpacity>
            )
        })
    })

    const addTag = () => {
        if(tag) {
         setTags(prev => [ ...prev, tag])
         setTag("")
        }
    }

    const addImages = async () => {
        const results: any = await launchImageLibrary({
            mediaType: 'photo',
            quality: 1,
            selectionLimit: 3
        });
        console.log(results.assets)

        const formdata = new FormData()
        let n = 0;
        if(!results.canceled) {
            while(n < results.assets.length) {
                const split = results.assets[n].uri.split("/")
                const fileNameFull = split[split.length - 1].split(".")
                const imageFile = {
                    uri: results.assets[n].uri,
                    type: results.assets[n].type,
                    name: fileNameFull[0]
                }
                console.log(imageFile)
                await formdata.append("file" , JSON.parse(JSON.stringify(imageFile)))
                n++
            }
        }

        const res = await fetch(RootURL + "/api/images/uploadImages", {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data"
            },
            body: formdata
        })

        const imageUrls = await res.json()

        console.log(imageUrls)
        setImages(imageUrls)
    }

    const deleteTagFunction = (ta: string) => {
        setTags(tags.filter(taa => taa !== ta))
    }

    const createPostSubmit = async () => {
        if(images && images.length > 0 && content && tags) {
            dispatch(createPostAction({imageUrls :images, tags, content}) as any)
            Alert.alert("created post successfully")
            setImages([])
            setTags([])
            setContent("")
            navigation.navigate("HomeStack", {screen: "Home"});
        } else {
            Alert.alert("please fill all information for the post")
        }
    }

    const createPollSubmit = async () => {
        if( content && tags && question && dayExpire && choices && choices.length > 0) {
           const poll = {
            question,
            expireDays: dayExpire,
            choices
           }
            dispatch(createPollAction({content, tags, poll: poll}) as any)
            Alert.alert("created poll successfully")
           
            setTags([])
            setContent("")
            setQuestion("")
            setDayExpire(1)
            setChoices(["", ""])
            navigation.navigate("HomeStack", {screen: "Home"});
        } else {
            Alert.alert("please fill all information for the post")
        }
        
    }


    const handleChoiceChange = (text: string, index: number) => {
        let choicesCopy = choices.slice()
        console.log(choicesCopy)
        choicesCopy[index] = text
        setChoices(choicesCopy)
    }

    const removeChoice = (index: number) => {  
        if(choices.length > 2) {
            const choiceCopy = [...choices.slice(0, index), ...choices.slice(index + 1)]
            setChoices(choiceCopy)
        console.log(choices)
        } else {
            Alert.alert("min is 2 choices")
        }
    }

    const addChoice = () => {
        if(choices.length < 5) {
            setChoices([...choices, ""])
        } else {
            Alert.alert("max is 5 choices")
        }
    }

    const onViewableItemsChanged = useRef(({viewableItems, changed}: {viewableItems: any, changed: any}) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index)
        }
    })
    const handlerRenderImages: ListRenderItem<any> = ({item, index}) => (    
        <Image key={index} source={{uri:  RootURL + item}} style={[tw('text-base'), {width: windownWith, height: 300, resizeMode: 'cover'}]}></Image>   
    )



  return (
    <KeyboardAwareScrollView style={tw('flex-1')}>
        <View style={tw('w-full  flex-row items-center')}>
            <CheckBox 
                center
                title="Create Poll"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={isPoll}
                onPress={() => setIsPoll(!isPoll)}
                containerStyle={tw('bg-gray-100')}
            />
        </View>
        <View style={tw('flex items-center justify-center')}>
            {!isPoll && images && images.length > 0 && (
                <FlatList
                    scrollEnabled={true}
                    // nestedScrollEnabled={true}
                    data={ images}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    snapToAlignment='center'
                    decelerationRate='fast'
                    snapToInterval={windownWith}
                    viewabilityConfig={{
                    viewAreaCoveragePercentThreshold: 50,
                    }}
                    onViewableItemsChanged={onViewableItemsChanged.current}
                    keyExtractor={(item: string) => item}
                    renderItem={handlerRenderImages}
                    style={tw('mb-4')}
                />
            )}
            {!isPoll && images && images.length > 0 && (
                <PostCardDot activeIndex={activeIndex} arrayLength={images && images.length > 0 ?  images?.length : 0}></PostCardDot>
            )}
        </View>
        <KeyboardAvoidingView style={tw('flex-1')} 
        >
            <TouchableWithoutFeedback style={tw('flex-1')} onPress={Keyboard.dismiss} >
                <SafeAreaView style={tw('flex-1 bg-gray-100')}>
                    {!isPoll && (
                        <View style={tw('px-2')}>
                            <Button onPress={addImages} title="add Images" containerStyle={tw('w-full  mt-4 my-4')} buttonStyle={tw('rounded-lg')}></Button>
                            <TextInput  placeholder='caption' value={content} onChangeText={(text: string) => setContent(text)} style={tw(' my-4 py-2 px-4 w-full bg-gray-200 text-base  rounded-lg')}></TextInput>

                            <View style={tw('w-full flex-wrap flex-row items-center justify-start')}>
                                {tags && tags.length > 0 &&  tags.map((ta, index) =>  
                            
                                <TouchableOpacity key={index} onPress={() => deleteTagFunction(ta)} style={tw('')}>
                                    <Badge key={index}    containerStyle={tw('my-2 mx-2 text-base')} badgeStyle={tw('w-20 h-10 rounded-full p-2')}   textStyle={tw('text-white text-base')} value={ta} status="primary" />
                                </TouchableOpacity>
                                )}
                            </View>
                            <TextInput  placeholder='Tag' value={tag} onChangeText={(text: string) => {setTag(text)}}  style={tw(' my-4 py-2 px-4 w-full bg-gray-200 text-base  rounded-lg')}></TextInput>
                            <Button title="Add Tag" containerStyle={tw('w-1/3 mb-4')} buttonStyle={tw('rounded-lg')} onPress={addTag}></Button>
                            <Button onPress={createPostSubmit} title="Create Post" containerStyle={tw('w-full  mt-4 my-4')} buttonStyle={tw('rounded-lg')}></Button>
                        </View>
                    )}

                    {isPoll && (
                        <View style={tw('px-2')}>
                        
                        <TextInput  placeholder='caption' value={content} onChangeText={(text: string) => setContent(text)} style={tw(' my-4 py-2 px-4 w-full bg-gray-200 text-base  rounded-lg')}></TextInput>

                        <View style={tw('w-full flex-wrap flex-row items-center justify-start')}>
                            {tags && tags.length > 0 &&  tags.map((ta, index) =>  
                        
                            <TouchableOpacity key={index} onPress={() => deleteTagFunction(ta)} style={tw('')}>
                                <Badge key={index}    containerStyle={tw('my-2 mx-2 text-base')} badgeStyle={tw('w-20 h-10 rounded-full p-2')}   textStyle={tw('text-white text-base')} value={ta} status="primary" />
                            </TouchableOpacity>
                            )}
                        </View>
                        <TextInput  placeholder='Tag' value={tag} onChangeText={(text: string) => {setTag(text)}}  style={tw(' my-4 py-2 px-4 w-full bg-gray-200 text-base  rounded-lg')}></TextInput>
                        <Button title="Add Tag" containerStyle={tw('w-1/3 mb-4')} buttonStyle={tw('rounded-lg')} onPress={addTag}></Button>
                        <TextInput  placeholder='Ask a Question' value={question} onChangeText={(text: string) => setQuestion(text)} style={tw(' my-4 py-2 px-4 w-full bg-gray-200 text-base  rounded-lg')}></TextInput>

                        <View style={tw('w-full px-2 my-2 py-2 rounded-lg border border-gray-300')}>
                            {choices && choices.length > 0 && choices.map((choice, index) => <PollChoice removeChoice={removeChoice} handleChoiceChange={handleChoiceChange} key={index} choice={choice} index={index}></PollChoice>)}
                            <Button title="More Choice" containerStyle={tw('w-1/3 mb-4')} buttonStyle={tw('rounded-lg')} onPress={addChoice}></Button>
                            <Text style={tw('text-gray-300 mb-2')}>Max 5 choices And Min 2 choices</Text>
                            <View style={tw('flex-row items-center justify-start my-2')}>
                                <Text style={tw('text-lg mr-10')}>Voting Time:</Text>
                                <Picker
                                    selectedValue={dayExpire}
                                    onValueChange={(itemValue) => setDayExpire(itemValue)}
                                    style={tw('w-1/3 bg-gray-200 rounded-lg')}
                                    >
                                    {[1, 2, 3, 4, 5].map(day => <Picker.Item value={day} label={day != 1 ? day + " days" : day + " day"}></Picker.Item>)}
                                </Picker>
                            </View>
                        </View>

                        <Button onPress={createPollSubmit} title="Create Poll" containerStyle={tw('w-full  mt-4 my-4')} buttonStyle={tw('rounded-lg')}></Button>
                    </View>
                    )}
                    
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    </KeyboardAwareScrollView>
  )
}

export default CreatePostForm

const styles = StyleSheet.create({})