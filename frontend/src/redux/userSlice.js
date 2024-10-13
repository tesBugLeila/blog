import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Асинхронное действие для подписки на пользователя
export const followUser = createAsyncThunk(
  'users/followUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/users/follow/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Асинхронное действие для отписки от пользователя
export const unfollowUser = createAsyncThunk(
  'users/unfollowUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/users/unfollow/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Асинхронное действие для получения текущих подписок пользователя
export const fetchUserFollowing = createAsyncThunk(
  'users/fetchUserFollowing',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('api/posts/getsubscriptions');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);



const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    following: [],
    followers: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
    setFollowing(state, action) {
      state.following = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Получение текущих подписок
      .addCase(fetchUserFollowing.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserFollowing.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.following = action.payload; 
      })
      .addCase(fetchUserFollowing.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Подписка
      .addCase(followUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const userId = action.meta.arg;
        state.following.push(userId); 
      })
      .addCase(followUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Отписка
      .addCase(unfollowUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const userId = action.meta.arg;
        state.following = state.following.filter((id) => id !== userId); 
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setUsers, setFollowing } = usersSlice.actions;

export default usersSlice.reducer;
