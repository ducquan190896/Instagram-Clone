import { USER } from "./UserReducer";

export interface COMMENTLIKE {
    id: number,
    ownerResponse: USER,
    postId: number,
    commentId: number,
    dateCreated: string
}
interface ACTION {
    type: string,
    payload?: any
}

interface declaredState  {
    commentLike: COMMENTLIKE | {},
    commentLikes: COMMENTLIKE[] | [],
    commentLikeSuccess: boolean,
    commentLikeError: boolean,
    message: string | null
}

const initialState = {
    commentLike:  {},
    commentLikes:  [],
    commentLikeSuccess: false,
    commentLikeError: false,
    message: null
}


export default (state: declaredState = initialState, action: ACTION) => {
    switch(action.type) {
        case "all_commentLikes_of_comment":
            return {
                ...state,
                commentLikes: action.payload,
                commentLikeSuccess: true
            }
        case "like_comment":
            return {
                ...state,
                commentLikes: [...state.commentLikes, action.payload],
                commentLikeSuccess: true
            }
        case "unlike_comment":
            return {
                ...state,
                commentLikes: state.commentLikes.filter(like => like.ownerResponse.id != action.payload),
                commentLikeSuccess: true
            }
        case "error_commentLike":
            return {
                ...state,
                commentLikeError: true,
                message: action.payload
            }
        case "reset_commentLike":
            return {
                ...state,
                commentLikeSuccess: false,
                commentLikeError: false,
                message: null
            }
        default:
            return state;
    }
}

