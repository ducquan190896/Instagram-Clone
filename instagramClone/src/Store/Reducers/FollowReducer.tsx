import { USER } from "./UserReducer";

export interface FOLLOW {
    id: number,
    follower: USER,
    following: USER
}
interface ACTION {
    type: string,
    payload?: any
}

interface declaredState {
    follow: FOLLOW | {},
    follows: FOLLOW[] | [],
    followSuccess: boolean,
    followError: boolean,
    message: string | null
}

let initialState = {
    follow: {},
    follows: [],
    followSuccess: false,
    followError: false,
    message: null
}

export default (state: declaredState = initialState, action: ACTION) => {
    switch (action.type) {
        case "add_follow":
            return {
                ...state,
                follow: action.payload,
                followSuccess: true,
                follows: [action.payload, ...state.follows]
            }
        case "remove_follow":
            return {
                ...state,
                followSuccess: true,
                follows: state.follows.filter(fol => fol.follower.id != action.payload)
            }
        case "get_followings":
            return {
                ...state,
                followSuccess: true,
                follows: action.payload
            }
        case "get_followers":
            return {
                ...state,
                followSuccess: true,
                follows: action.payload
            }
        case "error_follow":
            return {
                ...state,
                followError: true,
                message: action.payload
            }
        case "reset_follow":
            return {
                ...state,
                followSuccess: false,
                followError: false,
                message: null
            }
        default:
            return state;
    }
}