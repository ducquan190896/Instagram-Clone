import { Alert, Image, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, RootURL } from '../Store/Store';
import { login, Register, ResetUser } from '../Store/Actions/UserAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { RootStackParamList } from '../Navigators/MainStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [introduction, setIntroduction] = useState<string>("")
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const tw = useTailwind()
    const text: string = "hello"
    const {users, user, authUserError, authUserSuccess, message} = useSelector((state: RootState) => state.USERS)
    const dispatch = useDispatch()

   
    useEffect(() => {
        if(authUserSuccess && user.role == "USER" ) {
            Alert.alert("Sign up successfully")
            navigation.navigate("UserBottomStack", {screen: "HomeStack"});  
            dispatch(ResetUser() as any)
        }
        if(authUserError) {
            Alert.alert("login failed");
            dispatch(ResetUser() as any)
        }
    }, [dispatch, Register, authUserSuccess, authUserError])


    const uploadImageFunction = async () => {
        const images: any = await launchImageLibrary({
            mediaType: 'photo',
            quality: 1
        });
        // const token = await AsyncStorage.getItem("item")
        const formdata = new FormData();      
        if(!images.canceled) {      
                const split = images.assets[0].uri.split('/')
                const fileNameDot = split[split.length - 1].split(".")
                const fileName = fileNameDot[0]
                // const imageFile = {
                //     uri: images.assets[0].uri,
                //     type: images.assets[0].type + "/" + fileNameDot[1],
                //     name: fileName
                // };
                const imageFile = {
                    uri: images.assets[0].uri,
                    type: images.assets[0].type,
                    name: fileName
                }
                console.log("fileName : " + fileName)
                console.log(images.assets[0])
                formdata.append("file",  JSON.parse(JSON.stringify(imageFile)))        
        }
        console.log(formdata)
        const res = await fetch(RootURL + "/api/images/uploadImages", {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data"
            },
            body: formdata
        })
        const imageUrl = await res.json()
        console.log(imageUrl)
        setAvatarUrl(imageUrl[0])
    }

    const submitFunction = async () => {
        if(username && username.length > 0 && password && password.length > 0 && confirmPassword && confirmPassword.length > 0 && introduction && introduction.length > 0 && email && email.length > 0 && avatarUrl && avatarUrl.length > 0) {
           await  dispatch(Register({username, email, introduction, password, confirmPassword, avatarUrl}) as any)
           setUsername("")
           setPassword("")
           setAvatarUrl(null)
           setConfirmPassword("")
           setEmail("")
           setIntroduction("")
        } else {
            Alert.alert("please fill all required information")
        }
    }
    const navigateToSignUp = () => {
        navigation.navigate("Login");
    }

  return (
    <KeyboardAvoidingView style={tw('flex-1')}>
        <TouchableWithoutFeedback style={tw('flex-1')} onPress={Keyboard.dismiss}>
            <SafeAreaView style={tw('flex-1 items-center justify-center px-4')}>
                <Image style={[tw('w-40 h-40'), {resizeMode: 'contain'}]} source={require("../assets/logo.png")}></Image>
                <TextInput value={username} placeholder="username" onChangeText={(text: string) => setUsername(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6')}></TextInput>
                <TextInput value={email} placeholder="email" onChangeText={(text: string) => setEmail(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6')}></TextInput>
                <TextInput value={introduction} placeholder="introduction" onChangeText={(text: string) => setIntroduction(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6')}></TextInput>
                <TextInput secureTextEntry={true} value={password}  placeholder="Password" onChangeText={(text: string) => setPassword(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6')} onSubmitEditing={submitFunction}></TextInput>
                <TextInput secureTextEntry={true} value={confirmPassword}  placeholder="confirm your Password" onChangeText={(text: string) => setConfirmPassword(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6')} onSubmitEditing={submitFunction}></TextInput>
                <TouchableOpacity  style={[tw('w-full rounded-lg mb-6 py-2 font-bold px-6'), {backgroundColor: "#03b1fc"}]}  onPress={uploadImageFunction}>
                    <Text style={tw('text-base text-white')}>Your Avartar</Text>
                </TouchableOpacity>
                <Button  color="#03b1fc" containerStyle={tw('w-full rounded-lg mb-6')} size='lg' title='Sign Up' onPress={submitFunction}></Button>
                <View style={tw('flex flex-row')}>
                    <Text style={tw('text-base text-gray-400 mr-4')}> have an account?</Text>
                    <TouchableOpacity activeOpacity={0.2} onPress={navigateToSignUp}>
                        <Text style={tw('text-base text-zinc-700 mr-4')}>Login</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({})