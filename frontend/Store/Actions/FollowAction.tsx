import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch } from "redux";
import { ACTION } from "../Reducers/UserReducer";

export const addFollowAction = (userId: number) => async (dispatch: Dispatch<ACTION>, getState: any) =>  {
    try {
        const token = await AsyncStorage.getItem("token")
        const res = await fetch(`http://10.0.2.2:8080/api/follow/followUser/${userId}`, {
            method: "POST",
            headers: {
                "Authorization": token ?? ""
            }
        })
        const data = await res.json()
        console.log(data)

        dispatch({
            type: "add_follow",
            payload: data
        })
    } catch (err) {
        dispatch({
            type: "error_follow",
            payload: err
        })
    }
}

export const getFollowersAction = (userId: number) => async (dispatch: Dispatch<ACTION>, getState: any) =>  {
    try {
     
        const res = await fetch(`http://10.0.2.2:8080/api/follow/getFollowers/${userId}`)
        const data = await res.json()
        console.log(data)

        dispatch({
            type: "get_followers",
            payload: data
        })
    } catch (err) {
        dispatch({
            type: "error_follow",
            payload: err
        })
    }
}

export const getFollowingsAction = (userId: number) => async (dispatch: Dispatch<ACTION>, getState: any) =>  {
    try {
     
        const res = await fetch(`http://10.0.2.2:8080/api/follow/getFollowings/${userId}`)
        const data = await res.json()
        console.log(data)

        dispatch({
            type: "get_followings",
            payload: data
        })
    } catch (err) {
        dispatch({
            type: "error_follow",
            payload: err
        })
    }
}

export const removeFollowAction = (userId: number) => async (dispatch: Dispatch<ACTION>, getState: any) =>  {
    try {
        const token = await AsyncStorage.getItem("token")
         await fetch(`http://10.0.2.2:8080/api/follow/unfollowUser/${userId}`, {
            method: "DELETE",
            headers: {
                "Authorization": token ?? ""
            }
        })
      

        dispatch({
            type: "add_follow",
            payload: userId
        })
    } catch (err) {
        dispatch({
            type: "error_follow",
            payload: err
        })
    }
}

export const resetFollow = () => async (dispatch: Dispatch<ACTION>, getState: any) => {
    dispatch({
        type: "reset_follow"
    })
}
