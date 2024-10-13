import * as React from 'react'; 
import { useSelector } from 'react-redux'; 
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const options = [
  { label: 'Профиль', link: '/user/' }, 
  { label: 'Список пользователей', link: '/users' },
];

const ITEM_HEIGHT = 48;

export default function LongMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  
  const user = useSelector((state) => state.auth.user);
  const isAuth = Boolean(user); 

  // Если пользователь не авторизован не отображаем меню
  if (!isAuth) {
    return null;
  }

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch',
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.label} onClick={handleClose}>
            <Link
              to={option.link + (option.label === 'Профиль' && user ? user._id : '')} 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {option.label}
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
