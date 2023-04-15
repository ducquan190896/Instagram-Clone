import { StyleSheet, Text, View, ListRenderItem, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import { getPostsBySearchKeyword } from '../../Store/Actions/PostsAction'
import { RootState } from '../../Store/Store'
import { Post } from '../../Store/Reducers/PostsReducer'
import HomePostCard from '../../Components/HomePostCard'
import LoadingComponent from '../../Components/LoadingComponent'
import { getActiveUserBySearchKeyword } from '../../Store/Actions/UserAction'
import { USER } from '../../Store/Reducers/UserReducer'
import { getTagsByKeyword, ResetTag } from '../../Store/Actions/TagAction'
import { TAG } from '../../Store/Reducers/TagReducer'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../Navigators/MainStack'
type searchProps = {
  keyword: string,
  navigation: any
}


const SearchTags = ({keyword, navigation}: searchProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isrefreshing, setIsrefreshing] = useState<boolean>(false);
  const tw = useTailwind()
  const dispatch = useDispatch()
  const {users, userSuccess, userError} = useSelector((state: RootState) => state.USERS)
  const {tags, tagSuccess, tagError} = useSelector((state: RootState) => state.TAGS)

  const loadTagsByKeyword = useCallback(async ()=> {
    if(keyword && keyword.length > 0) {
      setIsrefreshing(true);
      await dispatch(getTagsByKeyword(keyword) as any)
      setIsrefreshing(false);
    }
  }, [keyword])

  useEffect(() => {
    setIsLoading(true)
    loadTagsByKeyword().then(() => setIsLoading(false))
  }, [keyword])

  const navigateToPostsByTagScreen = (tag: string) => {
    navigation.navigate("PostsByTagScreen",  {tag: tag});
  }

  const renderTagList: ListRenderItem<any> = ({item}: {item: TAG}) => (
      <TouchableOpacity onPress={() => navigateToPostsByTagScreen(item.content)} style={tw('w-full border-b border-gray-300 flex-row items-center justify-start px-6 py-2 my-2 mb-4')}>
        {/* <Image style={tw('w-20 h-20 rounded-full mr-14')} source={item.avatarUrl ? {uri: item.avatarUrl} : require("./download.png")}></Image> */}
        <Text style={tw('text-lg font-bold text-black')}>#{item.content}</Text>
      </TouchableOpacity> 
  )

  if (isLoading) {
    return <LoadingComponent/>
  }

  if(!isLoading && tags && (tags as Post[]).length <= 0) {
    return <View style={tw('flex-1 items-center justify-center')}>
              <Text style={tw('text-lg font-bold text-center')}>No tags</Text>
            </View>
  }


  return (
    <View style={tw('flex-1')}>
      <FlatList
        data={tags}
        refreshing={isrefreshing}
        onRefresh={loadTagsByKeyword}
        keyExtractor={(item: any) => item.id}
        renderItem={renderTagList}
        showsVerticalScrollIndicator={false}
      >
      </FlatList>
    </View>
  )
}

export default SearchTags

const styles = StyleSheet.create({})