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
import StoryCreateForm from '../Screens/StoryCreateForm';
import StoryScreen from '../Screens/StoryScreen';
import ChatsScreen from '../Screens/ChatsScreen';
import ChatSearchScreen from '../Screens/ChatSearchScreen';
import ConversationScreen from '../Screens/ConversationScreen';
import NotificationsScreen from '../Screens/NotificationsScreen';

export type RootStackParamList = {
   
   Login: undefined,
  //  Home: undefined
  //  CreatePostForm: undefined
  // PersonalHome: undefined
  // FollowerScreen: undefined
  // FollowingScreen: undefined
  // OtherUserHomeScreen: undefined
  // SearchScreen: undefined,
  // PostsByTagScreen: {
  //   tag: string
  // }
  // CommentScreen: undefined,
  // StoryCreateForm: undefined,
  // StoryScreen: {
  //   storyIndex: number,
  //   activeIndexProp?: number
  // },
  // ChatsScreen: undefined,
  // ConversationScreen:{
  //   chatId: number
  // },
  NotificationsScreen: undefined

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
           {/* <stack.Screen component={CommentScreen} name="CommentScreen"></stack.Screen> */}
           {/* <stack.Screen component={StoryCreateForm} options={{title: "Create Story"}}  name="StoryCreateForm"></stack.Screen>
           <stack.Screen component={StoryScreen} options={{headerShown: false}}   name="StoryScreen"></stack.Screen> */}
            {/* <stack.Screen component={ChatsScreen} options={{title: "your chats"}}  name="ChatsScreen"></stack.Screen> */}
            {/* <stack.Screen component={ConversationScreen} options={{headerShown: false}}  name="ConversationScreen"></stack.Screen> */}
          <stack.Screen component={NotificationsScreen} options={{title: "Notifications"}}    name="NotificationsScreen"></stack.Screen>
        </stack.Navigator>
  )
}

export default MainStack

const styles = StyleSheet.create({})