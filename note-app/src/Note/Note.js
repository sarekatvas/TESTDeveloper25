import React from "react";
import "./Note.css";

function Note({
  title,
  content,
  imageNote,
  onDelete,
  onUpdate,
  fontFamily,
  fontSize,
  color,
  backgroundColor,
}) {
  return (
    <div
      className="note"
      style={{
        backgroundColor,
      }}
    >
      <h2>{title}</h2>
      <p style={{ fontFamily, fontSize, color }}>{content}</p>
      {imageNote && (
        <img
          src={imageNote}
          alt="Загруженное изображение"
          className="fixed-size-image"
        />
      )}
      <button className="note-button" onClick={onDelete}>
        Удалить
      </button>
      <button className="note-button" onClick={onUpdate}>
        Редактировать
      </button>
    </div>
  );
}
export default Note;
