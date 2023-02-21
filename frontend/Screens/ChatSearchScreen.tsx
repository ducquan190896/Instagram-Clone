import { StyleSheet, Text, View, FlatList, ListRenderItem, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch, useSelector } from 'react-redux'
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { RootStackParamList } from '../Navigators/MainStack';

import { RootState } from '../Store/Store'
import { getAllChatsByAuthAction } from '../Store/Actions/ChatAction'
import { CHAT } from '../Store/Reducers/ChatReducer'
import ChatCard from '../Components/ChatCard'
import { USER } from '../Store/Reducers/UserReducer'

import { Entypo, Ionicons } from '@expo/vector-icons'; 
import { Button } from '@rneui/base'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { getActiveUserBySearchKeyword } from '../Store/Actions/UserAction'
import LoadingComponent from '../Components/LoadingComponent'



const ChatSearchScreen = () => {
   
    const [query, setQuery] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const tw = useTailwind()
    const dispatch = useDispatch()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const {user, users, userSuccess, userError} = useSelector((state: RootState) => state.USERS)
    const {chats, chat, chatError, chatSuccess} = useSelector((state: RootState) => state.CHATS)

 

    const handleQuerySearch =async (text: string) => {
        setQuery(text)
        if(query && query.length > 0) {
            // setIsLoading(true)
         await dispatch(getActiveUserBySearchKeyword(query) as any)
        //  setIsLoading(false)
        }
    }

    const navigateToOtherUserHomeScreen = (userId: number) => {
        //navigation.navigate("OtherUserHomeScreen", {userId: userId})
    }

    const renderPostList: ListRenderItem<any> = ({item}: {item: USER}) => (
        <TouchableOpacity onPress={() => navigateToOtherUserHomeScreen(item.id)} style={tw('w-full border-b border-gray-300 flex-row items-center justify-start px-6 py-2 my-2 mb-4')}>
         
            <Image style={tw('w-20 h-20 rounded-full mr-14')} source={item.avatarUrl ? {uri: item.avatarUrl} : require("../assets/download.png")}></Image>
            <Text style={tw('text-lg font-bold')}>{item.username}</Text>
       
          </TouchableOpacity> 
        )

 

  return (
    <SafeAreaView style={tw('flex-1')} >
    <KeyboardAvoidingView style={tw('flex-1')}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
      <View style={tw('flex-1 my-2 justify-start items-center px-4')}>
          <View style={[tw('w-full relative  flex-1')]}>
            <TextInput autoFocus={true} style={tw('rounded-full py-2 text-lg pl-12 bg-gray-200 text-black')} placeholder='search' value={query} onChangeText={handleQuerySearch}></TextInput>
            <TouchableOpacity style={tw('mx-2 absolute top-2 left-0')}>
              <Entypo name="magnifying-glass" size={28} color="black" />
            </TouchableOpacity>
          </View>
          {users && users.length > 0 && (
         <FlatList 
        //  refreshing={isRefreshing}
        //  onRefresh={loadActiveUsersByKeyword}
          data={users}
         keyExtractor={(item: any) => item.id}
         renderItem={renderPostList}
         showsVerticalScrollIndicator={false}
         
         >
     </FlatList>
      )}
      </View>
      
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>  
    </SafeAreaView>   
  )
}

export default ChatSearchScreen

const styles = StyleSheet.create({})