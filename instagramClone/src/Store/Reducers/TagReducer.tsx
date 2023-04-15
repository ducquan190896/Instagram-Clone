export interface TAG {
    id: number,
    content: string,
    tagQuantity: number
}

interface ACTION {
    type: string,
    payload?: any
}

interface declaredState  {
    tag: TAG | {},
    tags: TAG[] | [],
    tagSuccess: boolean,
    tagError: boolean,
    message: string | null
}

const initialState = {
    tag:  {},
    tags: [],
    tagSuccess: false,
    tagError: false,
    message:  null
}

export default (state: declaredState = initialState, action: ACTION) => {
    switch(action.type) {
        case "get_tags":
            return {
                ...state,
                tags: action.payload,
                tagSuccess: true
            }
        case "get_tags_by_search_keyword":
            return {
                ...state,
                tags: action.payload,
                tagSuccess: true
            }
        case "error_tag":
            return {
                ...state,
                tagError: true,
                message: action.payload
            }
        case "reset_tag":
            return {
                ...state,
                tagError: false,
                tagSuccess: false,
                message: null
            }
        default:
            return state
    }
}

