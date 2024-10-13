const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const commentController = require('../controllers/commentController'); 


// Добавление комментария к посту
router.post('/:postId/comments', authMiddleware, commentController.addComment);

// Удаление комментария
router.delete('/:id', authMiddleware, commentController.deleteComment);

// Получить комментарии поста
router.get('/:postId/comments', commentController.getPostComments);


module.exports = router;
