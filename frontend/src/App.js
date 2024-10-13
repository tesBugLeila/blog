import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Container from '@mui/material/Container';
import { Header } from './components';
import { Home, FullPost, Registration, AddPost, Login } from './pages';
import { EditPost } from './pages/AddPost/EditPost';
import { TagPosts } from './components/TagPosts';
import { Profile } from './components/UserInfo/Profile';
import { UsersList } from './components/UserInfo/UserList';
import { useDispatch } from 'react-redux';
import { checkAuth } from './redux/authSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/posts/:id/edit" element={<EditPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/tag/:tag" element={<TagPosts />} />
          <Route path="/user/:id" element={<Profile />} />
          <Route path="/users" element={<UsersList />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
