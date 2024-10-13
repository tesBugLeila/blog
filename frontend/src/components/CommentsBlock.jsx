import React, { useState } from "react";
import { useSelector } from "react-redux"; 
import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Skeleton from "@mui/material/Skeleton";

export const CommentsBlock = ({ items, children, isLoading = true, onDelete }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <SideBlock title="Комментарии">
      <List>
        {(isLoading ? [...Array(5)] : items).map((obj, index) => (
          obj && obj.id ? ( 
            <React.Fragment key={obj.id}>
              <ListItem
                alignItems="flex-start"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <ListItemAvatar>
                  {isLoading ? (
                    <Skeleton variant="circular" width={40} height={40} />
                  ) : (
                    <Avatar 
                      alt={obj.user?.fullName || 'Неизвестен'} 
                      src={obj.user?.avatarUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh0OuSfP_lwEoAgvFD1_gBI2Gf5mjxzGgsMA&s"} 
                    />
                  )}
                </ListItemAvatar>
                {isLoading ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Skeleton variant="text" height={25} width={120} />
                    <Skeleton variant="text" height={18} width={230} />
                  </div>
                ) : (
                  <ListItemText
                    primary={obj.user?.fullName || "Неизвестный пользователь"}
                    secondary={obj.text}
                  />
                )}
                {/* Показываем кнопку удаления только если пользователь авторизован и курсор наведен */}
                {!isLoading && isAuthenticated && hoveredIndex === index && (
                  <IconButton edge="end" aria-label="delete" onClick={() => onDelete(obj.id)}>
                    <CloseIcon />
                  </IconButton>
                )}
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ) : (
            <p key={index}>Комментарий отсутствует</p>
          )
        ))}
      </List>
      {children}
    </SideBlock>
  );
};
