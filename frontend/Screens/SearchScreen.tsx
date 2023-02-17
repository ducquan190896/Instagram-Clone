import { StyleSheet, Text,  TextInput,  View, Dimensions, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native'
import React, {useState, useLayoutEffect} from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SearchPosts from './TopTabs/SearchPosts';
import SearchTags from './TopTabs/SearchTags';
import SearchAccounts from './TopTabs/SearchAccounts';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTailwind } from 'tailwind-rn/dist';
import { SafeAreaProvider } from 'react-native-safe-area-context/lib/typescript/SafeAreaContext';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../Navigators/MainStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons'; 


const Tab = createMaterialTopTabNavigator();
const windowWidth = Dimensions.get('window').width;
const SearchScreen = () => {
  const [query, setQuery] = useState<string>("")
  const [keyword, setKeyword] = useState<string>("")
  const tw = useTailwind()
  const insets = useSafeAreaInsets()
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
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw('mx-2')}>
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          <View style={[tw('relative  flex-1')]}>
            <TextInput style={tw('rounded-full py-2 text-lg pl-12 bg-gray-200 text-black')} placeholder='search' value={query} onChangeText={(text: string) =>setQuery(text)}></TextInput>
            <TouchableOpacity onPress={() => setKeyword(query)} style={tw('mx-2 absolute top-2 left-0')}>
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
            <Tab.Screen name="SearchPosts"  options={{tabBarLabel: "Posts"}} children={() => <SearchPosts keyword={keyword} ></SearchPosts>}/>
            <Tab.Screen name="SearchTags" children={() => <SearchTags keyword={keyword}></SearchTags>} options={{tabBarLabel: "Tags"}}/>
            <Tab.Screen name="SearchAccounts" children={() => <SearchAccounts keyword={keyword}></SearchAccounts>} options={{tabBarLabel: "Accounts"}}/>
        </Tab.Navigator>

</SafeAreaView>     
    
  )
}

export default SearchScreen

const styles = StyleSheet.create({})