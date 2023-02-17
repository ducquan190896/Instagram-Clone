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
            type: "error_tag",
            payload: err
        })
    }
}

export const addCommentToPost = (commentFormOfPost: CommentOfPost) => async(dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token = await AsyncStorage.getItem("item")
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
            type: "error_tag",
            payload: err
        })
    }
}

export const addCommentToParentComment = (commentFormOfParentComment: CommentOfComment) => async(dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token = await AsyncStorage.getItem("item")
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
            type: "error_tag",
            payload: err
        })
    }
}