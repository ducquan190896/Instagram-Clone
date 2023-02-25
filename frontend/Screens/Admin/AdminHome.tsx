import { StyleSheet, Text,  TextInput,  View, Dimensions, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native'
import React, {useState, useLayoutEffect, useCallback, useEffect} from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SearchPosts from '../TopTabs/SearchPosts';
import SearchTags from '../TopTabs/SearchTags';
import SearchAccounts from '../TopTabs/SearchAccounts';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTailwind } from 'tailwind-rn/dist';
import { SafeAreaProvider } from 'react-native-safe-area-context/lib/typescript/SafeAreaContext';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../Navigators/MainStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons'; 
import AdminAccountSearch from './AdminAccountSearch';
import AdminPostSearch from './AdminPostSearch';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store/Store';
import { getAllUsersForAdminAction } from '../../Store/Actions/UserAction';
import LoadingComponent from '../../Components/LoadingComponent';


const Tab = createMaterialTopTabNavigator();
const windowWidth = Dimensions.get('window').width;

const AdminHome = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [query, setQuery] = useState<string>("")
    const [keyword, setKeyword] = useState<string>("")
    const tw = useTailwind()
    const insets = useSafeAreaInsets()
    const dispatch = useDispatch()
  
    const {users, userSuccess, userError} = useSelector((state: RootState) => state.USERS)
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  
    useLayoutEffect(() => {
      navigation.setOptions({
        // title: "",
        headerShown: false,
        // headerRight: () => (
        //   <View style={[tw('relative ml-10 '), {width: windowWidth - 60}]}>
        //       <TextInput style={tw('rounded-full py-2 text-lg pl-12 bg-gray-200 text-black')} placeholder='search' value={query} onChangeText={(text: string) =>setQuery(text)}></TextInput>
        //   </View>
        // )
      })
    }, [])

  
    return (
      
  <SafeAreaView style={tw('flex-1')}>
      <TouchableWithoutFeedback style={tw('flex-1')} onPress={Keyboard.dismiss} >
        <View style={tw('w-full my-2 flex-row items-center')}>
            <TouchableOpacity  onPress={() => navigation.goBack()} style={tw('mx-2 flex-row items-center')}>
              <Ionicons name="arrow-back" size={28} color="black" />
              <Text style={[tw('text-lg font-bold mx-2')]}>Admin</Text>
            </TouchableOpacity>
            <View style={[tw('relative  flex-1')]}>
                
              <TextInput style={tw('rounded-full py-2 text-lg pl-12 bg-gray-200 text-black')} placeholder='search' value={keyword} onChangeText={(text: string) =>setKeyword(text)}></TextInput>
              <TouchableOpacity  style={tw('mx-2 absolute top-2 left-0')}>
                <Entypo name="magnifying-glass" size={28} color="black" />
              </TouchableOpacity>
            </View>
        </View>
        </TouchableWithoutFeedback>
       
          
          <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: "blue",
                tabBarLabelStyle: {fontSize: 14, color: "#3b82f6", fontWeight: 'bold'},
                tabBarStyle: {marginTop: 0, paddingTop: 0}
  
            }}
            tabBarPosition='top'
            style={tw('flex-1')}
  >
              <Tab.Screen name="AdminSearchPosts"  options={{tabBarLabel: "Posts"}} children={() => <AdminPostSearch keyword={keyword} ></AdminPostSearch>}/>
            
              <Tab.Screen name="AdminSearchAccounts" children={() => <AdminAccountSearch keyword={keyword}></AdminAccountSearch>} options={{tabBarLabel: "Accounts"}}/>
          </Tab.Navigator>
  
  </SafeAreaView>     
      
    )
}

export default AdminHome

const styles = StyleSheet.create({})