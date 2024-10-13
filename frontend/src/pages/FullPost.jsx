import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from '../axios';
import { Post } from "../components/Post/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useParams, useNavigate } from "react-router-dom"; 
import { addComment, fetchComments, deleteComment } from "../redux/commentSlice";

export const FullPost = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams(); 
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const comments = useSelector((state) => Array.isArray(state.comments.items) ? state.comments.items : []); 
  const commentStatus = useSelector((state) => state.comments.status); 

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/posts/getPostById/${id}`);
        if (!res.data) {
         
          alert('Пост не найден или был удалён');
          navigate('/'); 
        } else {
          setData(res.data);
        }
        setIsLoading(false);
      } catch (err) {
        console.warn(err);
        alert('Ошибка при получении поста');
        navigate('/'); 
      }
    };

    const fetchPostComments = () => {
      dispatch(fetchComments(id));
    };

    fetchPost();
    fetchPostComments();
  }, [id, dispatch, navigate]);

  const handleAddComment = async (commentText) => {
    if (!commentText.trim()) return;

    if (!data || !data._id) {
      console.error("Post ID is not available");
      return;
    }

    try {
      console.log("Отправка комментария:", { postId: data._id, commentText: commentText.trim() });
      await dispatch(addComment({ postId: data._id, commentText })).unwrap();
      dispatch(fetchComments(data._id));
    } catch (err) {
      console.error('Ошибка при добавлении комментария:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!commentId) {
      console.error("ID комментария не передан");
      return;
    }

    try {
      console.log("Удаление комментария с ID:", commentId);
      await dispatch(deleteComment(commentId)).unwrap(); 
      dispatch(fetchComments(data._id)); 
    } catch (err) {
      console.error('Ошибка при удалении комментария:', err);
    }
  };

  if (isLoading || !data) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      <Post
        _id={data._id}
        title={data.title}
        imageUrl={data.imageUrl}
        user={data.author || { username: 'Удалённый пользователь' }} 
        createdAt={data.createdAt}
        viewsCount={data.viewsCount || 0}
        commentsCount={comments.length}
        tags={data.tags}
        isFullPost
      >
        <p>{data.content}</p>
      </Post>

      <CommentsBlock
        items={comments.map((comment) => ({
          id: comment._id,
          user: {
            fullName: comment.author?.username || 'Неизвестен',
            avatarUrl: comment.author?.avatarUrl || ''
          },
          text: comment.text,
        }))}
        isLoading={commentStatus === 'loading'}
        onDelete={handleDeleteComment}
      >
        <Index onSubmit={handleAddComment} />
      </CommentsBlock>
    </>
  );
};
