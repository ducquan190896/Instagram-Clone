import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import thunk from 'redux-thunk';
import ChatReducer from './Reducers/ChatReducer';
import CommentLikeReducer from './Reducers/CommentLikeReducer';
import CommentReducer from './Reducers/CommentReducer';
import FollowReducer from './Reducers/FollowReducer';
import MessageReducer from './Reducers/MessageReducer';
import PostsReducer from './Reducers/PostsReducer';
import StoryLikeReducer from './Reducers/StoryLikeReducer';
import StoryReducer from './Reducers/StoryReducer';
import TagReducer from './Reducers/TagReducer';
import UserReducer from './Reducers/UserReducer';
import VoteReducer from './Reducers/VoteReducer';


const initialState= {};

const rootReducer = combineReducers({
    USERS: UserReducer,
    POSTS: PostsReducer,
    VOTES: VoteReducer,
    FOLLOWS: FollowReducer,
    TAGS: TagReducer,
    COMMENTS: CommentReducer,
    COMMENTLIKES: CommentLikeReducer,
    STORIES: StoryReducer,
    STORYLIKES: StoryLikeReducer,
    CHATS: ChatReducer,
    MESSAGES: MessageReducer,
});

const middleware = [thunk];

const store = createStore(
    rootReducer,
    initialState,
   
    composeWithDevTools(applyMiddleware(...middleware))
)


export default store;
export type RootState = ReturnType<typeof store.getState>;
export const RootURL = "http://192.168.0.102:8080";