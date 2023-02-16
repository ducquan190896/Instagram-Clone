import {TouchableOpacity, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TouchableWithoutFeedback, View, TextInput, Platform, Alert } from 'react-native'
import React, {useLayoutEffect, useState} from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigators/MainStack';
import { useTailwind } from 'tailwind-rn/dist';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import { Button, CheckBox, Badge } from '@rneui/base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import { createPollAction, createPostAction } from '../Store/Actions/PostsAction';
import PollChoice from '../Components/PollChoice';
import {Picker} from '@react-native-picker/picker';

const CreatePostForm = () => {
    const [isPoll, setIsPoll] = useState<boolean>(false)
    const [images, setImages] = useState<string[] | []>([])
    const [tags, setTags] = useState<string[] | []>([])
    const [tag, setTag] = useState<string>("")
    const [content, setContent] = useState<string>("")
    const [question, setQuestion] = useState<string>("")
    const [dayExpire, setDayExpire] = useState<number>(1)
    const [choices, setChoices] = useState<string[]>(["", ""])
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const tw = useTailwind()
    const dispatch = useDispatch()

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
        const results = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 3,
            quality: 1,
            aspect: [4, 3]
        })
        console.log(results.assets)

        const formdata = new FormData()
        let n = 0;
        if(!results.canceled) {
            while(n < results.assets.length) {
                const split = results.assets[n].uri.split("/")
                const fileNameFull = split[split.length - 1].split(".")
                const imageFile = {
                    uri: results.assets[n].uri,
                    type: results.assets[n].type + "/" + fileNameFull[1],
                    name: fileNameFull[0]
                }
                console.log(imageFile)
                await formdata.append("file" , JSON.parse(JSON.stringify(imageFile)))
                n++
            }
        }

        const res = await fetch("http://10.0.2.2:8080/api/images/uploadImages", {
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
            // console.log(images)
            // console.log(content)
            // console.log(tags)
            dispatch(createPostAction({imageUrls :images, tags, content}) as any)
            Alert.alert("created post successfully")
            setImages([])
            setTags([])
            setContent("")
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
            Alert.alert("created post successfully")
           
            setTags([])
            setContent("")
            setQuestion("")
            setDayExpire(1)
            setChoices(["", ""])
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

    



  return (
   <KeyboardAwareScrollView style={tw('flex-1')} 
  extraHeight={120}
   >
    <TouchableWithoutFeedback style={tw('flex-1')} onPress={Keyboard.dismiss} >
        <SafeAreaView style={tw('flex-1 bg-gray-100')}>
            <View style={tw('w-full  mt-4 flex-row items-center')}>
                <CheckBox 
                center
                title="Create Poll"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={isPoll}
                onPress={() => setIsPoll(!isPoll)}
                containerStyle={tw('bg-gray-100')}
                ></CheckBox>
            </View>
            {!isPoll && (
                <View style={tw('px-2')}>
                    <Button onPress={addImages} title="add Images" containerStyle={tw('w-full  mt-4 my-4')} buttonStyle={tw('rounded-lg')}></Button>
                    <TextInput  placeholder='caption' value={content} onChangeText={(text: string) => setContent(text)} style={tw(' my-4 py-2 px-4 w-full bg-gray-200 text-base  rounded-lg')}></TextInput>

                    <View style={tw('w-full flex-wrap flex-row items-center justify-start')}>
                        {tags && tags.length > 0 &&  tags.map((ta, index) =>  
                     
                         <TouchableOpacity onPress={() => deleteTagFunction(ta)} style={tw('')}>
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
                  
                      <TouchableOpacity onPress={() => deleteTagFunction(ta)} style={tw('')}>
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
   </KeyboardAwareScrollView>
  )
}

export default CreatePostForm

const styles = StyleSheet.create({})