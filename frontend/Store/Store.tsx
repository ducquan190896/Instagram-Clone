import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import thunk from 'redux-thunk';
import CommentReducer from './Reducers/CommentReducer';
import FollowReducer from './Reducers/FollowReducer';
import PostsReducer from './Reducers/PostsReducer';
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
    COMMENTS: CommentReducer
});

const middleware = [thunk];

const store = createStore(
    rootReducer,
    initialState,
   
    composeWithDevTools(applyMiddleware(...middleware))
)


export default store;
export type RootState = ReturnType<typeof store.getState>
