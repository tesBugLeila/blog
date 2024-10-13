import React, { useState, useRef } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../redux/authSlice'; 
import axios from '../../axios'; 

import styles from './Login.module.scss';

export const Registration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [avatar, setAvatar] = useState(null);
  const inputFileRef = useRef(null); 

 
  const handleAvatarChange = (event) => {
    setAvatar(event.target.files[0]);
  };

  
  const handleAvatarClick = () => {
    inputFileRef.current.click(); 
  };

  
  const onSubmit = async (data) => {
    try {
      let avatarUrl = '';
      if (avatar) {
        const formData = new FormData();
        formData.append('image', avatar);
  
        const { data: imageResponse } = await axios.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
  
        avatarUrl = imageResponse.url;
      }
  
      const response = await axios.post('/api/auth/register', {
        ...data,
        avatarUrl,
      });
  
      const { token } = response.data;
      window.localStorage.setItem('token', token);
      dispatch(login({ token, user: response.data.user }));
  
      navigate('/');
    } catch (error) {
      if (error.response) {
     
        console.error('Ошибка регистрации:', error.response.data.message);
      } else {
      
        console.error('Ошибка регистрации:', error.message);
      }
    }
  };
  
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar} onClick={handleAvatarClick}>
        <Avatar
          src={avatar ? URL.createObjectURL(avatar) : undefined}
          sx={{ width: 100, height: 100, cursor: 'pointer' }}
        />
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        ref={inputFileRef}
        style={{ display: 'none' }} 
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="Полное имя"
          fullWidth
          {...register('username', { required: 'Полное имя обязательно' })}
          error={!!errors.username}
          helperText={errors.username?.message}
        />
        <TextField
          className={styles.field}
          label="E-Mail"
          fullWidth
          {...register('email', { required: 'E-Mail обязателен', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          className={styles.field}
          label="Пароль"
          fullWidth
          type="password"
          {...register('password', { required: 'Пароль обязателен', minLength: 6 })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button size="large" variant="contained" fullWidth type="submit">
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
