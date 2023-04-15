import { StyleSheet, Text, View, FlatList, ListRenderItem, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch, useSelector } from 'react-redux'
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { RootStackParamList } from '../Navigators/MainStack';

import { RootState, RootURL } from '../Store/Store'
import { getAllChatsByAuthAction } from '../Store/Actions/ChatAction'
import { CHAT } from '../Store/Reducers/ChatReducer'
import ChatCard from '../Components/ChatCard'
import { USER } from '../Store/Reducers/UserReducer'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { Button } from '@rneui/base'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { getActiveUserBySearchKeyword } from '../Store/Actions/UserAction'
import LoadingComponent from '../Components/LoadingComponent'



const ChatSearchScreen = () => {
    const [query, setQuery] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    const tw = useTailwind()
    const dispatch = useDispatch()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const {user, users, userSuccess, userError} = useSelector((state: RootState) => state.USERS)
    const {chats, chat, chatError, chatSuccess} = useSelector((state: RootState) => state.CHATS)

    const handleQuerySearch = useCallback(async () => {
      if(query && query.length > 0) {
          setIsRefreshing(true)
          console.log(query)
          await dispatch(getActiveUserBySearchKeyword(query) as any)
          setIsRefreshing(false)
      }
    }, [query, dispatch])

    useEffect(() => {
      setIsLoading(true);
      handleQuerySearch().then(() => setIsLoading(false));
    }, [query, dispatch])

    const navigateToOtherUserHomeScreen = (userId: number) => {
        navigation.navigate("ConversationScreen", {chatPersonId: userId})
    }

    const renderPostList: ListRenderItem<any> = ({item}: {item: USER}) => (
        <TouchableOpacity onPress={() => navigateToOtherUserHomeScreen(item.id)} style={tw('w-full border-b border-gray-300 flex-row items-center justify-between px-2 py-2 my-2 mb-4')}>
            <Image style={tw('w-20 h-20 rounded-full mr-14')} source={item.avatarUrl ? {uri: RootURL + item.avatarUrl} : require("../assets/download.png")}></Image>
            <View style={tw('flex-1')}>
              <Text style={tw('text-lg text-black font-bold')}>{item.username}</Text>
            </View>
        </TouchableOpacity> 
    )

 

  return (
    <SafeAreaView style={tw('flex-1')} >
      <KeyboardAvoidingView style={tw('flex-1')}>
        <TouchableWithoutFeedback style={tw('flex-1')} onPress={Keyboard.dismiss} >
          <View style={tw('flex-1 my-2 justify-start items-center px-4')}>
              <View style={[tw('w-full relative')]}>
                <TextInput autoFocus={true} style={tw('rounded-full py-2 text-lg pl-12 bg-gray-200 text-black')} placeholder='search' value={query} onChangeText={(text) => setQuery(text)}></TextInput>
                <TouchableOpacity style={tw('mx-2 absolute top-2 left-0')}>
                  <Entypo name="magnifying-glass" size={28} color="black" />
                </TouchableOpacity>
              </View>
              <View style={tw('flex-1')}>
                {users && users.length > 0 && (
                  <FlatList 
                      style={tw('w-full')}
                      data={users.filter((us: USER) => us.id != user?.id)}
                      keyExtractor={(item: any) => item.id}
                      renderItem={renderPostList}
                      showsVerticalScrollIndicator={false}      
                      onRefresh={handleQuerySearch}         
                      refreshing={isRefreshing}
                  >
                  </FlatList>
                )}
              </View>
          </View>        
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>  
    </SafeAreaView>   
  )
}

export default ChatSearchScreen

const styles = StyleSheet.create({})