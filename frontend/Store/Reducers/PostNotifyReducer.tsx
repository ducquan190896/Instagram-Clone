import { Post } from "./PostsReducer"
import { USER } from "./UserReducer"

export interface POSTNOTIFY {
    id: number,
    type: string,
    creatorResponse: USER,
    receiverResponse: USER,
    postResponse: Post,
    dateCreated: string
}

interface ACTION {
    type: string,
    payload?: any
}

interface declareState {
    postNotifies:POSTNOTIFY[] | [],
    postNotify: POSTNOTIFY | {},
    postNotifySuccess: boolean,
    postNotifyError: boolean,
    message: string | null
}

const initialState = {
    postNotifies: [],
    postNotify:  {},
    postNotifySuccess: false,
    postNotifyError: false,
    message: null
}

export default (state: declareState = initialState, action:ACTION) => {
    switch (action.type) {
        case "get_all_post_notify":
            return {
                ...state,
                postNotifies: action.payload,
                postNotifySuccess: true
            }
        case "error_post_notify":
            return {
                ...state,
                postNotifyError: true,
                message: action.payload
            }
        default: 
        return state;
    }

}