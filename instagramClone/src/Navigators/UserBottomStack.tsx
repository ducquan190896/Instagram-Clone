import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/Store'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import HomeScreen from '../Screens/HomeScreen';
import PersonalHomeScreen from '../Screens/PersonalHomeScreen';
import CreatePostForm from '../Screens/CreatePostForm';
import SearchScreen from '../Screens/SearchScreen';
import HomeStack from './HomeStack';

export type UserBottomTabProps = {
    HomeStack: {
        screen: string,
        params?: any
    },
    SearchScreen: undefined,
    PersonalHome: undefined,
    CreatePostForm: undefined
}

const tab = createBottomTabNavigator<UserBottomTabProps>();

const UserBottomStack = () => {
  return (
        <tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                tabBarInactiveTintColor: '#c7c9c9',
                tabBarActiveTintColor: '#03b1fc',
                unmountOnBlur: true
            }}
            initialRouteName='HomeStack'
        >
            <tab.Screen 
                options={{
                headerShown: false,
                tabBarIcon: ({color}) => (
                    <AntDesign name="home" size={28} color={color} />
                    )
                }} 
                name="HomeStack" 
                component={HomeStack}
            ></tab.Screen>
            <tab.Screen 
                options={{
                headerShown: false,
                tabBarIcon: ({color}) => (
                    <Entypo name="magnifying-glass" size={28} color={color} />
                    )
                }} 
                name="SearchScreen" 
                component={SearchScreen}
            ></tab.Screen>
            <tab.Screen 
                options={{
                headerShown: false,
                tabBarIcon: ({color}) => (
                    <Feather name="plus-square" size={28} color={color} />
                    )
                }} 
                name="CreatePostForm" 
                component={CreatePostForm}
            ></tab.Screen>
            <tab.Screen 
                options={{
                headerShown: false,
                tabBarIcon: ({color}) => (
                    <Ionicons name="person" size={28} color={color} />
                    )
                }} 
                name="PersonalHome" 
                component={PersonalHomeScreen}
            ></tab.Screen>
            

            
        </tab.Navigator>
    )
}

export default UserBottomStack

const styles = StyleSheet.create({})