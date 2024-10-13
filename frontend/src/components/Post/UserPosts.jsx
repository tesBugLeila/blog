import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUserPosts } from '../redux/postsSlice';
import { Post } from './Post/Post';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export const UserPosts = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.posts.userPosts);

  useEffect(() => {
    dispatch(fetchUserPosts(userId));
  }, [dispatch, userId]);

  return (
    <div>
      <Typography variant="h4" style={{ marginBottom: 20 }}>
        Посты пользователя
      </Typography>
      <Grid container spacing={4}>
        {status === 'loading' ? (
          [...Array(5)].map((_, index) => <Post key={index} isLoading={true} />)
        ) : (
          items.length > 0 ? (
            items.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post._id}>
                <Post
                  _id={post._id}
                  title={post.title}
                  imageUrl={post.imageUrl}
                  user={{
                    avatarUrl: post.author.avatarUrl,
                    fullName: post.author.username,
                  }}
                  createdAt={post.createdAt}
                  viewsCount={post.viewsCount}
                  commentsCount={post.commentsCount}
                  tags={post.tags}
                  isEditable={false}
                  isPrivate={post.isPrivate}
                />
              </Grid>
            ))
          ) : (
            <Typography variant="h6">Нет постов от этого пользователя</Typography>
          )
        )}
      </Grid>
    </div>
  );
};
