export interface USER {
    id: number,
    username: string,
    email: string,
    role: string,
    active: boolean,
    introduction: string,
    followersCount: number,
    followingsCount: number,
    postCounts: number,
    avatarUrl: string | null
}

export interface declaredState  {
    user: USER | {},
    otherUser: USER | {},
    users: USER[] | [],
    userSuccess: boolean,
    userError: boolean,
    authUserSuccess: boolean,
    authUserError: boolean,
    userUpdateStatus: boolean,
    userUpdated: USER | {},
    message: string | null
}

export interface ACTION {
    type: string,
    payload?: any
}

let initialState = {
    user: {},
    otherUser: {},
    users: [],
    userSuccess: false,
    userError: false,
    authUserSuccess: false,
    authUserError: false,
    userUpdateStatus: false,
    userUpdated: {},
    message: null
}

export default (state: declaredState = initialState, action: ACTION) => {
    switch(action.type) {
        case "LOG_IN":
            return {
                ...state,
                user: action.payload,
                authUserSuccess: true
            }
        case "REGISTER":
            return {
                ...state,
                user: action.payload,
                authUserSuccess: true
            }
        case "ReActive_User":
            return {
                ...state,
                user: action.payload,
                authUserSuccess: true
            }
        case "DeActive_User":
            return {
                ...state,
                user: {},
                authUserSuccess: true
            }
        case "Change_Password":
            return {
                ...state,
                user: action.payload,
                authUserSuccess: true
            }
        case "LOG_OUT":
            return {
                ...state,
                user: {},
                authUserSuccess: true
            }
        case "USER_ERROR":
            return {
                ...state,
                message: action.payload,
                userError: true
            }
        case "USER_RESET": 
            return {
                ...state,
                userSuccess: false,
                userError: false,
                userUpdateStatus: false,
                userUpdated: {},
                message: null,
                authUserSuccess: false,
                authUserError: false,
            }
        case "get_active_user_by_id": 
            return {
                ...state,
                otherUser: action.payload,
                userSuccess: true
            }
        case "delete_active_user_by_id": 
        return {
            ...state,
            users: state.users.filter(us => us.id != action.payload),
            userSuccess: true
        }
        case "get_active_users_by_search_keyword":
            return {
                ...state,
                users: action.payload,
                userSuccess: true
            }
        case "get_users_by_search_keyword_for_admin":
            return {
                ...state,
                users: action.payload,
                userSuccess: true
            }
        case "get_all_users_for_admin":
            return {
                ...state,
                users: action.payload,
                userSuccess: true
            }
        default:
            return state
    }
}