import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../axios';
import { UsersListItem } from './UsersListItem'; 
import { followUser, unfollowUser, setUsers, fetchUserFollowing } from '../../redux/userSlice'; 
import './UserInfo.module.scss'; 

export const UsersList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(''); 

  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const following = useSelector((state) => state.users.following);
  const currentUser = useSelector((state) => state.auth.user); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('/api/users/users'); 
        dispatch(setUsers(data));
        setLoading(false);
      } catch (err) {
        setError('Ошибка загрузки пользователей');
        setLoading(false);
      }
    };

    fetchUsers();
    dispatch(fetchUserFollowing()); 
  }, [dispatch]);

  const handleFollow = async (userId) => {
    try {
      await dispatch(followUser(userId)).unwrap(); 
      setMessage('Вы подписались на пользователя');
    } catch (err) {
      console.error('Ошибка при подписке на пользователя', err);
      setMessage('Ошибка при подписке на пользователя');
    }

    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleUnfollow = async (userId) => {
    try {
      await dispatch(unfollowUser(userId)).unwrap(); 
      setMessage('Вы отписались от пользователя');
    } catch (err) {
      console.error('Ошибка при отписке от пользователя', err);
      setMessage('Ошибка при отписке от пользователя');
    }

    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  if (loading) {
    return (
      <div className="skeleton-container">
        <div className="skeleton-user" />
        <div className="skeleton-user" />
        <div className="skeleton-user" />
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  return (
    <div className="users-list-container">
      <h1>Список пользователей</h1>

      {message && <div className="message success">{message}</div>}

      <div className="users-grid">
        {users.map((user) => (
          <UsersListItem
            key={user._id}
            user={user}
            onFollow={handleFollow} // Подписка
            onUnfollow={handleUnfollow} // Отписка
            isFollowing={following.includes(user._id)} // Проверяем, подписан ли пользователь
            canFollow={user._id !== currentUser._id} // Проверка на возможность подписаться
          />
        ))}
      </div>
    </div>
  );
};
