import React, { useState, useEffect, useRef } from 'react';

const ToDoItem = ({ todoItem, handleDelete, handleUpdate, todoList, setTodoList }) => {
  const { id, title, done, updatedAt, createdAt } = todoItem;
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const textareaRef = useRef(null);

  useEffect(() => {
    adjustTextareaHeight();
  }, [updatedTitle]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const onToggle = async () => {
    const updatedItem = { ...todoItem, done: !done };
    await handleUpdate(id, updatedItem);
    const updatedList = todoList.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    setTodoList(updatedList);
  };

  const onUpdate = async () => {
    const updatedItem = { ...todoItem, title: updatedTitle };
    await handleUpdate(id, updatedItem);
    const updatedList = todoList.map((item) =>
      item.id === id ? { ...item, title: updatedTitle } : item
    );
    setTodoList(updatedList);
  };

  const onDelete = () => {
    handleDelete(id);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onUpdate();
    }
  };

  const handleBlur = () => {
    onUpdate();
  };

  return (
    <li className={`ToDoItem ${done ? 'completed' : 'pending'}`}>
      <div className='input'>
        <input className='checkbox' type="checkbox" checked={done} onChange={onToggle} />
        <textarea
          ref={textareaRef}
          className='inputbox'
          type="text"
          value={updatedTitle}
          onChange={(e) => setUpdatedTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          disabled={done}
          style={{ textDecoration: done ? 'line-through' : 'none' }}
        />
        <button className='oneDelete' onClick={onDelete}>삭제</button>
      </div>
      <p className="ToDoItem-updatedAt">{new Date(createdAt).toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })} 등록</p>
      <p className="ToDoItem-updatedAt">{new Date(updatedAt).toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })} 수정</p>
    </li>
  );
};

export default ToDoItem;
