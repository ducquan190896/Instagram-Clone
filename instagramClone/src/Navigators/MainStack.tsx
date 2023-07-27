import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../Screens/LoginScreen';
import HomeScreen from '../Screens/HomeScreen';

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
import UserBottomStack from './UserBottomStack';
import RegisterScreen from '../Screens/RegisterScreen';
import ChangePasswordScreen from '../Screens/ChangePasswordScreen';
import AdminHome from '../Screens/Admin/AdminHome';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/Store';
import AdminOtherUserHomeScreen from '../Screens/Admin/AdminOtherUserHomeScreen';
import AdminFollowingScreen from '../Screens/Admin/AdminFollowingScreen';
import AdminFollowersScreen from '../Screens/Admin/AdminFollowersScreen';
import AdminCommentScreen from '../Screens/Admin/AdminCommentScreen';
// import AdminHome from '../Screens/Admin/AdminHome';
// import AdminOtherUserHomeScreen from '../Screens/Admin/AdminOtherUserHomeScreen';

export type RootStackParamList = {
    Login: undefined,
    Signup: undefined,
    PostsByTagScreen: {
      tag: string
    }
    CommentScreen: {
      postId: number
    },
    StoryCreateForm: undefined,
    StoryScreen: {
      storyIndex: number,
      activeIndexProp?: number
    },
    ChatsScreen: undefined,
    ConversationScreen:{
      chatId?: number,
      chatPersonId?: number
    },
    UserBottomStack: {
      screen: string
    },
    ChatSearchScreen: undefined,
    ChangePasswordScreen: undefined
    AdminHome: {
      screen: string,
      params?: any
    }
    AdminOtherUserHomeScreen: {
      userId: number
    },
    AdminFollowingScreen: {
      userId: number
    },
    AdminFollowersScreen: {
      userId: number
    },
    AdminCommentScreen: {
      postId: number
    }
  };
const stack = createNativeStackNavigator<RootStackParamList>();

const MainStack = () => {
  const {user, userSuccess, userError} = useSelector((state: RootState) => state.USERS)

  return (
    <stack.Navigator >
          <stack.Screen component={LoginScreen} options={{headerShown: false}} name="Login"></stack.Screen>
          <stack.Screen component={RegisterScreen} options={{headerShown: false}} name="Signup"></stack.Screen>
          <stack.Screen component={ChangePasswordScreen} options={{title: "Change password"}} name="ChangePasswordScreen"></stack.Screen>
          <stack.Screen component={CommentScreen} name="CommentScreen"></stack.Screen>
          <stack.Screen component={StoryCreateForm} options={{title: "Create Story"}}  name="StoryCreateForm"></stack.Screen>
          <stack.Screen component={StoryScreen} options={{headerShown: false}}   name="StoryScreen"></stack.Screen>
          <stack.Screen component={ChatsScreen} options={{title: "your chats"}}  name="ChatsScreen"></stack.Screen>
          <stack.Screen component={ConversationScreen} options={{headerShown: false}}  name="ConversationScreen"></stack.Screen>    
          <stack.Screen component={UserBottomStack} options={{headerShown: false}}    name="UserBottomStack"></stack.Screen>
          <stack.Screen component={PostsByTagScreen} name="PostsByTagScreen"></stack.Screen>
          <stack.Screen component={ChatSearchScreen} name="ChatSearchScreen" options={{headerShown: false}}></stack.Screen>
          {user?.role == "ADMIN" && (
            <>
              <stack.Screen component={AdminHome} options={{headerShown: false}} name="AdminHome"></stack.Screen>
              <stack.Screen component={AdminOtherUserHomeScreen} name="AdminOtherUserHomeScreen"></stack.Screen> 
              <stack.Screen component={AdminFollowingScreen}  name="AdminFollowingScreen" options={{title: "Followings"}}></stack.Screen>
              <stack.Screen component={AdminFollowersScreen}  name="AdminFollowersScreen" options={{title: "Followers"}}></stack.Screen>
              <stack.Screen component={AdminCommentScreen} name="AdminCommentScreen"></stack.Screen>
            </>
          )}
        </stack.Navigator>
  )
}

export default MainStack

const styles = StyleSheet.create({})