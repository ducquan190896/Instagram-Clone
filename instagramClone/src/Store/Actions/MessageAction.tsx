import AsyncStorage from "@react-native-async-storage/async-storage"
import { Dispatch } from "react"
import { ACTION } from "../Reducers/UserReducer"
import { RootURL } from "../Store"

export interface MESSAGEFORM {
    text: string,
    chatId: number
}

export const getMessagesOfChatAction = (chatId: number) => async(dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token = await AsyncStorage.getItem("token")
        const res = await fetch(RootURL + `/api/messages/chat/${chatId}`, {
            method: "GET",
            headers: {
                "Authorization": token ?? ""
            }
        })
        const data = await res.json()
        console.log("get_messages_of_chat")
        console.log(data)

        dispatch({
            type: "get_messages_of_chat",
            payload: data
        })

    } catch (err) {
        dispatch({
            type: "error_message",
            payload: err
        })
    }
}

export const addMessageAction = (messageForm: MESSAGEFORM) => async(dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token = await AsyncStorage.getItem("token")
        const res = await fetch(RootURL + "/api/messages/addMessage", {
            method: "POST",
            headers: {
                "Authorization": token ?? "",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(messageForm)
        })
        const data = await res.json()
        console.log("add_message")
        console.log(data)

        dispatch({
            type: "add_message",
            payload: data
        })

    } catch (err) {
        dispatch({
            type: "error_message",
            payload: err
        })
    }
}

export const removeMessageAction = (messageId: number) => async(dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token = await AsyncStorage.getItem("token")
        await fetch(RootURL + `/api/messages/removeMessage/${messageId}`, {
            method: "DELETE",
            headers: {
                "Authorization": token ?? ""
            }
        })
        
        console.log("delete_message")
        

        dispatch({
            type: "delete_message",
            payload: messageId
        })

    } catch (err) {
        dispatch({
            type: "error_message",
            payload: err
        })
    }
}

export const clearMessagesAction = () => async(dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        dispatch({
            type: "clear_messages"
        })

    } catch (err) {
        dispatch({
            type: "error_message",
            payload: err
        })
    }
}