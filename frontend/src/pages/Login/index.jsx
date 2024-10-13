import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthPosts, fetchUserData, login } from "../../redux/authSlice";
import { Navigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import styles from "./Login.module.scss";

export const Login = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isAuthenticated);

  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (token) {
      dispatch(fetchUserData()); // Если токен существует, загружаем данные пользователя
    }
  }, [dispatch]);

  const onSubmit = async (values) => {
    try {
      const result = await dispatch(fetchAuthPosts(values)); // Авторизация
      if (result.payload && result.payload.token) {
        window.localStorage.setItem('token', result.payload.token); // Сохраняем токен
        dispatch(login(result.payload)); // Устанавливаем пользователя как авторизованного
        window.location.reload(); // Обновление страницы
      }
    } catch (error) {
      console.error("Ошибка при отправке формы:", error);
    }
    reset();
  };

  if (isAuth) {
    return <Navigate to="/" />; // Перенаправляю на главную страницу если авторизованы
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">Вход в аккаунт</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          fullWidth
          {...register("email", { required: "Укажите почту", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Неверно указана почта" } })}
          error={!!errors.email}
          helperText={errors.email ? errors.email.message : ""}
        />
        <TextField
          className={styles.field}
          label="Пароль"
          type="password"
          fullWidth
          {...register("password", { required: "Введите пароль", minLength: { value: 6, message: "Пароль должен содержать минимум 6 символов" } })}
          error={!!errors.password}
          helperText={errors.password ? errors.password.message : ""}
        />
        <Button size="large" variant="contained" fullWidth type="submit" disabled={!isValid}>Войти</Button>
      </form>
    </Paper>
  );
};
