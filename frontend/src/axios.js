import axios from 'axios';


const instance = axios.create({
  baseURL: 'http://localhost:3000', // Базовый URL для всех запросов
});

// Интерсептор для добавления токена в каждый запрос
instance.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('token'); // Получаем токен из localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Добавляем токен в заголовок Authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерсептор для обработки ответов
instance.interceptors.response.use(
  (response) => response, // Возвращаем успешный ответ
  (error) => {
    // Если токен истек или невалиден, выполняем логику выхода
    if (error.response && error.response.status === 401) {
      window.localStorage.removeItem('token'); // Удаляем токен из localStorage
      window.location.href = '/login'; // Перенаправляем на страницу входа
    }
    return Promise.reject(error);
  }
);

export default instance;
