import { Post } from "../Reducers/PostsReducer";
import { USER } from "../Reducers/UserReducer";

export interface COMMENT {
    id: number,
    content: string,
    nestedCommentCount: number,
    commentLikeCount: number,
    ownerResposne: USER,
    postResponse: Post,
    dateCreated: string,
    parentCommentId: number | null

}
interface ACTION {
    type: string,
    payload?: any
}
interface declaredState  {
    comment: COMMENT | {},
    comments: COMMENT[] | [],
    commentSuccess: boolean,
    commentError: boolean,
    message: string | null
}

const initialState = {
    comment:  {},
    comments: [],
    commentSuccess: false,
    commentError: false,
    message:  null
}

export default (state: declaredState = initialState, action: ACTION) => {
    switch(action.type) {
        case "get_comments_of_post":
            return {
                ...state,
                comments: action.payload,
                commentSuccess: true
            }
        case "add_comment_to_post":
            return {
                ...state,
                comment: action.payload,
                comments: [action.payload, ...state.comments],
                commentSuccess: true
            }

        case "add_comment_to_parent_comment":
            return {
                ...state,
                comment: action.payload,
                comments: [action.payload, ...state.comments],
                commentSuccess: true
            }
        default:
            return state
    }
}