import { Alert, Image, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Store/Store';
import { login, ResetUser } from '../Store/Actions/UserAction';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { RootStackParamList } from '../Navigators/MainStack';

const LoginScreen = () => {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const tw = useTailwind()
    const text: string = "hello"
    const {users, user, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS)
    const dispatch = useDispatch()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    useEffect(() => {
        if(userSuccess ) {
            // navigation.navigate("Home")   
            // navigation.navigate("CreatePostForm") 
            // navigation.navigate("PersonalHome")        
            // navigation.navigate("FollowerScreen")   
            // navigation.navigate("OtherUserHomeScreen")
            // navigation.navigate("SearchScreen")
            // navigation.navigate("CommentScreen")
            // navigation.navigate("ChatsScreen")
            navigation.navigate("NotificationsScreen")
            dispatch(ResetUser() as any)
        }
        if(userError ) {
            Alert.alert("login failed")       
            dispatch(ResetUser() as any)
        }
        
    }, [userSuccess, userError, message, dispatch])

   
    const submitFunction = async () => {
        if(username && username.length > 0 && password && password.length > 0) {
           await  dispatch(login({username, password}) as any)
           setUsername("")
           setPassword("")

        } else {
            Alert.alert("please fill all required information")
        }
        
    }

    const navigateToSignUp = () => {
        //navigation.navigate("SignUp")
    }

  return (
   <KeyboardAvoidingView style={tw('flex-1')}>
    <TouchableWithoutFeedback style={tw('flex-1')} onPress={Keyboard.dismiss}>
    <SafeAreaView style={tw('flex-1 items-center justify-center px-4')}>
      <Image style={[tw('w-40 h-40'), {resizeMode: 'contain'}]} source={require("../assets/logo.png")}></Image>
      <TextInput value={username} placeholder="username" onChangeText={(text: string) => setUsername(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6')}></TextInput>
      <TextInput secureTextEntry={true} value={password}  placeholder="Password" onChangeText={(text: string) => setPassword(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6')} onSubmitEditing={submitFunction}></TextInput>
      <Button  color="rgb(65,147,239)" containerStyle={tw('w-full rounded-lg mb-6')} size='lg' title='Log In' onPress={submitFunction}></Button>
      <View style={tw('flex flex-row')}>
        <Text style={tw('text-base text-gray-400 mr-4')}>Don't have an account?</Text>
        <TouchableOpacity activeOpacity={0.2} onPress={navigateToSignUp}>
            <Text style={tw('text-base text-zinc-700 mr-4')}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </TouchableWithoutFeedback>
   </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})