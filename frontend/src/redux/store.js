import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './postsSlice';
import authReducer from './authSlice';
import commentsReducer from './commentSlice';
import usersReducer from './userSlice'; 

const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth: authReducer,
    comments: commentsReducer,
    users: usersReducer,
  },
});

export default store;
