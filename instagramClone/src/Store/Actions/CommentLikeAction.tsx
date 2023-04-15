import AsyncStorage from "@react-native-async-storage/async-storage"
import { Dispatch } from "react"
import { ACTION } from "../Reducers/UserReducer"
import { RootURL } from "../Store"

export const getCommentLiksByCommentAction = (commentId: number) => async(dispatch: Dispatch<ACTION>, getState: any) => {
    try {
       
        const token = await AsyncStorage.getItem("token")
        console.log(token)
        const res = await fetch(RootURL + `/api/commentLike/allByComment/${commentId}`, {
            method: "GET",
            headers: {
                "Authorization": token ?? ""
            }
        })
        const data = await res.json()
        console.log("all_commentLikes_of_comment")
        console.log(data)

        dispatch({
            type: "all_commentLikes_of_comment",
            payload: data
        })

    } catch (err) {
        dispatch({
            type: "error_commentLike",
            payload: err
        })
    }
}

export const addCommentLikeAction = (commentId: number, postId: number) => async(dispatch: Dispatch<ACTION>, getState: any) => {
    try {
       
        const token = await AsyncStorage.getItem("token")
        console.log(token)
        const res = await fetch(RootURL + `/api/commentLike/likeComment/comment/${commentId}/post/${postId}`, {
            method: "POST",
            headers: {
                "Authorization": token ?? ""
            }
        })
        const data = await res.json()
        console.log("like_comment")
        console.log(data)

        dispatch({
            type: "like_comment",
            payload: data
        })

    } catch (err) {
        dispatch({
            type: "error_commentLike",
            payload: err
        })
    }
}

export const unlikeCommentAction = (commentId: number, ownerId: number) => async(dispatch: Dispatch<ACTION>, getState: any) => {
    try {
       
        const token = await AsyncStorage.getItem("token")
        console.log(token)
         await fetch(RootURL + `/api/commentLike/removeLikeFromComment/comment/${commentId}`, {
            method: "DELETE",
            headers: {
                "Authorization": token ?? ""
            }
        })
       
        console.log("unlike_comment")
 

        dispatch({
            type: "unlike_comment",
            payload: ownerId
        })

    } catch (err) {
        dispatch({
            type: "error_commentLike",
            payload: err
        })
    }
}

export const resetCommentLikeAction = () => (dispatch: Dispatch<ACTION>, getState: any) =>{
    dispatch({
        type: "reset_commentLike"
    })
}

export const errorCommentLikeAction = (err: string) => (dispatch: Dispatch<ACTION>, getState: any) =>{
    dispatch({
        type: "error_commentLike",
        payload: err
    })
}