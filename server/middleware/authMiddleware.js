const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    
    console.log('Authorization header:', req.header('Authorization'));  
   
    console.log('Token:', token);  // Лог извлеченного токена

    if (!token) {
        return res.status(403).json({ msg: 'Токен не найден, доступ запрещён' });
    }

    try {
        const decoded = jwt.verify(token, 'SECRET_KEY');
        console.log('декодированный токен:', decoded);  // Лог декодированного токена
        req.userId = decoded.user.id;  
        next(); 
    } catch (err) {
        console.log('Ошибка токена:', err.message);  
        res.status(403).json({ msg: 'Недействительный токен' });
    }
}

module.exports = authMiddleware;
