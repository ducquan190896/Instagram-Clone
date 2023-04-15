import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import StoryAdderItem from './StoryAdderItem'
import { STORY } from '../../Store/Reducers/StoryReducer'
import StoryItem from './StoryItem'

const StoryList = ({stories, navigation}: {stories: STORY[], navigation: any}) => {
   const tw = useTailwind()

   return (
      <ScrollView 
         // style={tw('py-2')}
         showsHorizontalScrollIndicator={false}
         horizontal
         bounces={false}
      >
            <StoryAdderItem onPress={() => navigation.navigate("StoryCreateForm")}></StoryAdderItem>
            {stories && stories.length > 0 && stories.map((story: STORY, index: number) =>  <StoryItem navigation={navigation} index={index} key={story.id} story={story}></StoryItem>)}  
      </ScrollView>
   )
}

export default StoryList

const styles = StyleSheet.create({})