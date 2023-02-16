import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch } from "redux";
import { ACTION } from "../Reducers/UserReducer";


export const addVoteToPoll = (pollId: number, choiceId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {

        const token = await AsyncStorage.getItem("token")
        const res = await fetch(`http://10.0.2.2:8080/api/votes/addVote/poll/${pollId}/choice/${choiceId}`, {
            method: "POST",
            headers: {
                "Authorization": token ?? "",
            }
        })
        const data = await res.json()
        console.log(data)
        dispatch({
            type: "add_vote",
            payload: data
        })


    } catch (err) {
        dispatch({
            type: "error_vote",
            payload: err
        })
    }
}

export const getVotesOfPoll = (pollId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token = await AsyncStorage.getItem("token")
        const res = await fetch(`http://10.0.2.2:8080/api/votes/poll/${pollId}`, {
            method: "GET",
            headers: {
                "Authorization": token ?? "",
            }
        })
        const data = await res.json()
        console.log(data)
        dispatch({
            type: "get_votes_of_poll",
            payload: data
        })


    } catch (err) {
        dispatch({
            type: "error_vote",
            payload: err
        })
    }
}

export const ResetVotes = () => (dispatch : Dispatch<ACTION>, getState: any) => {
    dispatch({
        type: "reset_vote"
    })
}