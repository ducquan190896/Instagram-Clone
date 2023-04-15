import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import { MESSAGE } from '../Store/Reducers/MessageReducer'
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch, useSelector } from 'react-redux'
import { USER } from '../Store/Reducers/UserReducer'
import { RootState, RootURL } from '../Store/Store'
import { Button } from '@rneui/base'
import { removeMessageAction } from '../Store/Actions/MessageAction'

const MessageItem = ({item}: {item: MESSAGE}) => {
    const tw = useTailwind()
    const dispatch = useDispatch()
    const [isDelete, setIsDelete] = useState<boolean>(false)
    const {user, userSuccess, userError} = useSelector((state: RootState) => state.USERS)
    const [isAuthUser, setIsAuthUser] =  useState<boolean>(item?.participant?.owner.id == user.id ? true: false)

    const deleteMessageFunction = async () => {
        await dispatch(removeMessageAction(item.id) as any)
    }

  return (
    <>
    {isAuthUser ? (
        <View style={tw('w-full')}>
        <View style={[tw('w-2/3 my-2 px-4 flex flex-row items-center justify-end'), {alignSelf: 'flex-end'}]}>
            <TouchableOpacity onPress={() => setIsDelete(!isDelete )} style={tw('p-2 rounded-lg bg-gray-300')}>
                <Text style={tw('text-base text-black')}>{item.text}</Text>
            </TouchableOpacity>
            <Image style={[tw('w-8 h-8 rounded-full bg-white ml-2 mr-2'), {resizeMode: 'contain'}]} source={user.avatarUrl ? {uri: RootURL + user.avatarUrl}: require("../assets/download.png")}></Image>
        </View>
        {isDelete && (
             <View style={[tw('w-2/3 my-2 mr-10 px-4 flex flex-row items-center justify-end'), {alignSelf: 'flex-end'}]}>
            <Button onPress={deleteMessageFunction} title="delete" buttonStyle={tw(' bg-blue-500 rounded-lg w-20 h-10')}></Button>
            </View>
        )}
         </View>
    ) : (
        <View style={tw('w-full')}>
        <View style={[tw('w-2/3 my-2 px-2 flex flex-row items-center justify-start'), {alignSelf: 'flex-start'}]}>
            <Image style={[tw('w-8 h-8 rounded-full bg-white ml-2 mr-2'), {resizeMode: 'contain'}]} source={item?.participant.owner.avatarUrl ? {uri: RootURL + item?.participant.owner.avatarUrl}: require("../assets/download.png")}></Image>
            <TouchableOpacity onPress={() => setIsDelete(!isDelete )} style={tw('p-2 rounded-lg bg-gray-300')}>
                <Text style={tw('text-base text-black')}>{item.text}</Text>
            </TouchableOpacity>
        
        </View>
        {isDelete && (
             <View style={[tw('w-2/3 my-2 ml-10 px-4 flex flex-row items-center justify-start'), {alignSelf: 'flex-start'}]}>
            <Button onPress={deleteMessageFunction} title="delete" buttonStyle={tw(' bg-blue-500 rounded-lg w-20 h-10')}></Button>
            </View>
        )}
         </View>
    )}
    </>
  )
}

export default MessageItem

const styles = StyleSheet.create({})