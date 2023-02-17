import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LoginScreen from '../Screens/LoginScreen';
import HomeScreen from '../Screens/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreatePostForm from '../Screens/CreatePostForm';
import PersonalHomeScreen from '../Screens/PersonalHomeScreen';
import FollowerScreen from '../Screens/FollowerScreen';
import FollowingScreen from '../Screens/FollowingScreen';
import OtherUserHomeScreen from '../Screens/OtherUserHomeScreen';
import SearchScreen from '../Screens/SearchScreen';
import PostsByTagScreen from '../Screens/PostsByTagScreen';
import CommentScreen from '../Screens/CommentScreen';

export type RootStackParamList = {
    // Home: undefined,
   Login: undefined,
  //  CreatePostForm: undefined
  // PersonalHome: undefined
  // FollowerScreen: undefined
  // FollowingScreen: undefined
  // OtherUserHomeScreen: undefined
  // SearchScreen: undefined,
  // PostsByTagScreen: {
  //   tag: string
  // }
  CommentScreen: undefined
  
  };
  const stack = createNativeStackNavigator<RootStackParamList>()
const MainStack = () => {
  return (
    <stack.Navigator >
          <stack.Screen component={LoginScreen} options={{headerShown: false}} name="Login"></stack.Screen>
          {/* <stack.Screen component={HomeScreen} options={{headerShown: false}} name="Home"></stack.Screen> */}
          {/* <stack.Screen component={CreatePostForm}  name="CreatePostForm"></stack.Screen> */}
           {/* <stack.Screen component={PersonalHomeScreen}  name="PersonalHome"></stack.Screen> */}
           {/* <stack.Screen component={FollowerScreen}  name="FollowerScreen"></stack.Screen> */}
           {/* <stack.Screen component={FollowingScreen}  name="FollowingScreen"></stack.Screen> */}
           {/* <stack.Screen component={OtherUserHomeScreen}  name="OtherUserHomeScreen"></stack.Screen> */}
           {/* <stack.Screen component={SearchScreen}   name="SearchScreen"></stack.Screen>  */}
           {/* <stack.Screen component={PostsByTagScreen} name="PostsByTagScreen"></stack.Screen> */}
           <stack.Screen component={CommentScreen} name="CommentScreen"></stack.Screen>
        </stack.Navigator>
  )
}

export default MainStack

const styles = StyleSheet.create({})