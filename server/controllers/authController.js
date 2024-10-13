const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 


// Регистрация нового пользователя
exports.register = async (req, res) => {
    const { username, email, password, avatarUrl } = req.body;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let user = await User.findOne({ $or: [{ username }, { email }] });
    
        if (user) {
            return res.status(400).json({ msg: 'Пользователь с таким именем или email уже существует' });
        }

        user = new User({ username, email, password, avatarUrl });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user._id } };
        jwt.sign(payload, 'SECRET_KEY', { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ token });
        });
    } catch (err) {
        res.status(400).json({ error: 'Ошибка регистрации: ' + err.message });
    }
};



// Авторизация пользователя (вход)
exports.login = async (req, res) => {
    // Проверка валидации
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Ищем пользователя по email
        const user = await User.findOne({ email });

        // Проверяем, существует ли пользователь и совпадает ли пароль
        if (!user) {
            return res.status(400).json({ error: 'Неверные учетные данные' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
     
        if (!isMatch) {
            return res.status(400).json({ error: 'Неверные учетные данные' });
        }

        const payload = { user: { id: user._id } };

        const token = jwt.sign(payload, 'SECRET_KEY', { expiresIn: '10d' });

        // Отправляем токен в ответе
        res.json({ token });
    } catch (err) {
        res.status(400).json({ error: 'Ошибка авторизации: ' + err.message });
    }
};
