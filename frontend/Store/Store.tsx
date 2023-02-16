import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import thunk from 'redux-thunk';
import FollowReducer from './Reducers/FollowReducer';
import PostsReducer from './Reducers/PostsReducer';
import UserReducer from './Reducers/UserReducer';
import VoteReducer from './Reducers/VoteReducer';


const initialState= {};

const rootReducer = combineReducers({
    USERS: UserReducer,
    POSTS: PostsReducer,
    VOTES: VoteReducer,
    FOLLOWS: FollowReducer
});

const middleware = [thunk];

const store = createStore(
    rootReducer,
    initialState,
   
    composeWithDevTools(applyMiddleware(...middleware))
)


export default store;
export type RootState = ReturnType<typeof store.getState>
