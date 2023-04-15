import { StyleSheet, Text, View, ListRenderItem, FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import { getPostsBySearchKeyword, ResetPosts } from '../../Store/Actions/PostsAction'
import { RootState } from '../../Store/Store'
import { Post } from '../../Store/Reducers/PostsReducer'
import HomePostCard from '../../Components/HomePostCard'
import LoadingComponent from '../../Components/LoadingComponent'
type searchProps = {
  keyword: string,
  navigation: any
}

const SearchPosts = ({keyword, navigation}: searchProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isrefreshing, setIsrefreshing] = useState<boolean>(false);
  const tw = useTailwind()
  const dispatch = useDispatch()
  const {posts, postSuccess, postError} = useSelector((state: RootState) => state.POSTS)

  const loadPostByKeyword = useCallback(async ()=> {
      if(keyword && keyword.length > 0) {
        setIsrefreshing(true);
        await dispatch(getPostsBySearchKeyword(keyword) as any)
        setIsrefreshing(false);
      }
  }, [keyword])

  useEffect(() => {
    setIsLoading(true)
    loadPostByKeyword().then(() => setIsLoading(false))
  }, [keyword])

  // useEffect(() => {
  //   if(postSuccess || postError) {
  //     dispatch(ResetPosts() as any)
  //   }
  // }, [postSuccess, postError])

  const renderPostList: ListRenderItem<any> = ({item}: {item: Post}) => (
    <HomePostCard post={item} isLoading={isLoading} setIsLoading={setIsLoading} navigation={navigation}></HomePostCard>  
    )

    if(isLoading) {
      return <LoadingComponent/>
  }

  if(!isLoading && posts && (posts as Post[]).length <= 0) {
      return <View style={tw('flex-1 items-center justify-center')}>
          <Text style={tw('text-lg font-bold text-center')}>No Posts</Text>
      </View>
  }


  return (
    <View style={tw('flex-1')}>
      <FlatList
                data={posts}
                refreshing={isrefreshing}
                onRefresh={loadPostByKeyword}
                keyExtractor={(item: any) => item.id}
                renderItem={renderPostList}
                showsVerticalScrollIndicator={false}
                >
        </FlatList>
    </View>
  )
}

export default SearchPosts

const styles = StyleSheet.create({})