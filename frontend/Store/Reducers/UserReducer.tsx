export interface USER {
    id: number,
    username: string,
    email: string,
    role: string,
    active: boolean,
    introduction: string,
    followersCount: number,
    followingsCount: number,
    postCounts: number
}

export interface declaredState  {
    user: USER | {},
    users: USER[] | [],
    userSuccess: boolean,
    userError: boolean,
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
    users: [],
    userSuccess: false,
    userError: false,
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
                userSuccess: true
            }
        case "REGISTER":
            return {
                ...state,
                user: action.payload,
                userSuccess: true
            }
        case "LOG_OUT":
            return {
                ...state,
                user: {},
                userSuccess: true
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
                message: null
            }
        default:
            return state
    }
}