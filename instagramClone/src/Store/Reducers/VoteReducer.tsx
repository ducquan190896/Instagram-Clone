import { USER } from "./UserReducer";

export interface VOTE {
    id: number,
    owner: USER,
    pollId: number,
    choiceId: number
}

interface declaredState {
    vote: VOTE | {},
    votes: VOTE[] | [],
    voteSuccess: boolean,
    voteError: boolean,
    message: string | null
}

interface ACTION {
    type: string,
    payload?: any
}

let initialState = {
    vote:  {},
    votes:  [],
    voteSuccess: false,
    voteError: false,
    message: null
}

export default (state : declaredState = initialState, action: ACTION) => {
    switch (action.type) {
      
        case "error_vote":
            return {
                ...state,
                voteError: true,
                message: action.payload
            }
        case "reset_vote":
            return {
                ...state,
                voteSuccess: false,
                voteError: false,
                message: null
            }
        default:
            return state;
    }
}