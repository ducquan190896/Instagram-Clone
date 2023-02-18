import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch } from "react";
import { ACTION } from "../Reducers/UserReducer";

export interface STORYFORM {
    imageUrls: string[] | []
}

export const getStoriesOfFollowingsAction = () => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token = await AsyncStorage.getItem("token")
        const res = await fetch("http://localhost:8080/api/stories/authUser/allByFollowings", {
            method: "GET",
            headers: {
                "Authorization": token ?? ""
            }
        })
        const data = await res.json()

        console.log("get_stories_by_followings_and_authUser")
        console.log(data)
        dispatch({
            type: "get_stories_by_followings_and_authUser",
            payload: data
        })

    } catch(err) {
        dispatch({
            type: "error_story",
            payload: err
        })
    }
}


export const getStoryByidAction = (storyId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token = await AsyncStorage.getItem("token")
        const res = await fetch(`http://localhost:8080/api/stories/story/${storyId}`, {
            method: "GET",
            headers: {
                "Authorization": token ?? ""
            }
        })
        const data = await res.json()

        console.log("get_story_by_id")
        console.log(data)
        dispatch({
            type: "get_story_by_id",
            payload: data
        })

    } catch(err) {
        dispatch({
            type: "error_story",
            payload: err
        })
    }
}

export const deleteStoryAction = (storyId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token = await AsyncStorage.getItem("token")
        await fetch(`http://localhost:8080/api/stories/authUser/deleteStory/${storyId}`, {
            method: "DELETE",
            headers: {
                "Authorization": token ?? ""
            }
        })
        console.log("delete_story")
        
        dispatch({
            type: "delete_story",
            payload: storyId
        })

    } catch(err) {
        dispatch({
            type: "error_story",
            payload: err
        })
    }
}

export const createStoryAction = (storyForm: STORYFORM) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token = await AsyncStorage.getItem("token")
        const res = await fetch("http://localhost:8080/api/stories/authUser/createStory", {
            method: "POST",
            headers: {
                "Authorization": token ?? "",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(storyForm)
        })
        const data = await res.json()

        console.log("create_story")
        console.log(data)
        dispatch({
            type: "create_story",
            payload: data
        })

    } catch(err) {
        dispatch({
            type: "error_story",
            payload: err
        })
    }
}