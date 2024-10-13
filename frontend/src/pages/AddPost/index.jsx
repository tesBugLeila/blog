import React, { useState } from 'react'; 
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import { Navigate } from 'react-router-dom'; 
import { useSelector } from 'react-redux'; 
import axios from '../../axios'; 
import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';

import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';

export const AddPost = () => {
  const [value, setValue] = useState(''); // Текст статьи
  const [title, setTitle] = useState(''); // Заголовок статьи
  const [tags, setTags] = useState(''); // Теги статьи
  const [imageUrl, setImageUrl] = useState(''); // Ссылка на изображение
  const [isPrivate, setIsPrivate] = useState(false); // Приватность поста

  const isAuth = useSelector((state) => !!state.auth.token); // Проверка авторизации

  const onSubmit = async () => {
    try {
      const fields = {
        title,
        content: value,
        tags: tags.split(',').map((tag) => tag.trim()),
        imageUrl, // Ссылка на изображение
        isPrivate, // Приватность поста
      };

      const { data } = await axios.post('/api/posts/add', fields, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('token')}`,
        },
      });

      // Перенаправление на страницу с постом после успешного создания
      window.location.href = `/posts/${data._id}`;
    } catch (err) {
      console.warn(err);
      alert('Ошибка при создании поста');
    }
  };

  const onChange = React.useCallback((value) => {
    setValue(value);
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
  
      <TextField
        variant="standard"
        placeholder="Ссылка на изображение"
        fullWidth
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        style={{ marginBottom: 20 }}
      />
      
    
      {imageUrl && (
        <img className={styles.image} src={imageUrl} alt="Preview" style={{ maxWidth: '100%', marginBottom: 20 }} />
      )}

      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги (через запятую)"
        fullWidth
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <SimpleMDE className={styles.editor} value={value} onChange={onChange} options={options} />
      
      {/* Радиокнопки для выбора приватности поста */}
      <FormControl component="fieldset" style={{ marginTop: '20px' }}>
        <FormLabel component="legend">Приватность поста</FormLabel>
        <RadioGroup
          row
          aria-label="Приватность"
          name="postPrivacy"
          value={isPrivate ? 'private' : 'public'}
          onChange={(e) => setIsPrivate(e.target.value === 'private')}
        >
          <FormControlLabel value="public" control={<Radio />} label="Публичный" />
          <FormControlLabel value="private" control={<Radio />} label="Приватный" />
        </RadioGroup>
      </FormControl>

      <div className={styles.buttons}>
        <Button size="large" variant="contained" onClick={onSubmit}>
          Опубликовать
        </Button>
        <Button size="large" onClick={() => window.history.back()}>
          Отмена
        </Button>
      </div>
    </Paper>
  );
};
