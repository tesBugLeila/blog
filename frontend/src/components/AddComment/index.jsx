import React, { useState, useCallback } from "react";
import styles from "./AddComment.module.scss";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";

export const Index = ({ postId, onSubmit }) => {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
 
  const userData = useSelector((state) => state.auth.user);

  const handleSubmit = useCallback(async () => {
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(commentText);
      setCommentText("");
    } catch (error) {
      console.error("Ошибка при добавлении комментария:", error);
      alert("Не удалось добавить комментарий");
    } finally {
      setIsSubmitting(false);
    }
  }, [commentText, onSubmit]);

  if (!userData) {
    return null;
  }

  return (
    <div className={styles.root}>
      <Avatar
        className={styles.avatar}
        src={userData?.avatarUrl || "default-avatar-url"}
        alt={userData?.username || "User Avatar"}
      />
      <TextField
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Напишите комментарий..."
        fullWidth
        multiline
        rows={3}
      />
      <Button 
        onClick={handleSubmit} 
        disabled={isSubmitting} 
        variant="contained"
        color="primary"
      >
        {isSubmitting ? "Отправка..." : "Отправить"}
      </Button>
    </div>
  );
};
