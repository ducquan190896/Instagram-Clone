import { USER, ACTION } from "./UserReducer";


export interface Choice {
    id: number,
    answer: string,
    voteCount: number,
    pollId: number
}

export interface Poll {
    id: number,
    question: string,
    expireDays: number,
    postId: number,
    choices: Choice[] | null
}


export interface Post {
    id: number,
    content: string,
    imageUrls: string[] | [],
    dateCreated: string,
    dateUpdated: string,
    commentCount: number,
    likeCount: number,
    userResponse: USER,
    tags: string[] | null
    poll: Poll | null
}

export interface declareState {
    post: Post | {},
    posts: Post[] | [],
    postSuccess: boolean,
    postError: boolean,
    message: string | null
}


const initialState= {
    post: {},
    posts:  [],
    postSuccess: false,
    postError: false,
    message:  null,
}

export default (state: declareState = initialState, action: ACTION) => {
    switch(action.type) {
        case "get_all_post_authUser":
            return {
                ...state,
                posts: action.payload,
                postSuccess: true
            }
        case "get_all_post_home_page":
            return {
                ...state,
                posts: action.payload,
                postSuccess: true
            }
        case "get_post_by_postId_after_updating":
            return {
                ...state,
                posts: state.posts.map(po => po.id === action.payload.id ? action.payload : po),
                postSuccess: true,
                post: action.payload
            }
        case "create_post":
            return {
                ...state,
                post: action.payload,
                posts: [ action.payload, ...state.posts],
                postSuccess: true
            }
        case "create_poll":
            return {
                ...state,
                post: action.payload,
                posts: [ action.payload, ...state.posts],
                postSuccess: true
             }
        case "get_posts_of_active_user":
            return {
                ...state,
                posts: action.payload,
                postSuccess: true
            }
        case "get_posts_by_search_keyword":
             return {
                ...state,
                posts: action.payload,
                postSuccess: true
            }
        case "get_posts_by_tag":
            return {
               ...state,
               posts: action.payload,
               postSuccess: true
            }
        case "get_posts_for_admin":
            return {
               ...state,
                posts: action.payload,
                postSuccess: true
            }
        case "delete_post":
            return {
               ...state,
                posts: state.posts.filter(po => po.id != action.payload),
                postSuccess: true
            }    
        case "error_post":
            return {
                ...state,
                postError: true,
                message: action.payload
            }
        case "reset_post":
            return {
                ...state,
                postError: false,
                postSuccess: false,
                message: null
            }
        default:
            return state;
    }
}

