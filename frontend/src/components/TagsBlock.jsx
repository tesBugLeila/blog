import React from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import TagIcon from '@mui/icons-material/Tag';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import { SideBlock } from './SideBlock';
import { useSelector } from 'react-redux'; 
export const TagsBlock = ({ items, isLoading = true }) => {
  const navigate = useNavigate();

  const handleTagClick = (tag) => {
    navigate(`/tag/${tag}`);
  };


  const isAuth = useSelector((state) => Boolean(state.auth.user));

  
  if (!isAuth) {
    return null;
  }

  return (
    <SideBlock title="Тэги">
      <List>
        {(isLoading ? [...Array(5)] : items).map((name, i) => (
          <ListItem key={i} disablePadding>
            <ListItemButton onClick={() => handleTagClick(name)}>
              <ListItemIcon>
                <TagIcon />
              </ListItemIcon>
              {isLoading ? (
                <Skeleton width={100} />
              ) : (
                <ListItemText primary={name} />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </SideBlock>
  );
};
