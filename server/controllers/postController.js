const Post = require('../models/Post');
const User = require('../models/User');


// Создание нового поста
exports.addPost = async (req, res) => {
    const { title, content, isPrivate, tags, imageUrl } = req.body;
    
    try {
        // Проверка на пустые значения
        if (!title || title.trim() === '') {
            return res.status(400).json({ message: 'Заголовок поста не может быть пустым' });
        }
        
        if (!content || content.trim() === '') {
            return res.status(400).json({ message: 'Содержание поста не может быть пустым' });
        }
        
        // Создание нового поста
        const newPost = new Post({
            author: req.userId, 
            title,
            content,
            isPrivate,
            tags, 
            imageUrl
            
        });

        const post = await newPost.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: 'Произошла ошибка при создании поста' });
    }
};

// Обновление поста
exports.updatePost = async (req, res) => {
    const { title, content, isPrivate, tags } = req.body;
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'Пост не найден' });

        if (post.author.toString() !== req.userId) {
            return res.status(401).json({ msg: 'Пользователь не авторизован' });
        }

        post.title = title || post.title;
        post.content = content || post.content;
        post.isPrivate = typeof isPrivate !== 'undefined' ? isPrivate : post.isPrivate;
        post.tags = tags || post.tags;

        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Получение поста по его ID
exports.getPostById = async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findById(postId).populate('author', 'username avatarUrl');
      
      if (!post) {
        return res.status(404).json({ message: 'Пост не найден' });
      }
      
      res.json(post);
    } catch (err) {
      res.status(500).json({ error: 'Произошла ошибка при получении поста' });
    }
  };
  

// Удаление поста
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) return res.status(404).json({ msg: 'Пост не найден' });

        if (post.author.toString() !== req.userId) {
            return res.status(401).json({ msg: 'Пользователь не авторизован' });
        }

        await post.deleteOne();
        res.json({ msg: 'Пост удален' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Получение всех публичных постов
exports.getPublicPosts = async (req, res) => {
    try {
        // Использую populate для получения данных о пользователе, включая avatarUrl
        const posts = await Post.find({ isPrivate: false }).populate('author', 'username avatarUrl');
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Получение всех постов пользователя по его ID
exports.getUserPosts = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Находим все посты пользователя
        const posts = await Post.find({ author: userId });

        // Если постов нет, возвращаем пустой массив
        if (!posts.length) {
            return res.json([]); // Возвращаем пустой массив
        }

        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Произошла ошибка при получении постов пользователя' });
    }
};


// Получение постов пользователей, на которых подписан текущий пользователь
exports.getSubscriptionPosts = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('following');
        const posts = await Post.find({ author: { $in: user.following }, isPrivate: false }).populate('author', 'username');
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


//для отображение кнопок подписки отписки
exports.getSubscription = async (req, res) => {
    try {
      const user = await User.findById(req.userId).populate('following', '_id'); // Получаем пользователей, на которых подписан текущий пользователь
      res.json(user.following.map(followingUser => followingUser._id)); // Возвращаем только их ID
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

// Получение скрытого поста
exports.getHiddenPosts = async (req, res) => {
    try {
      const posts = await Post.find({ author: req.userId, isPrivate: true });

      res.json(posts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

//удалить скрытый пост
  exports.deleteHiddenPost = async (req, res) => {
    try {
      const { postId } = req.params;
      const post = await Post.findById(postId);
  
      if (!post || !post.isPrivate) {
        return res.status(404).json({ msg: 'Приватный пост не найден' });
      }
  
      if (post.author.toString() !== req.userId) {
        return res.status(403).json({ msg: 'У вас нет доступа к этому посту' });
      }
  
      await post.deleteOne();
      res.json({ msg: 'Приватный пост удален' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Метод для получения постов по тегу
exports.getPostsByTag = async (req, res) => {
    try {
        const tag = req.params.tag.trim(); 

        const posts = await Post.find({ tags: tag, isPrivate: false }).populate('author', 'username');

        if (posts.length === 0) {
            return res.status(404).json({ message: 'Посты с таким тегом не найдены' });
        }

        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Произошла ошибка при получении постов' });
    }
};

// Метод для получения последних 10 уникальных тегов
exports.getLastTags = async (req, res) => {
    try {
       
        const posts = await Post.find({ isPrivate: false }).sort({ createdAt: -1 }).limit(100); // Ограничиваем до 100 постов для оптимизации

        
        const tags = posts.reduce((acc, post) => {
            post.tags.forEach((tag) => {
                if (!acc.includes(tag)) {
                    acc.push(tag); 
                }
            });
            return acc;
        }, []);

    
        const lastTags = tags.slice(0, 10);
        res.json(lastTags);
    } catch (err) {
        res.status(500).json({ error: 'Произошла ошибка при получении тегов' });
    }
};
