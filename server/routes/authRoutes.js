const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');


// Маршрут для получения информации о текущем пользователе
router.get('/me', authMiddleware, (req, res) => {
    res.json({ user: req.user }); // Возвращаем данные пользователя, сохраненные в мидлваре
  });

// Регистрация пользователя.
router.post(
    '/register',
    [
        check('username', 'Имя пользователя не может быть пустым').not().isEmpty(),
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Пароль должен быть минимум 6 символов').isLength({ min: 6 }),
          ],
    authController.register
);


// Авторизация пользователя (вход)
router.post(
    '/login',
    [
        check('email', 'Введите корректный email').isEmail(),
        check('password', 'Пароль обязателен').exists()
    ],
    authController.login
);


module.exports = router;
