const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const postController = require('../controllers/postController');

// Создание нового поста
router.post('/add', authMiddleware, postController.addPost);

// Обновление поста
router.put('/:id', authMiddleware, postController.updatePost);

// Получение поста по его ID
router.get('/getPostById/:id', postController.getPostById);

// Удаление поста
router.delete('/:id', authMiddleware, postController.deletePost);

// Получение всех публичных постов
router.get('/public', postController.getPublicPosts);

// Маршрут для получения последних 5 тегов
router.get('/tags/last', postController.getLastTags);



// Получение постов пользователя по его ID
router.get('/user/:userId', authMiddleware, postController.getUserPosts);

// Получение постов пользователей, на которых подписан текущий пользователь
router.get('/subscriptions', authMiddleware, postController.getSubscriptionPosts);


// для отображение кнопок подписки отписки
router.get('/getsubscriptions', authMiddleware, postController.getSubscription);


// Получение скрытого поста
router.get('/hidden', authMiddleware, postController.getHiddenPosts );

// Удаление приватного поста
router.delete('/hidden/:postId', authMiddleware, postController.deleteHiddenPost);

// Получение постов по тегу
router.get('/tag/:tag', authMiddleware, postController.getPostsByTag);


module.exports = router;
