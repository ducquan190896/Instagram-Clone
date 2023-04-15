import { StyleSheet, Text, View, FlatList, ListRenderItem, KeyboardAvoidingView, TouchableNativeFeedback, Keyboard, TextInput, TouchableWithoutFeedback, Pressable } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch, useSelector } from 'react-redux'
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { RootStackParamList } from '../Navigators/MainStack';
import { useNavigation, CompositeNavigationProp, RouteProp } from '@react-navigation/native'
import { RootState } from '../Store/Store'
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
import LoadingComponent from '../Components/LoadingComponent'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { HomeStackParamList } from '../Navigators/HomeStack'

type ChatsScreenNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<RootStackParamList, "ChatsScreen">,
BottomTabNavigationProp<HomeStackParamList>>;

type ChatsScreenRouteProp = RouteProp<RootStackParamList, "ChatsScreen">;

const ChatsScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    const tw = useTailwind()
    const dispatch = useDispatch()
    const navigation = useNavigation<ChatsScreenNavigationProp>();
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

    const renderChatList: ListRenderItem<any> = ({item}: {item: CHAT}) => (
       <ChatCard navigation={navigation} item={item} user={user}></ChatCard>
    )

    if (isLoading) {
        return <LoadingComponent/>
    }

  return (
    <SafeAreaView style={tw('flex-1 bg-white')}>
        <KeyboardAvoidingView style={tw('flex-1')}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={tw('bg-white')}>
                    <Pressable onPress={() => navigation.navigate("ChatSearchScreen")} style={[tw('w-full relative  my-2 px-4')]}>
                        <View  style={tw('rounded-full h-10 py-2 text-lg pl-12 bg-gray-200 text-black')} ></View>
                        <View style={tw('mx-2 absolute top-2 left-4')}>
                            <Entypo name="magnifying-glass" size={28} color="black" />
                        </View>
                    </Pressable>
                    <FlatList 
                        refreshing={isRefreshing}
                        onRefresh={loadChatsByAuthUser}
                        data={chats}
                        keyExtractor={(item: any) => item.id}
                        renderItem={renderChatList}
                        showsVerticalScrollIndicator={false}
                    >
                    </FlatList>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ChatsScreen

const styles = StyleSheet.create({})