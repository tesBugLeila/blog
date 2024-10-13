import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; 
import axios from '../axios';

// Асинхронное действие для получения данных пользователя по токену 
export const fetchUserData = createAsyncThunk('auth/fetchUserData', async () => {
  const { data } = await axios.get('api/users/me');
  return data;
});

// Асинхронное действие для проверки авторизации при старте приложения
export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { dispatch }) => {
  const token = window.localStorage.getItem('token');
  if (token) {
    await dispatch(fetchUserData()); // Если токен есть, пытаемся загрузить данные пользователя
  }
});

// Асинхронное действие для входа пользователя
export const fetchAuthPosts = createAsyncThunk('auth/fetchAuthPosts', async (params) => {
  const { data } = await axios.post('/api/auth/login', params);
  return data;
});

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      window.localStorage.removeItem('token'); // Удаляем токен при выходе
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthPosts.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload; // Сохраняем данные пользователя
      });
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
