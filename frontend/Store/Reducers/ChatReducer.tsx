import { USER } from "./UserReducer";

export interface PARTICIPANT {
    id: number,
    owner: USER,
    chatId: number
}

export interface CHAT {
    id: number,
    active: boolean,
    dateCreated: string,
    dateUpdated: string,
    participantResponses: PARTICIPANT[],
}

interface ACTION {
    type: string,
    payload?: any
}

interface declaredState {
    chats: CHAT[] |[],
    chat: CHAT | {},
    chatError: boolean,
    chatSuccess: boolean,
    message: string | null
}

const initialState = {
    chats: [],
    chat:  {},
    chatError: false,
    chatSuccess: false,
    message: null
}

export default (state: declaredState = initialState, action: ACTION) => {
    switch(action.type) {
        case "get_chat_by_receiver":
            return {
                ...state,
                chatSuccess: true,
                chat: action.payload,
                chats:    state.chats.some(cha => cha.id == action.payload.id) == true ? [...state.chats] : [...state.chats, action.payload]
            }
        case "get_all_chats_by_authUser":
            return {
                ...state,
                chatSuccess: true,
                chats: action.payload
            }
        case "get_chat_by_id":
            return {
                ...state,
                chatSuccess: true,
                chat: action.payload
            }
        case "error_chat":
            return {
                ...state,
                chatError: true,
                message: action.payload
            }
        case "reset_chat":
            return {
                ...state,
                chatError: false,
                chatSuccess: false,
                message: null
            }
        default:
            return state;
    }
}