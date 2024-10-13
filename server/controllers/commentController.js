const Post = require('../models/Post');
const Comment = require('../models/Comment'); 

// Добавление комментария
exports.addComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const { text } = req.body;

        if (!text || text.trim() === '') {
            return res.status(400).json({ message: 'Текст комментария не может быть пустым' });
        }

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Пост не найден' });

        
        const comment = new Comment({
            author: req.userId, 
            text,
            createdAt: new Date(),
        });

       
        await comment.save();

      
        post.comments.push(comment._id);
        await post.save();

     
        const updatedPost = await Post.findById(postId)
            .populate('comments', 'author text createdAt') 
            .exec();

        res.status(201).json(updatedPost);
    } catch (err) {
        res.status(500).json({ error: 'Произошла ошибка при добавлении комментария' });
    }
};

// получение коментария
exports.getPostComments = async (req, res) => {
    const { postId } = req.params;
    try {
      const post = await Post.findById(postId)
        .populate({
          path: 'comments',
          select: 'text createdAt',
          populate: {
            path: 'author',
            select: 'username avatarUrl',
          },
        });
  
      if (!post) return res.status(404).json({ message: 'Пост не найден' });
  
      res.json(post.comments); 
    } catch (error) {
      console.error('Error fetching post comments:', error);
      res.status(500).json({ error: 'Ошибка при получении комментариев' });
    }
  };
  
  
  
// Удаление комментария
exports.deleteComment = async (req, res) => {
    const { id } = req.params;

    const cleanedId = id.trim();

    try {
        
        const comment = await Comment.findById(cleanedId);
        if (!comment) {

            return res.status(404).json({ message: 'Комментарий не найден' });
        }

        if (comment.author.toString() !== req.userId) {

            return res.status(403).json({ message: 'Пользователь не авторизован для удаления этого комментария' });
        }

        await Comment.findByIdAndDelete(cleanedId);
        await Post.updateOne(
            { 'comments': cleanedId },
            { $pull: { comments: cleanedId } }
        );

        res.json({ message: 'Комментарий успешно удален' });
    } catch (err) {

        res.status(500).json({ error: 'Произошла ошибка при удалении комментария' });
    }
};
