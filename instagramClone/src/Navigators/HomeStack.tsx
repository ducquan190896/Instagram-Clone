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
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FollowerScreen from '../Screens/FollowerScreen';
import FollowingScreen from '../Screens/FollowingScreen';
import OtherUserHomeScreen from '../Screens/OtherUserHomeScreen';
import NotificationsScreen from '../Screens/NotificationsScreen';

export type HomeStackParamList = {
    FollowerScreen: {
        userId: number
    },
    FollowingScreen: {
        userId: number
    },
    OtherUserHomeScreen: {
        userId: number,
        isSearch: boolean
    },
    NotificationsScreen: undefined,
    Home: undefined,
}

const stack = createNativeStackNavigator<HomeStackParamList>()

const HomeStack = () => {
  return (
    <stack.Navigator >
        <stack.Screen component={HomeScreen} options={{headerShown: false}} name="Home"></stack.Screen>
        <stack.Screen component={FollowerScreen}  name="FollowerScreen"></stack.Screen>
        <stack.Screen component={FollowingScreen}  name="FollowingScreen"></stack.Screen>
        <stack.Screen component={OtherUserHomeScreen}  name="OtherUserHomeScreen"></stack.Screen>
        <stack.Screen component={NotificationsScreen} options={{title: "Notifications"}}    name="NotificationsScreen"></stack.Screen>
    </stack.Navigator>
  )
}

export default HomeStack

const styles = StyleSheet.create({})