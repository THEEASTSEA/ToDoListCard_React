import React, { useState, useEffect, useRef } from 'react';

const ToDoItem = ({ todoItem, deleteTodo, updateTodo, todoList, setTodoList }) => {
  const { id, title, done, updatedAt, createdAt } = todoItem;

  const [updatedTitle, setUpdatedTitle] = useState(title); // 수정된 제목을 상태로 관리
  const textareaRef = useRef(null); // textarea 요소에 대한 참조를 생성

  useEffect(() => {
    adjustTextareaHeight();
  }, [updatedTitle]);

  // textarea의 높이를 자동 조절하는 함수
  const adjustTextareaHeight = () => {
    if (textareaRef.current) { // 현재 텍스트 영역이 존재할 경우
      textareaRef.current.style.height = 'auto'; // 높이를 auto로 설정하여 조절
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      // 택스트 영역의 내용이 모두 보이는 높이(scrollHeight)값으로 조정
    }
  };

  // 할 일 완료 여부 토글 이벤트 핸들러
  const onToggle = async () => {
    const updatedItem = { ...todoItem, done: !done };
    // 새로운 할 일 아이템 객체 updatedItem을 생성
    // 기본 todoItem 객체를 복사하고
    // done 속성 값만 현재의 반대로 설정
    await updateTodo(id, updatedItem);
    // post의 Id와 업데이트된 내용(updatedItem)을 서버에 전송
    const updatedList = todoList.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    // todoList 아이템을 순회
    // 현재 아이템과 업데이트된 id가 일치하는 경우 
    // done 속성을 반전시킨 아이템으로 대체
    // 일치하지 않는 경우 기존 아이템 유지
    setTodoList(updatedList);
    // 새로운 목록 할당
  };

  // 할일 수정 이벤트 핸들러
  const onUpdate = async () => {
    const updatedItem = { ...todoItem, title: updatedTitle };
    // 기존 todoItem 객체를 복사, title 속성을 updatedTitle 값으로 업데이트
    await updateTodo(id, updatedItem);
    // id값과 수정된 내용을 전달하여 updateTodo 함수 실행
    const updatedList = todoList.map((item) =>
      item.id === id ? { ...item, title: updatedTitle } : item
    );
    // todoList 아이템을 순회, 현재 id값과 일치하는 아이템의 title 속성을
    // 수정된 updatedTitle로 대체, 그렇지 않은 경우 기존 값 유지
    setTodoList(updatedList);
    // 할일 목록을 업데이트된 새 목록으로 할당
  };



  // 할 일 삭제 이벤트 핸들러
  const onDelete = () => {
    deleteTodo(id);
  };

  // 키 다운 이벤트 핸들러 (Enter 키를 누르면 호출)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onUpdate();
    }
  };

  // 포커스 아웃 이벤트 핸들러 (텍스트 영역에서 포커스를 잃으면 호출)
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
