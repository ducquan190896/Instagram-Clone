import { Dispatch } from "react";
import { ACTION } from "../Reducers/UserReducer";
import { RootURL } from "../Store";


export const getAllTags = () => async(dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await fetch(RootURL + "/api/tags/all")
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
        const res = await fetch(RootURL + `/api/tags/searchingContent/${keyword}`)
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