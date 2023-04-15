import { Alert, Image, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Store/Store';
import { ChangePassword, login, ResetUser } from '../Store/Actions/UserAction';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { UserBottomTabProps } from '../Navigators/UserBottomStack'
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../Navigators/MainStack'
import { HomeStackParamList } from '../Navigators/HomeStack';

type ChangePasswordScreenNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<RootStackParamList, "ChangePasswordScreen">,
BottomTabNavigationProp<UserBottomTabProps>>;

const ChangePasswordScreen = () => {
    const [password, setPassword] = useState<string>("")
    const [newPassword, setNewPassword] = useState<string>("")
    const [confirmPassword, setConfirmPasword] = useState<string>("")
    const tw = useTailwind()
    const navigation = useNavigation<ChangePasswordScreenNavigationProp>();
    const {users, user, authUserError, authUserSuccess, message} = useSelector((state: RootState) => state.USERS)
    const dispatch = useDispatch()
    useEffect(() => {
        if  (authUserSuccess) {
            Alert.alert("changed password successfully")
            dispatch(ResetUser() as any)
        }
        if  (authUserError) {
            Alert.alert("Changing password failed")
            dispatch(ResetUser() as any)
        }
    }, [dispatch, ChangePassword, authUserSuccess, authUserError])

    const submitFunction = async () => {
        if( password && password.length > 0 && newPassword && newPassword.length > 0 && confirmPassword && confirmPassword.length > 0) {
            await  dispatch(ChangePassword({currentPassword: password, newPassword, confirmPassword}) as any)
            setPassword("")
            setNewPassword("")
            setConfirmPasword("")
            navigation.goBack();
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
                <TextInput secureTextEntry={true} value={password}  placeholder="Your Current Password" onChangeText={(text: string) => setPassword(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6')} onSubmitEditing={submitFunction}></TextInput>
                <TextInput secureTextEntry={true} value={newPassword}  placeholder="New Password" onChangeText={(text: string) => setNewPassword(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6')} onSubmitEditing={submitFunction}></TextInput>
                <TextInput secureTextEntry={true} value={confirmPassword}  placeholder="Confirm new Password" onChangeText={(text: string) => setConfirmPasword(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6')} onSubmitEditing={submitFunction}></TextInput>
                <Button  color="rgb(65,147,239)" containerStyle={tw('w-full rounded-lg mb-6')} size='lg' title='Change Password' onPress={submitFunction}></Button>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default ChangePasswordScreen

const styles = StyleSheet.create({})