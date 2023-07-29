import { PARTICIPANT } from "./ChatReducer"

interface ACTION {
    type: string,
    payload?: any
}

export interface MESSAGE {
    id: number,
    text: string,
    chatId: number,
    participant: PARTICIPANT
}

interface declaredState {
    message: MESSAGE | {},
    messages: MESSAGE[] | [],
    messageSuccess: boolean,
    messageError: boolean
}

const initialState = {
    message:  {},
    messages:  [],
    messageSuccess: false,
    messageError: false
}


export default (state: declaredState = initialState, action: ACTION) => {
    switch(action.type) {
        case "get_messages_of_chat":
            return {
                ...state,
                messageSuccess: true,
                messages:    action.payload
            }
        case "add_message":
            return {
                ...state,
                messageSuccess: true,
                message: action.payload,
                messages: [...state.messages, action.payload]
            }
        case "receive_message_from_websocket":
            return {
                ...state,
                messageSuccess: true,
                message: action.payload,
                messages: [...state.messages, action.payload]
            }
        case "clear_messages":
            return {
                ...state,
                messageSuccess: true,
                message: {},
                messages: []
            }
        case "delete_message":
            return {
                ...state,
                messageSuccess: true,
                messages: state.messages.filter(mess => mess.id != action.payload)
            }
        case "error_message":
            return {
                ...state,
                messageError: true    
            }
        case "reset_message":
            return {
                ...state,
                messageError: false,
                messageSuccess: false
    
            }
        default:
            return state;
    }
}