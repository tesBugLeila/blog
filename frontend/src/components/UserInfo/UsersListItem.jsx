import React from 'react';
import { UserInfo } from './index'; 
import './UsersListItem.css'; 

export const UsersListItem = ({ user, onDelete, onFollow, onUnfollow, isFollowing, canFollow }) => {
  return (
    <div className="user-list-item">
      <UserInfo
        avatarUrl={user.avatarUrl}
        fullName={user.username}
        additionalText={`Email: ${user.email}`}
      />
      <div className="user-actions">
        {canFollow && (
          isFollowing ? (
            <button
              className="action-button unfollow-button"
              onClick={() => onUnfollow(user._id)} 
            >
              Отписаться
            </button>
          ) : (
            <button
              className="action-button follow-button"
              onClick={() => onFollow(user._id)} 
            >
              Подписаться
            </button>
          )
        )}
        <button
          className="action-button delete-button"
          onClick={() => onDelete(user._id)} 
        >
          Удалить
        </button>
      </div>
    </div>
  );
};
