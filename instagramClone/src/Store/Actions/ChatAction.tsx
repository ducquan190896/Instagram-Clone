import AsyncStorage from "@react-native-async-storage/async-storage"
import { Dispatch } from "react"
import { ACTION } from "../Reducers/UserReducer"
import { RootURL } from "../Store"

export const getAllChatsByAuthAction = () => async(dispatch: Dispatch<ACTION>, getState: any) => {
    try {
      
        const token = await AsyncStorage.getItem("token")
        const res = await fetch(RootURL + "/api/chats/byAuthUser", {
            method: "GET",
            headers: {
                "Authorization": token ?? ""
            }
        })
        const data = await res.json()
        console.log("get_all_chats_by_authUser")
        console.log(data)

        dispatch({
            type: "get_all_chats_by_authUser",
            payload: data
        })

    } catch (err) {
        dispatch({
            type: "error_chat",
            payload: err
        })
    }
}
export const getOrAddChatAction = (receiverId: number) => async(dispatch: Dispatch<ACTION>, getState: any) => {
    try {
      
        const token = await AsyncStorage.getItem("token")
        const res = await fetch(RootURL + `/api/chats/receiver/${receiverId}`, {
            method: "GET",
            headers: {
                "Authorization": token ?? ""
            }
        })
        const data = await res.json()
        console.log("get_chat_by_receiver")
        console.log(data)

        dispatch({
            type: "get_chat_by_receiver",
            payload: data
        })

    } catch (err) {
        dispatch({
            type: "error_chat",
            payload: err
        })
    }
}
export const getChatByIdAction = (chatId: number) => async(dispatch: Dispatch<ACTION>, getState: any) => {
    try {
      
        const token = await AsyncStorage.getItem("token")
        const res = await fetch(RootURL + `/api/chats/chat/${chatId}`, {
            method: "GET",
            headers: {
                "Authorization": token ?? ""
            }
        })
        const data = await res.json()
        console.log("get_chat_by_id")
        console.log(data)

        dispatch({
            type: "get_chat_by_id",
            payload: data
        })

    } catch (err) {
        dispatch({
            type: "error_chat",
            payload: err
        })
    }
}

export const resetChatACtion = () => (dispatch: Dispatch<ACTION>, getState: any) => { 
    dispatch({
        type: "reset_chat"
    })
}

