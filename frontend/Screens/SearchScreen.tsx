import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SearchPosts from './TopTabs/SearchPosts';
import SearchTags from './TopTabs/SearchTags';
import SearchAccounts from './TopTabs/SearchAccounts';

const Tab = createMaterialTopTabNavigator();
const SearchScreen = () => {
  return (
    <View>
      <Text>SearchScreen</Text>
      <Tab.Navigator>
      <Tab.Screen name="SearchPosts" component={SearchPosts} />
      <Tab.Screen name="SearchTags" component={SearchTags} />
      <Tab.Screen name="SearchAccounts" component={SearchAccounts} />
    </Tab.Navigator>
    </View>
  )
}

export default SearchScreen

const styles = StyleSheet.create({})