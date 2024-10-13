import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchTags, fetchPrivatePost, fetchUserPosts, fetchSubscriptionPosts } from '../redux/postsSlice';
import { Post } from '../components/Post/Post';
import { TagsBlock } from '../components/TagsBlock';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

export const Home = () => {
  const dispatch = useDispatch();
  const { posts, tags, userPosts, subscriptionPosts } = useSelector((state) => state.posts);
  const userData = useSelector((state) => state.auth.user);
  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  const isUserPostsLoading = userPosts.status === 'loading';
  const isSubscriptionPostsLoading = subscriptionPosts.status === 'loading';

  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (tabIndex === 0) {
      dispatch(fetchPosts());
    } else if (tabIndex === 1 && userData) {
      dispatch(fetchPrivatePost());
    } else if (tabIndex === 2 && userData) {
      dispatch(fetchUserPosts(userData._id));
    } else if (tabIndex === 3 && userData) {
      dispatch(fetchSubscriptionPosts());
    }
    dispatch(fetchTags());
  }, [dispatch, tabIndex, userData]);

  useEffect(() => {
    if (userData) {
      if (tabIndex === 1) {
        dispatch(fetchPrivatePost());
      } else if (tabIndex === 2) {
        dispatch(fetchUserPosts(userData._id));
      } else if (tabIndex === 3) {
        dispatch(fetchSubscriptionPosts());
      }
    }
  }, [userData, dispatch, tabIndex]);

  const getIsEditable = (post) => {
    if (!userData) return false;
    const isAuthor = userData._id === post.author?._id || userData._id === post.author?.toString();
    return isAuthor;
  };

  const formatPosts = (postsArray) => {
    return postsArray.map((post) => ({
      ...post,
      commentsCount: Array.isArray(post.comments) ? post.comments.length : 0,
    }));
  };

  const renderPosts = (postsArray) => {
    if (!postsArray || postsArray.length === 0) {
      return <Typography variant="h6">Нет постов</Typography>;
    }

    return formatPosts(postsArray).map((post) => {
      const isEditable = getIsEditable(post);

      return (
        <Post
          key={post._id}
          _id={post._id}
          title={post.title}
          imageUrl={post.imageUrl || ''}
          user={{
            avatarUrl: post.author?.avatarUrl || '',
            fullName: post.author?.username || 'Неизвестный пользователь',
          }}
          createdAt={post.createdAt}
          viewsCount={post.viewsCount || 0}
          commentsCount={post.commentsCount}
          tags={post.tags || []}
          isEditable={isEditable}
          isPrivate={post.isPrivate || false}
        />
      );
    });
  };

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={tabIndex}
        onChange={(_, newValue) => setTabIndex(newValue)}
        aria-label="tabs example"
      >
        <Tab label="Новые" />
        {userData && <Tab label="Приватные" />}
        {userData && <Tab label="Посты созданные мной" />}
        {userData && <Tab label="Подписки" />}
      </Tabs>
      <Grid container spacing={4}>
        <Grid item xs={8}>
          {tabIndex === 0 && (isPostsLoading
            ? [...Array(5)].map((_, index) => <Post key={index} isLoading={true} />)
            : renderPosts(posts.items || [])
          )}
          {tabIndex === 1 && (isPostsLoading
            ? [...Array(5)].map((_, index) => <Post key={index} isLoading={true} />)
            : renderPosts(posts.items || [])
          )}
          {tabIndex === 2 && (isUserPostsLoading
            ? [...Array(5)].map((_, index) => <Post key={index} isLoading={true} />)
            : renderPosts(userPosts.items || [])
          )}
          {tabIndex === 3 && (isSubscriptionPostsLoading
            ? [...Array(5)].map((_, index) => <Post key={index} isLoading={true} />)
            : renderPosts(subscriptionPosts.items || [])
          )}
        </Grid>
        <Grid item xs={4}>
          <TagsBlock items={tags.items || []} isLoading={isTagsLoading} />
         
        </Grid>
      </Grid>
    </>
  );
};
