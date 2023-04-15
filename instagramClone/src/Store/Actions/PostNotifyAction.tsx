import AsyncStorage from "@react-native-async-storage/async-storage"
import { Dispatch } from "react"
import { ACTION } from "../Reducers/UserReducer"
import { RootURL } from "../Store"

export const getPostNotifyByAuthUserAction = () => async(dispatch: Dispatch<ACTION>, getState: any) => {
    try {
      
        const token = await AsyncStorage.getItem("token")
        console.log(token)
        const res = await fetch(RootURL + "/api/postNotifications/allForAuthUser", {
            method: "GET",
            headers: {
                "Authorization": token ?? ""
            }
        })
        const data = await res.json()
        console.log("get_all_post_notify")
        console.log(data)

        dispatch({
            type: "get_all_post_notify",
            payload: data
        })

    } catch (err) {
        dispatch({
            type:"error_post_notify",
            payload: err
        })
    }
}