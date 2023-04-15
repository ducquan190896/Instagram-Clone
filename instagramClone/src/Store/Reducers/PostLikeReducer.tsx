import { USER } from "./UserReducer"

interface ACTION {
    type: string,
    payload?: any
}

export interface POSTLIKE {
    id: number,
    userResponse: USER,
    postId: number
}

interface declaredState {
    postLikes: POSTLIKE[] |[],
    postLike: POSTLIKE | {},
    postLikeSuccess: boolean,
    postlikeError: boolean,
    message: string | null
}

let initialState = {
    postLikes: [],
    postLike: {},
    postLikeSuccess: false,
    postlikeError: false,
    message: null
}
export default (state : declaredState = initialState, action: ACTION) => {
    switch (action.type) {
       case "get_post_likes_of_post":
            return {
                ...state,
                postLikes: action.payload,
                postLikeSuccess: true
            }
        case "add_post_like":
            return {
                ...state,
                postLike: action.payload,
                postLikes: [...state.postLikes, action.payload],
                postLikeSuccess: true
            }
        case "remove_post_like":
                return {
               ...state,
                postLikes: state.postLikes.filter(like => like.userResponse.id != action.payload),
                postLikeSuccess: true
            }
        case "error_post_like":
            return {
                ...state,
                postlikeError: true,
                message: action.payload
            }
        case "reset_postLike":
            return {
                ...state,
                postLikeSuccess: false,
                postlikeError: false,
                message: null
            }
        default:
            return state;
    }
}
