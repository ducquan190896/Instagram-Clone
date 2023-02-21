import AsyncStorage from "@react-native-async-storage/async-storage"
import { Dispatch } from "react";
import { ACTION } from "../Reducers/UserReducer"

export const checkStoryLikeStatus = (storyId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token = await AsyncStorage.getItem("token")
        const res = await fetch(`http://10.0.2.2:8080/api/storyLikes/checkStoryLikeByAuthUser/${storyId}`, {
            method: "GET",
            headers: {
                "Authorization": token ?? ""
            }
        })
        const data = await res.json()

        console.log("check_storyLike_By_AuthUser")
        console.log(data)
        dispatch({
            type: "check_storyLike_By_AuthUser",
            payload: data
        })

    } catch(err) {
        dispatch({
            type: "error_storyLike",
            payload: err
        })
    }
}
export const likeStoryAction = (storyId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token = await AsyncStorage.getItem("token")
        const res = await fetch(`http://10.0.2.2:8080/api/storyLikes/story/${storyId}`, {
            method: "POST",
            headers: {
                "Authorization": token ?? ""
            }
        })
        const data = await res.json()

        console.log("like_storyLike")
        console.log(data)
        dispatch({
            type: "like_storyLike",
            payload: data
        })

    } catch(err) {
        dispatch({
            type: "error_storyLike",
            payload: err
        })
    }
}
export const unlikeStoryAction = (storyId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token = await AsyncStorage.getItem("token")
        await fetch(`http://10.0.2.2:8080/api/storyLikes/story/${storyId}`, {
            method: "DELETE",
            headers: {
                "Authorization": token ?? ""
            }
        })
      

        console.log("unlike_storyLike")
      
        dispatch({
            type: "unlike_storyLike"
        })

    } catch(err) {
        dispatch({
            type: "error_storyLike",
            payload: err
        })
    }
}
export const errorStoryLikeAction = (err: string) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    dispatch({
        type: "error_storyLike",
        payload: err
    })
}