const User = require('../models/User'); 


// Получение всех пользователей
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // исключаем поле пароля
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения пользователей: ' + err.message });
    }
};

// Получение пользователя по ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); 
        if (!user) {
            return res.status(404).json({ msg: 'Пользователь не найден' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения пользователя: ' + err.message });
    }
};

// Получение пользователя по токену
exports.getUserByToken = async (req, res) => {
    try {
        const user = await User.findById(req.userId); 
        if (!user) {
            return res.status(404).json({ msg: 'Пользователь не найден' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения пользователя: ' + err.message });
    }
};


// Подписка на пользователя
exports.followUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id.trim());
        const currentUser = await User.findById(req.userId.trim());

       
        if (!userToFollow) {
            return res.status(404).json({ msg: 'Пользователь не найден' });
        }

       
        if (userToFollow.id.toString() === currentUser.id.toString()) {
            return res.status(400).json({ msg: 'Вы не можете подписаться на самого себя' });
        }

        //не подписан ли текущий пользователь уже на этого пользователя
        if (currentUser.following.includes(userToFollow.id)) {
            return res.status(400).json({ msg: 'Вы уже подписаны на этого пользователя' });
        }

        currentUser.following.push(userToFollow.id);
        userToFollow.followers.push(currentUser.id);


        await currentUser.save();
        await userToFollow.save();

        res.json({ msg: `Вы подписались на ${userToFollow.username}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Отписка от пользователя
exports.unfollowUser = async (req, res) => {
    try {
        const userToUnfollow = await User.findById(req.params.id.trim());
      
        const currentUser = await User.findById(req.userId.trim());

        if (!userToUnfollow) {
            return res.status(404).json({ msg: 'Пользователь не найден' });
        }

        if (!currentUser.following.includes(userToUnfollow.id)) {
            return res.status(400).json({ msg: 'Вы не подписаны на этого пользователя' });
        }

        currentUser.following = currentUser.following.filter(id => id.toString() !== userToUnfollow.id.toString());
       
        userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== currentUser.id.toString());

        await currentUser.save();
        await userToUnfollow.save();

        res.json({ msg: `Вы отписались от ${userToUnfollow.username}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Удаление пользователя по ID
exports.deleteUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'Пользователь не найден' });
        }

        await User.deleteOne({ _id: req.params.id }); 
       
        res.json({ msg: 'Пользователь успешно удалён' });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка удаления пользователя: ' + err.message });
    }
};
