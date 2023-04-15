import { USER } from "./UserReducer";

export interface STORYLIKE {
    id: number,
    dateCreated: string,
    owner: USER,
    storyId: number
}

interface ACTION {
    type: string,
    payload?: any
}

interface declaredState {
    storyLike: STORYLIKE | {},
    storyLikes: STORYLIKE[] | [],
    storyLikeStatus: boolean,
    storyLikeSuccess: boolean,
    storyLikeError: boolean,
    message: string | null
}

const initialState = {
    storyLike:  {},
    storyLikes:  [],
    storyLikeStatus: false,
    storyLikeSuccess: false,
    storyLikeError: false,
    message: null
}
export default (state: declaredState=  initialState, action: ACTION) => {
    switch(action.type) {
        case "check_storyLike_By_AuthUser":
            return {
                ...state,
                storyLikeStatus: action.payload,
                storyLikeSuccess: true
            }
        case "like_storyLike":
            return {
                ...state,
                storyLike: action.payload,
                storyLikeSuccess: true
            }
        case "unlike_storyLike":
            return {
                ...state,
                storyLikeSuccess: true
            }
        case "error_storyLike":
            return {
                ...state,
                message: action.payload,
                storyLikeError: true
            }
        default:
            return state;
    }
}