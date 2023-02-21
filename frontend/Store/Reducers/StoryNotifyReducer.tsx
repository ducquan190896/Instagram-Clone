import { Post } from "./PostsReducer"
import { STORY } from "./StoryReducer"
import { USER } from "./UserReducer"

export interface STORYNOTIFY {
    id: number,
    type: string,
    creator: USER,
    receiver: USER,
    story: STORY,
    dateCreated: string
}

interface ACTION {
    type: string,
    payload?: any
}

interface declareState {
    storyNotifies:STORYNOTIFY[] | [],
    storyNotify: STORYNOTIFY | {},
    storyNotifySuccess: boolean,
    storyNotifyError: boolean,
    message: string | null
}

const initialState = {
    storyNotifies: [],
    storyNotify:  {},
    storyNotifySuccess: false,
    storyNotifyError: false,
    message: null
}

export default (state: declareState = initialState, action:ACTION) => {
    switch (action.type) {
        case "get_all_story_notify":
            return {
                ...state,
                storyNotifies: action.payload,
                storyNotifySuccess: true
            }
        case "error_story_notify":
            return {
                ...state,
                storyNotifyError: true,
                message: action.payload
            }
        default: 
        return state;
    }

}