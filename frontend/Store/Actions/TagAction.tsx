import { Dispatch } from "react";
import { ACTION } from "../Reducers/UserReducer";


export const getAllTags = () => async(dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await fetch("http://10.0.2.2:8080/api/tags/all")
        const data = await res.json()
        console.log(data)

        dispatch({
            type: "get_tags",
            payload: data
        })

    } catch (err) {
        dispatch({
            type: "error_tag",
            payload: err
        })
    }
}

export const getTagsByKeyword = (keyword: string) => async(dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await fetch(`http://10.0.2.2:8080/api/tags/searchingContent/${keyword}`)
        const data = await res.json()
        console.log(data)

        dispatch({
            type: "get_tags_by_search_keyword",
            payload: data
        })

    } catch (err) {
        dispatch({
            type: "error_tag",
            payload: err
        })
    }
}

export const ResetTag = () => (dispatch : Dispatch<ACTION>, getState: any) => {
    dispatch({
        type: "reset_tag"
    })
}