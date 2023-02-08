import { Alert, Image, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Store/Store';
import { login, Register, ResetUser } from '../Store/Actions/UserAction';
import {} from 'expo-image-picker';

const RegisterScreen = () => {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [introduction, setIntroduction] = useState<string>("")
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const tw = useTailwind()
    const text: string = "hello"
    const {users, user, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS)
    const dispatch = useDispatch()

    useEffect(() => {
        if(userSuccess || userError) {
            dispatch(ResetUser() as any)
        }
    }, [userSuccess, userError, message, dispatch])

    useEffect(() => {
        if(userSuccess) {
            Alert.alert("login successfully")
        }
        if(userError) {
            Alert.alert("login failed")
        }
    }, [dispatch, Register, userSuccess, userError])

    const submitFunction = async () => {
        // if(username && username.length > 0 && password && password.length > 0) {
        //    await  dispatch(login({username, password}) as any)
        //    setUsername("")
        //    setPassword("")

        // } else {
        //     Alert.alert("please fill all required information")
        // }
        
    }

    const navigateToSignUp = () => {
        //navigation.navigate("Login")
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


      <Button  color="rgb(65,147,239)" containerStyle={tw('w-full rounded-lg mb-6')} size='lg' title='Sign Up' onPress={submitFunction}></Button>
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