import { Post } from "./PostsReducer"
import { USER } from "./UserReducer"

export interface FOLLOWNOTIFY {
    id: number,
    type: string,
    creator: USER,
    receiver: USER,
    dateCreated: string
}

interface ACTION {
    type: string,
    payload?: any
}

interface declareState {
    followNotifies:FOLLOWNOTIFY[] | [],
    followNotify: FOLLOWNOTIFY | {},
    followNotifySuccess: boolean,
    followNotifyError: boolean,
    message: string | null
}

const initialState = {
    followNotifies: [],
    followNotify:  {},
    followNotifySuccess: false,
    followNotifyError: false,
    message: null
}

export default (state: declareState = initialState, action:ACTION) => {
    switch (action.type) {
        case "get_all_follow_notify":
            return {
                ...state,
                followNotifies: action.payload,
                followNotifySuccess: true
            }
        case "error_follow_notify":
            return {
                ...state,
                followNotifyError: true,
                message: action.payload
            }
        default: 
            return state;
    }

}