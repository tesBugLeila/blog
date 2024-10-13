import React from 'react';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchRemovePost, fetchRemovePrivatePost } from '../../redux/postsSlice';
import styles from './Post.module.scss';
import { UserInfo } from '../UserInfo';
import { PostSkeleton } from './Skeleton';
import { format } from 'date-fns';

export const Post = ({
  _id,
  title,
  createdAt,
  imageUrl,
  user,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
  isPrivate,
}) => {
  const dispatch = useDispatch();

  const onClickRemove = async () => {
    const confirmed = window.confirm('Вы действительно хотите удалить этот пост?');
    if (confirmed) {
      try {
        if (isPrivate) {
          await dispatch(fetchRemovePrivatePost(_id)).unwrap();
        } else {
          await dispatch(fetchRemovePost(_id)).unwrap();
        }
        alert('Пост удален успешно!');
      } catch (error) {
        alert('Ошибка при удалении поста.');
      }
    }
  };

  
  let formattedDate;
  if (createdAt) {
    const date = new Date(createdAt);
    formattedDate = isNaN(date) ? 'Дата недоступна' : format(date, 'dd MMM yyyy HH:mm');
  } else {
    formattedDate = 'Дата недоступна';
  }

  if (isLoading) {
    return <PostSkeleton />;
  }

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${_id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl && (
        <img
          className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
          src={imageUrl}
          alt={title}
        />
      )}
      <div className={styles.wrapper}>
        <UserInfo {...user} additionalText={formattedDate} />
        <div className={styles.indention}>
          <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
            {isFullPost ? title : <Link to={`/posts/${_id}`}>{title}</Link>}
          </h2>
          <ul className={styles.tags}>
            {tags.map((name) => (
              <li key={name}>
                <Link to={`/tag/${name}`}>#{name}</Link>
              </li>
            ))}
          </ul>
          {children && <div className={styles.content}>{children}</div>}
          <ul className={styles.postDetails}>
            <li>
              <CommentIcon />
              <span>{commentsCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
