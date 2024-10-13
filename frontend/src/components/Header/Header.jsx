import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import UserMenu from './MenuListComposition'; 
import styles from './Header.module.scss';
import { logout } from '../../redux/authSlice';

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    window.localStorage.removeItem('token');
  };

  const authButtons = (
    <>
      <Link to="/add-post">
        <Button variant="contained">Написать статью</Button>
      </Link>
      <Button onClick={handleLogout} variant="contained" color="error">
        Выйти
      </Button>
    </>
  );

  const guestButtons = (
    <>
      <Link to="/login">
        <Button variant="outlined">Войти</Button>
      </Link>
      <Link to="/register">
        <Button variant="contained">Создать аккаунт</Button>
      </Link>
    </>
  );

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <div className={styles.logo}>
            <UserMenu />
            <Link to="/" className={styles.homeButton}>
              <Button variant="outlined">На главную</Button>
            </Link>
          </div>
          <div className={styles.buttons}>
            {isAuth ? authButtons : guestButtons}
          </div>
        </div>
      </Container>
    </div>
  );
};
