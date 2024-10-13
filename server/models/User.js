const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Подключаем библиотеку для хеширования паролей

// Создание схемы для пользователей
const UserSchema = new mongoose.Schema({
    // Имя пользователя
    username: {
        type: String,           // Тип данных - строка
        required: true,         // Обязательное поле
        unique: true            // Значение должно быть уникальным (не может повторяться)
    },

    // Электронная почта пользователя
    email: {
        type: String,           // Тип данных - строка
        required: true,         // Обязательное поле
        unique: true            // Значение должно быть уникальным (не может повторяться)
    },

    // Хешированный пароль пользователя
    password: {
        type: String,           // Тип данных - строка
        required: true          // Обязательное поле
    },
    
    avatarUrl: String,  //если мы хотим чтобы свойство было необязательным то передаем сразу тип а не объект

    // Список подписчиков пользователя
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId, // Ссылка на другой объект в базе данных 
            ref: 'User'                            // Ссылка на модель "User" (самих пользователей)
        }
    ],

    // Список пользователей, на которых подписан данный пользователь
    following: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'                           
        }
    ]
},

{
    timestamps: true,
},
);

// Метод для проверки пароля
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model('User', UserSchema);
