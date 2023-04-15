import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { Button } from '@rneui/base'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type PollChoice = {
    choice: string, 
    index: number, 
    handleChoiceChange: (text: string, index: number) => void, 
    removeChoice: (index: number) => void}

const PollChoice = ({choice, index, handleChoiceChange, removeChoice}: PollChoice) => {
    const tw = useTailwind()
  return (
    <View style={tw('w-full flex-row items-center justify-center')}>
        <TextInput onChangeText={(text: string) => handleChoiceChange(text, index)}  placeholder={"choice " + (index + 1)} value={choice} style={tw(' flex-1 my-4 py-2 px-4 w-full bg-gray-200 text-base  rounded-lg border border-blue-500')}></TextInput>
        <TouchableOpacity onPress={() => removeChoice(index)} style={tw('ml-2 bg-gray-600 rounded-full')}>
            <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
    </View>
  )
}

export default PollChoice

const styles = StyleSheet.create({})