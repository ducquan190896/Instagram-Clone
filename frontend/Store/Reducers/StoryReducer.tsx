import { USER } from "./UserReducer";

export interface STORY {
    id: number,
    likeCount: number,
    dateCreated: string,
    imageUrls: string[] | [],
    owner: USER,
}
interface ACTION {
    type: string,
    payload?: any
}
export interface declaredStateStory  {
    story: STORY | {},
    stories: STORY[] | [],
    storySuccess: boolean,
    storyError: boolean,
    message: string | null
}

const initialState = {
    story:  {},
    stories: [],
    storySuccess: false,
    storyError: false,
    message:  null
}

export default (state: declaredStateStory = initialState, action: ACTION) => {
    switch(action.type) {
        case "get_stories_by_followings_and_authUser":
            return {
                ...state,
                stories: action.payload,
                storySuccess: true
            }
        case "get_story_by_id":
            return {
                ...state,
                story: action.payload,
                stories: state.stories.map((sto: STORY) => sto.id == action.payload.id ? action.payload: sto),
                storySuccess: true
            }
        case "create_story":
            return {
                ...state,
                story: action.payload,
                stories: [action.payload, ...state.stories],
                storySuccess: true
            }
        case "delete_story":
            return {
                ...state,
                stories: state.stories.filter(sto => sto.id != action.payload),
                storySuccess: true
            }
        case "error_story":
            return {
                ...state,
                storyError: true,
                message: action.payload
            }
        case "reset_story":
            return {
                ...state,
                storySuccess: false,
                storyError: false,
                message:  null
            }
        default:
            return state;
    }
}