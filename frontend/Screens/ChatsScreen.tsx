import { StyleSheet, Text, View, FlatList, ListRenderItem, KeyboardAvoidingView, TouchableNativeFeedback, Keyboard, TextInput } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch, useSelector } from 'react-redux'
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { RootStackParamList } from '../Navigators/MainStack';
import { useNavigation } from '@react-navigation/native'
import { RootState } from '../Store/Store'
import { getAllChatsByAuthAction } from '../Store/Actions/ChatAction'
import { CHAT } from '../Store/Reducers/ChatReducer'
import ChatCard from '../Components/ChatCard'
import { USER } from '../Store/Reducers/UserReducer'
import { TouchableWithoutFeedback } from '@gorhom/bottom-sheet'
import { Entypo } from '@expo/vector-icons'; 
import { Button } from '@rneui/base'
import LoadingComponent from '../Components/LoadingComponent'


const ChatsScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    const tw = useTailwind()
    const dispatch = useDispatch()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const {user, userSuccess, userError} = useSelector((state: RootState) => state.USERS)
    const {chats, chat, chatError, chatSuccess} = useSelector((state: RootState) => state.CHATS)

    const loadChatsByAuthUser = useCallback(async() => {
        setIsRefreshing(true)
       await dispatch(getAllChatsByAuthAction() as any)
       setIsRefreshing(false)
    }, [user])

    useEffect(() => {
        setIsLoading(true)
        loadChatsByAuthUser().then(() => setIsLoading(false))
    }, [user, dispatch])

    const renderPostList: ListRenderItem<any> = ({item}: {item: CHAT}) => (
       <ChatCard navigation={navigation} item={item} user={user}></ChatCard>
      )
    
    

      if(isLoading) {
        return <LoadingComponent/>
    }

  return (
    <SafeAreaView style={tw('flex-1')}>
    <KeyboardAvoidingView style={tw('flex-1')}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
         
            <FlatList 
                refreshing={isRefreshing}
                onRefresh={loadChatsByAuthUser}
                 data={chats}
                keyExtractor={(item: any) => item.id}
                renderItem={renderPostList}
                showsVerticalScrollIndicator={false}
                
                >
            </FlatList>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ChatsScreen

const styles = StyleSheet.create({})