import axios from '../axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Асинхронное действие для добавления комментария
export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ postId, commentText }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState(); // Получаем данные текущего пользователя
      const userId = auth.user._id;

      // Отправляем запрос на добавление комментария
      const response = await axios.post(`/api/comments/${postId}/comments`, {
        text: commentText,
        author: userId, // Передаем ID пользователя как автора комментария
      });

    
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error.response?.data || error.message); 
      return rejectWithValue(error.response?.data || 'Ошибка при добавлении комментария');
    }
  }
);

// Асинхронное действие для удаления комментария
export const deleteComment = createAsyncThunk(
    'comments/deleteComment',
    async (commentId, { rejectWithValue }) => {
      try {
        const response = await axios.delete(`/api/comments/${commentId}`);
        console.log('Комментарий успешно удалён:', response.data);
        return { _id: commentId }; // Возвращаем удаленный ID
      } catch (error) {
        console.error('Ошибка при удалении комментария:', error.response?.data || error.message);
        return rejectWithValue(error.response?.data || 'Ошибка при удалении комментария');
      }
    }
  );


// Асинхронное действие для получения комментариев поста
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/comments/${postId}/comments`);
     
      return response.data;
    } catch (error) {

      return rejectWithValue(error.response?.data || 'Ошибка при получении комментариев');
    }
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    items: [],
    status: null,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
      
        state.status = 'loading';
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
       
        state.status = 'succeeded';
        state.items = action.payload; // Обновляем комментарии
      })
      .addCase(fetchComments.rejected, (state, action) => {
       
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        
        state.items.push(action.payload); // Добавляем новый комментарий в массив
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
      
        state.items = state.items.filter(
          (comment) => comment._id !== action.payload._id
        );
      });
  },
});

export default commentsSlice.reducer;
