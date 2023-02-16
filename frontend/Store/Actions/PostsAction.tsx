import { Dispatch } from "react";
import { ACTION } from "../Reducers/UserReducer";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Alert } from "react-native";
import { Post } from "../Reducers/PostsReducer";

export interface FormPost {
    imageUrls: string[],
    content: string,
    tags: string[] | []
}

export interface PollInput {
    question: string,
    expireDays: number,
    choices: string[]
}

export interface FormPoll {
    content: string,
    tags: string[] | [],
    poll: PollInput
}

export const getPostsOfFollowingsAndAuthUser = () => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        console.log("dispatch")
        let data : Post[] | [] = [];
        // const {posts} = getState.POSTS
        const token: string  = await AsyncStorage.getItem("token") ?? "";
        console.log(token)
        if(!token) {
            console.log("no token")
        }
        const res1 = await fetch("http://10.0.2.2:8080/api/posts/user/allPostOfFollowings", {
            method: "GET",
            headers: {
                "Authorization": token ?? ""
            }
        })
        const data1 = await res1.json()

        const res2 = await fetch("http://10.0.2.2:8080/api/posts/user/postsOfAuthUser", {
            method: "GET",
            headers: {
                "Authorization": token ?? ""
            }
        })
        const data2 = await res2.json()

        data = [...data1, ...data2]

         data.sort((a : Post, b: Post) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime())

        console.log("posts of main page")
        console.log(data)

        dispatch({
            type: "get_all_post_home_page",
            payload: data
        })

        // console.log(posts)

    } catch (err) {
        dispatch({
            type: "error_post",
            payload: err
        })
    } 

}

export const getPostsOfAuthUser = () => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
      
        const token: string | null = await AsyncStorage.getItem("token");
     

        const res = await fetch("http://10.0.2.2:8080/api/posts/user/postsOfAuthUser", {
            method: "GET",
            headers: {
                "Authorization": token ?? ""
            }
        })
        const data = await res.json()
        
        data.sort((a : Post, b: Post) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime())
     
        console.log("posts of Auth User")
        console.log(data)

        dispatch({
            type: "get_all_post_authUser",
            payload: data
        })


    } catch (err) {
        dispatch({
            type: "error_post",
            payload: err
        })
    } 

}

export const getPostByPostIdAfterUpdate = (postId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
      console.log("get post after update")
        const token: string | null = await AsyncStorage.getItem("token");
        console.log(token)

        const res = await fetch(`http://10.0.2.2:8080/api/posts/user/post/${postId}`, {
            method: "GET",
            headers: {
                "Authorization": token ?? ""
            }
        })
        console.log("res")
        const data = await res.json()
      
    
     
        console.log("posts of Auth User")
        console.log(data)

        dispatch({
            type: "get_post_by_postId_after_updating",
            payload: data
        })


    } catch (err) {
        dispatch({
            type: "error_post",
            payload: err
        })
    } 

}

export const createPostAction = (formPost: FormPost) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
     
        const token: string | null = await AsyncStorage.getItem("token");
        console.log(token)

        const res = await fetch("http://10.0.2.2:8080/api/posts/savePost", {
            method: "POST",
            headers: {
                "Authorization": token ?? "",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formPost)
        })
        console.log("res")
        const data = await res.json()
      
    
     
        console.log("create post")
        console.log(data)

        dispatch({
            type: "create_post",
            payload: data
        })


    } catch (err) {
        dispatch({
            type: "error_post",
            payload: err
        })
    } 

}

export const createPollAction = (formPoll: FormPoll) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
     
        const token: string | null = await AsyncStorage.getItem("token");
        console.log(token)

        const res = await fetch("http://10.0.2.2:8080/api/posts/poll/savePost", {
            method: "POST",
            headers: {
                "Authorization": token ?? "",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formPoll)
        })
        console.log("res")
        const data = await res.json()
      
    
     
        console.log("create Poll")
        console.log(data)

        dispatch({
            type: "create_poll",
            payload: data
        })


    } catch (err) {
        dispatch({
            type: "error_post",
            payload: err
        })
    } 

}

export const getPostsOfActiveUserAction = (userId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {

        const res = await fetch(`http://10.0.2.2:8080/api/posts/user/allPostOfActiveUser/${userId}`)
        const data = await res.json()
        
        data.sort((a : Post, b: Post) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime())
     
        console.log("get_posts_of_active_user")
        console.log(data)

        dispatch({
            type: "get_posts_of_active_user",
            payload: data
        })


    } catch (err) {
        dispatch({
            type: "error_post",
            payload: err
        })
    } 

}


export const ResetPosts = () => (dispatch : Dispatch<ACTION>, getState: any) => {
    dispatch({
        type: "reset_post"
    })
}