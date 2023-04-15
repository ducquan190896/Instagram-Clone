import AsyncStorage from "@react-native-async-storage/async-storage"
import { Dispatch } from "react"
import { ACTION } from "../Reducers/UserReducer"
import { RootURL } from "../Store"

export const getStoryNotifyByAuthUserAction = () => async(dispatch: Dispatch<ACTION>, getState: any) => {
    try {
      
        const token = await AsyncStorage.getItem("token")
        console.log(token)
        const res = await fetch(RootURL + "/api/storyNotifications/authReceiver/all", {
            method: "GET",
            headers: {
                "Authorization": token ?? ""
            }
        })
        const data = await res.json()
        console.log("get_all_story_notify")
        console.log(data)

        dispatch({
            type: "get_all_story_notify",
            payload: data
        })

    } catch (err) {
        dispatch({
            type:"error_story_notify",
            payload: err
        })
    }
}