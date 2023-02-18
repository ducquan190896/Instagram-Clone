import AsyncStorage from "@react-native-async-storage/async-storage"
import { Dispatch } from "react"
import { ACTION } from "../Reducers/UserReducer"

export interface CommentOfPost {
    content: string,
    postId: number
}

export interface CommentOfComment {
    content: string,
    postId: number,
    parentCommentId: number
}

export const getCommentsOfPost = (postId: number) => async(dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await fetch(`http://10.0.2.2:8080/api/comments/post/${postId}`)
        const data = await res.json()
        console.log("get_comments_of_post")
        console.log(data)

        dispatch({
            type: "get_comments_of_post",
            payload: data
        })

    } catch (err) {
        dispatch({
            type: "error_comment",
            payload: err
        })
    }
}
export const getCommentByIdAction = (commentId: number) => async(dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await fetch(`http://10.0.2.2:8080/api/comments/comment/${commentId}`)
        const data = await res.json()
        console.log("get_comment_by_id")
        console.log(data)

        dispatch({
            type: "get_comment_by_id",
            payload: data
        })

    } catch (err) {
        dispatch({
            type: "error_comment",
            payload: err
        })
    }
}

export const addCommentToPost = (commentFormOfPost: CommentOfPost) => async(dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        console.log("add_comment_to_post")
        const token = await AsyncStorage.getItem("token")
        console.log(token)
        const res = await fetch("http://10.0.2.2:8080/api/comments/addCommentToPost", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ?? ""
            },
            body: JSON.stringify(commentFormOfPost)
        })
        const data = await res.json()
        console.log("add_comment_to_post")
        console.log(data)

        dispatch({
            type: "add_comment_to_post",
            payload: data
        })

    } catch (err) {
        dispatch({
            type: "error_comment",
            payload: err
        })
    }
}

export const addCommentToParentComment = (commentFormOfParentComment: CommentOfComment) => async(dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token = await AsyncStorage.getItem("token")
        const res = await fetch("http://10.0.2.2:8080/api/comments/addCommentToParentComment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ?? ""
            },
            body: JSON.stringify(commentFormOfParentComment)
        })
        const data = await res.json()
        console.log("add_comment_to_post")
        console.log(data)

        dispatch({
            type: "add_comment_to_post",
            payload: data
        })

    } catch (err) {
        dispatch({
            type: "error_comment",
            payload: err
        })
    }
}
export const resetCommentAction = () => (dispatch: Dispatch<ACTION>, getState: any) =>{
    dispatch({
        type: "reset_comment"
    })
}