import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Select } from "antd";
import Note from "./Note/Note.js";
import "./App.css";
import FormItem from "antd/es/form/FormItem/index.js";

const { Option } = Select;

function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    return savedNotes && savedNotes.length > 0
      ? savedNotes
      : [
          {
            id: Date.now(),
            title: "Пример заметки",
            content: "Это пример заметки.",
            category: "Важное",
          },
        ];
  });

  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "Важное",
    imageNode: null,
    fontFamily: "Arial",
    fontSize: "16px",
    color: "#000000",
    backgroundColor: "#ffffff",
  });

  const [updateNote, setUpdateNote] = useState(null);
  const [addWindowVisible, setAddWindowVisible] = useState(false);
  const [updateWindowVisible, setUpdateWindowVisible] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const showWindow = () => {
    setAddWindowVisible(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target || {};
    setNewNote({ ...newNote, [name]: value });
  };

  const handleCategoryChange = (value) => {
    setNewNote({ ...newNote, category: value });
  };

  const handleAddNote = () => {
    if (newNote.title.trim() === "" || newNote.content.trim() === "") {
      alert("Заполните поля!");
      return;
    }

    const note = {
      id: Date.now(),
      ...newNote,
      imageNote: image,
    };

    setNotes([...notes, note]);

    setNewNote({ title: "", content: "", category: "", image: null });
    setImage(null);
    setAddWindowVisible(false);
  };

  const handleDeleteNote = (id) =>
    setNotes(notes.filter((note) => note.id !== id));

  const handleUpdateNote = (id) => {
    if (updateNote.title.trim() === "" || updateNote.content.trim() === "") {
      alert("Заполните поля!");
      return;
    }

    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, ...updateNote } : note
    );

    setNotes(updatedNotes);
    setUpdateNote(null);
    setUpdateWindowVisible(false);
  };

  const handleCancelUpdate = () => {
    setUpdateNote(null);
    setUpdateWindowVisible(false);
  };

  const handleUpdateCategoryChange = (value) => {
    setUpdateNote({ ...updateNote, category: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setNewNote({ ...newNote, imageNote: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const categories = ["Важное", "Учеба", "Работа", "Домашние дела"];

  return (
    <div className="App">
      <h1 className="h1-style">Мои заметки</h1>
      <div className="button-style">
        <Button type="primary" onClick={showWindow} className="add-button">
          +
        </Button>
      </div>

      <Modal
        title="Новая заметка"
        open={addWindowVisible}
        onOk={handleAddNote}
        onCancel={() => setAddWindowVisible(false)}
        okText="Добавить"
        cancelText="Отмена"
      >
        <Input
          placeholder="Заголовок"
          name="title"
          value={newNote.title}
          onChange={handleInputChange}
          style={{ marginBottom: "10px" }}
        />
        <Input.TextArea
          placeholder="Текст заметки"
          name="content"
          value={newNote.content}
          onChange={handleInputChange}
          rows={4}
          style={{ marginBottom: "10px" }}
        />
        <Select
          placeholder="Выберите шрифт"
          value={newNote.fontFamily}
          onChange={(value) => setNewNote({ ...newNote, fontFamily: value })}
          style={{ width: "100%", marginBottom: "10px" }}
        >
          <Option value="Arial">Arial</Option>
          <Option value="Times New Roman">Times New Roman</Option>
          <Option value="Courier New">Courier New</Option>
          <Option value="Verdana">Verdana</Option>
        </Select>
        <Input
          type="number"
          placeholder="Размер текста (px)"
          value={parseInt(newNote.fontSize)}
          onChange={(e) =>
            setNewNote({ ...newNote, fontSize: `${e.target.value}px` })
          }
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <FormItem label="Цвет текста" style={{ margin: "10px" }}>
          <Input
            type="color"
            value={newNote.color}
            onChange={(e) => setNewNote({ ...newNote, color: e.target.value })}
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </FormItem>
        <FormItem label="Цвет фона заметки" style={{ margin: "10px" }}>
          <Input
            type="color"
            value={newNote.backgroundColor}
            onChange={(e) =>
              setNewNote({ ...newNote, backgroundColor: e.target.value })
            }
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </FormItem>
        <FormItem label="Прикрепите картинку" style={{ margin: "10px" }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ margin: "10px" }}
          />
          {image && (
            <img
              src={image}
              alt="Загруженное изображение"
              className="fixed-size-image"
            />
          )}
        </FormItem>
        <Select
          name="category"
          value={newNote.category}
          onChange={handleCategoryChange}
        >
          <Option value="">Выберите категорию</Option>
          <Option value="Важное">Важное</Option>
          <Option value="Учеба">Учеба</Option>
          <Option value="Работа">Работа</Option>
          <Option value="Домашние дела">Домашние дела</Option>
        </Select>
      </Modal>

      <Modal
        title={`Редактирование заметки: ${updateNote ? updateNote.title : ""}`}
        open={!!updateNote}
        onOk={() => handleUpdateNote(updateNote.id)}
        onCancel={handleCancelUpdate}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Input
          placeholder="Заголовок"
          name="title"
          value={updateNote ? updateNote.title : ""}
          onChange={(e) =>
            setUpdateNote({ ...updateNote, title: e.target.value })
          }
          style={{ marginBottom: "10px" }}
        />
        <Input.TextArea
          placeholder="Текст заметки"
          name="content"
          value={updateNote ? updateNote.content : ""}
          onChange={(e) =>
            setUpdateNote({ ...updateNote, content: e.target.value })
          }
          rows={4}
        />
        <Select
          placeholder="Выберите шрифт"
          value={updateNote ? updateNote.fontFamily : ""}
          onChange={(value) =>
            setUpdateNote({ ...updateNote, fontFamily: value })
          }
        >
          <Option value="Arial">Arial</Option>
          <Option value="Times New Roman">Times New Roman</Option>
          <Option value="Courier New">Courier New</Option>
          <Option value="Verdana">Verdana</Option>
        </Select>
        <Input
          type="number"
          placeholder="Размер текста (px)"
          value={parseInt(updateNote ? updateNote.fontSize : "16")}
          onChange={(e) =>
            setUpdateNote({ ...updateNote, fontSize: `${e.target.value}px` })
          }
        />
        <FormItem label="Цвет текста" name="color">
          <Input
            type="color"
            value={updateNote ? updateNote.color : "#000000"}
            onChange={(e) =>
              setUpdateNote({ ...updateNote, color: e.target.value })
            }
          />
        </FormItem>
        <FormItem label="Цвет фона" name="backgroundColor">
          <Input
            type="color"
            value={updateNote ? updateNote.backgroundColor : "#ffffff"}
            onChange={(e) =>
              setUpdateNote({ ...updateNote, backgroundColor: e.target.value })
            }
          />
        </FormItem>
        <Select
          name="category"
          value={updateNote ? updateNote.category : ""}
          onChange={handleUpdateCategoryChange}
        >
          <Option value="">Выберите категорию</Option>
          <Option value="Важное">Важное</Option>
          <Option value="Учеба">Учеба</Option>
          <Option value="Работа">Работа</Option>
          <Option value="Домашние дела">Домашние дела</Option>
        </Select>
      </Modal>
      <div className="grid-style">
        {categories.map((category) => (
          <div key={category} className="column">
            <h2>{category}</h2>
            {notes
              .filter((note) => note.category === category)
              .map((note) => (
                <Note
                  key={note.id}
                  title={note.title}
                  content={note.content}
                  category={note.category}
                  imageNote={note.imageNote}
                  fontFamily={note.fontFamily}
                  fontSize={note.fontSize}
                  color={note.color}
                  backgroundColor={note.backgroundColor}
                  onDelete={() => handleDeleteNote(note.id)}
                  onUpdate={() => setUpdateNote(note)}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
