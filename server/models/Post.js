const mongoose = require('mongoose');


// Схема для поста
const postSchema = new mongoose.Schema({
    // Ссылка на автора поста (пользователь)
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Заголовок поста
    title: { type: String, required: true },

    // Содержание поста
    content: { type: String, required: true },

    // Массив тегов, связанных с постом
    tags: [String],

    imageUrl: String,

    // Флаг, указывающий, является ли пост приватным
    isPrivate: { type: Boolean, default: false },

    // Массив комментариев к посту
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],

    // Дата создания поста, по умолчанию текущее время
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
