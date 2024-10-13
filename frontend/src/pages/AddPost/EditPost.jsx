import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../axios'; 
import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { Navigate } from 'react-router-dom'; 

export const EditPost = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [value, setValue] = useState(''); 
  const [title, setTitle] = useState(''); 
  const [tags, setTags] = useState(''); 
  const [imageUrl, setImageUrl] = useState(''); 
  const [isPrivate, setIsPrivate] = useState(false); 

  const isAuth = useSelector((state) => !!state.auth.token);


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`api/posts/getPostById/${id}`);
        setTitle(data.title);
        setValue(data.content);
        setTags(data.tags.join(', '));
        setImageUrl(data.imageUrl);
        setIsPrivate(data.isPrivate);
      } catch (err) {
        console.warn(err);
        alert('Ошибка при загрузке поста');
      }
    };
    
    fetchPost();
  }, [id]);

  const onSubmit = async () => {
    try {
      const fields = {
        title,
        content: value,
        tags: tags.split(',').map((tag) => tag.trim()),
        imageUrl,
        isPrivate,
      };

      await axios.put(`/api/posts/${id}`, fields, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('token')}`,
        },
      });

      navigate(`/posts/${id}`);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при обновлении поста');
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
          Обновить
        </Button>
        <Button size="large" onClick={() => navigate(-1)}>
          Отмена
        </Button>
      </div>
    </Paper>
  );
};
