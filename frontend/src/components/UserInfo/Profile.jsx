import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../axios';
import { UserInfo } from './index';

export const Profile = () => {
  const { id } = useParams(); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`/api/users/user/${id}`); 
        setUser(data);
        setLoading(false);
      } catch (err) {
        setError('Ошибка загрузки данных пользователя');
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Профиль пользователя</h1>
      {user && (
        <UserInfo
          avatarUrl={user.avatarUrl}
          fullName={user.username}
          additionalText={`Email: ${user.email}`}
        />
      )}
    </div>
  );
};
