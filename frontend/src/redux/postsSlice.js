import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Асинхронное действие для получения всех публичных постов
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  try {
    const { data } = await axios.get('/api/posts/public');
    return data;
  } catch (error) {
    console.error('Ошибка при получении постов:', error);
    throw error;
  }
});

// Асинхронное действие для получения постов пользователя
export const fetchUserPosts = createAsyncThunk('posts/fetchUserPosts', async (userId) => {
  try {
    const { data } = await axios.get(`/api/posts/user/${userId}`);
    return data;
  } catch (error) {
    console.error('Ошибка при получении постов пользователя:', error);
    throw error;
  }
});

// Асинхронное действие для получения последних тегов
export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
  try {
    const { data } = await axios.get('/api/posts/tags/last');
    return data;
  } catch (error) {
    console.error('Ошибка при получении тегов:', error);
    throw error;
  }
});

// Асинхронное действие для получения постов по тегу
export const fetchPostsByTag = createAsyncThunk('posts/fetchPostsByTag', async (tag) => {
  try {
    const { data } = await axios.get(`/api/posts/tag/${tag}`);
    return data;
  } catch (error) {
    console.error('Ошибка при получении постов по тегу:', error);
    throw error;
  }
});

// Асинхронное действие для удаления поста
export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => {
  try {
    await axios.delete(`/api/posts/${id}`);
    return id;  // Возвращаем ID удаленного поста
  } catch (error) {
    console.error('Ошибка при удалении поста:', error);
    throw error;
  }
});

// Асинхронное действие для получения приватных постов
export const fetchPrivatePost = createAsyncThunk('posts/fetchPrivatePosts', async () => {
  try {
    const { data } = await axios.get('/api/posts/hidden');
    return data;
  } catch (error) {
    console.error('Ошибка при получении приватных постов:', error);
    throw error;
  }
});

// Асинхронное действие для удаления приватного поста
export const fetchRemovePrivatePost = createAsyncThunk('posts/fetchRemovePrivatePost', async (id) => {
  try {
    await axios.delete(`/api/posts/hidden/${id}`);
    return id;  // Возвращаем ID удаленного поста
  } catch (error) {
    console.error('Ошибка при удалении приватного поста:', error);
    throw error;
  }
});




// Асинхронное действие для получения постов подписок
export const fetchSubscriptionPosts = createAsyncThunk('posts/fetchSubscriptionPosts', async () => {
  try {
    const { data } = await axios.get('/api/posts/subscriptions'); 
    return data;
  } catch (error) {
    console.error('Ошибка при получении постов подписок:', error);
    throw error;
  }
});






const initialState = {
  posts: {
    items: [],
    status: 'idle',
    error: null
  },
  tags: {
    items: [],
    status: 'idle',
    error: null
  },
  postsByTag: {
    items: [],
    status: 'idle',
    error: null
  },
  userPosts: {  
    items: [],
    status: 'idle',
    error: null
  },
  subscriptionPosts: {  
    items: [],
    status: 'idle',
    error: null
  }
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Обработка состояния получения постов
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.posts.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts.items = action.payload;
        state.posts.status = 'succeeded';
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.posts.status = 'failed';
        state.posts.error = action.error.message;
      })

      // Обработка состояния получения тегов
      .addCase(fetchTags.pending, (state) => {
        state.tags.status = 'loading';
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tags.items = action.payload;
        state.tags.status = 'succeeded';
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.tags.status = 'failed';
        state.tags.error = action.error.message;
      })

      // Обработка состояния удаления поста
      .addCase(fetchRemovePost.fulfilled, (state, action) => {
        state.posts.items = state.posts.items.filter(post => post._id !== action.payload);
      })
      .addCase(fetchRemovePost.rejected, (state) => {
        console.error('Ошибка при удалении поста');
      })

      // Обработка состояния получения приватных постов
      .addCase(fetchPrivatePost.pending, (state) => {
        state.posts.status = 'loading';
      })
      .addCase(fetchPrivatePost.fulfilled, (state, action) => {
        state.posts.items = action.payload;
        state.posts.status = 'succeeded';
      })
      .addCase(fetchPrivatePost.rejected, (state, action) => {
        state.posts.status = 'failed';
        state.posts.error = action.error.message;
      })

      // Обработка состояния удаления приватного поста
      .addCase(fetchRemovePrivatePost.fulfilled, (state, action) => {
        state.posts.items = state.posts.items.filter(post => post._id !== action.payload);
      })
      .addCase(fetchRemovePrivatePost.rejected, (state) => {
        console.error('Ошибка при удалении приватного поста');
      })

      // Обработка состояния получения постов по тегу
      .addCase(fetchPostsByTag.pending, (state) => {
        state.postsByTag.status = 'loading';
      })
      .addCase(fetchPostsByTag.fulfilled, (state, action) => {
        state.postsByTag.items = action.payload;
        state.postsByTag.status = 'succeeded';
      })
      .addCase(fetchPostsByTag.rejected, (state, action) => {
        state.postsByTag.status = 'failed';
        state.postsByTag.error = action.error.message;
      })

      // Обработка состояния получения постов пользователя
      .addCase(fetchUserPosts.pending, (state) => {
        state.userPosts.status = 'loading';
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.userPosts.items = action.payload;
        state.userPosts.status = 'succeeded';
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.userPosts.status = 'failed';
        state.userPosts.error = action.error.message;
      })

      // Обработка состояния получения постов подписок
      .addCase(fetchSubscriptionPosts.pending, (state) => {
        state.subscriptionPosts.status = 'loading';
      })
      .addCase(fetchSubscriptionPosts.fulfilled, (state, action) => {
        state.subscriptionPosts.items = action.payload;
        state.subscriptionPosts.status = 'succeeded';
      })
      .addCase(fetchSubscriptionPosts.rejected, (state, action) => {
        state.subscriptionPosts.status = 'failed';
        state.subscriptionPosts.error = action.error.message;
      });
  },
});

export default postsSlice.reducer;


