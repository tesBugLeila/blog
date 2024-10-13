const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Настройка хранилища для загрузки файлов
const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, 'uploads'),
    filename: (_, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));

// Маршруты
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postsRoutes'));
app.use('/api/comments', require('./routes/commentsRoutes'));
app.use('/api/users', require('./routes/usersRoutes'));

// Маршрут для загрузки изображений
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Файл не был загружен' });
    }
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

// Подключение к базе данных MongoDB
mongoose.connect('mongodb+srv://testbug236:Cg6YVhzCTvhwvooy@cluster0.0adtv.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => {
        console.log('Успешно подключено к MongoDB');
    })
    .catch((err) => {
        console.error('Ошибка подключения к MongoDB:', err);
    });

// Запуск сервера
const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
    if (err) {
        return console.error('Ошибка подключения сервера', err);
    }
    console.log(`Сервер запущен на порту ${PORT}`);
});
