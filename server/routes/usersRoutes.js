const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController'); 


// Подписка на пользователя
router.post('/follow/:id', authMiddleware, userController.followUser);

// Отписка от пользователя
router.post('/unfollow/:id', authMiddleware, userController.unfollowUser);

// Получение всех пользователей
router.get('/users', authMiddleware, userController.getAllUsers);

// Получение пользователя по ID
router.get('/user/:id', authMiddleware, userController.getUserById);

// Получение пользователя по токену
router.get('/me', authMiddleware, userController.getUserByToken);

// Удаление пользователя по ID
router.delete('/user/:id', authMiddleware, userController.deleteUserById);


module.exports = router;

