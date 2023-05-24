import React, { useState } from 'react';

const ToDoItem = ({ todoItem, handleDelete, handleUpdate, todoList, setTodoList }) => {
  const { id, title, done, updatedAt, createdAt } = todoItem;
  const [updatedTitle, setUpdatedTitle] = useState(title);

  const onToggle = async () => {
    const updatedItem = { ...todoItem, done: !done };
    await handleUpdate(id, updatedItem);
    // API 요청이 완료된 후에 상태 업데이트
    const updatedList = todoList.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    setTodoList(updatedList);
  };



  const onUpdate = async () => {
    const updatedItem = { ...todoItem, title: updatedTitle };
    await handleUpdate(id, updatedItem);
    // API 요청이 완료된 후에 상태 업데이트
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
        <input className='inputbox'
          type="text"
          value={updatedTitle}
          onChange={(e) => setUpdatedTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur} // 입력이 끝나면 onUpdate 호출
          disabled={done} // 체크되어 있으면 비활성화
          style={{ textDecoration: done ? 'line-through' : 'none' }} // 체크되어 있으면 취소선 추가
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
