import { Post } from "./PostsReducer";
import { USER } from "./UserReducer";

export interface COMMENTNOTIFY {
    id: number,
    type: string,
    creatorResponse: USER,
    receiverResponse: USER,
    postResponse: Post,
    commentContent: string,
    parentCommentId: number,
    dateCreated: string
}

interface ACTION {
    type: string,
    payload?: any
}

interface declareState {
    commentNotifies:COMMENTNOTIFY[] | [],
    commentNotify: COMMENTNOTIFY | {},
    commentNotifySuccess: boolean,
    commentNotifyError: boolean,
    message: string | null
}

const initialState = {
    commentNotifies: [],
    commentNotify:  {},
    commentNotifySuccess: false,
    commentNotifyError: false,
    message: null
}

export default (state: declareState = initialState, action:ACTION) => {
    switch (action.type) {
        case "get_all_comment_notify":
            return {
                ...state,
                commentNotifies: action.payload,
                commentNotifySuccess: true
            }
        case "error_comment_notify":
            return {
                ...state,
                commentNotifyError: true,
                message: action.payload
            }
        default: 
            return state;
    }

}