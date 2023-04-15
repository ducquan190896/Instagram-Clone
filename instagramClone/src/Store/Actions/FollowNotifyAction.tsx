import AsyncStorage from "@react-native-async-storage/async-storage"
import { Dispatch } from "react"
import { ACTION } from "../Reducers/UserReducer"
import { RootURL } from "../Store"

export const getFollowNotifyByAuthUserAction = () => async(dispatch: Dispatch<ACTION>, getState: any) => {
    try {
      
        const token = await AsyncStorage.getItem("token")
        console.log(token)
        const res = await fetch(RootURL + "/api/followNotification/allByAuthUser", {
            method: "GET",
            headers: {
                "Authorization": token ?? ""
            }
        })
        const data = await res.json()
        console.log("get_all_follow_notify")
        console.log(data)

        dispatch({
            type: "get_all_follow_notify",
            payload: data
        })

    } catch (err) {
        dispatch({
            type:"error_follow_notify",
            payload: err
        })
    }
}