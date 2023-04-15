import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch } from "redux";
import { ACTION } from "../Reducers/UserReducer";
import { RootURL } from "../Store";

export const addFollowAction = (userId: number) => async (dispatch: Dispatch<ACTION>, getState: any) =>  {
    try {
        const token = await AsyncStorage.getItem("token")
        const res = await fetch(RootURL +  `/api/follow/followUser/${userId}`, {
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
        const res = await fetch(RootURL +  `/api/follow/getFollowers/${userId}`)
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
     
        const res = await fetch(RootURL +  `/api/follow/getFollowings/${userId}`)
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
         await fetch(RootURL +  `/api/follow/unfollowUser/${userId}`, {
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
