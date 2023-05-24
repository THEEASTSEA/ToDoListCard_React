import React, { useState, useRef, useEffect } from 'react';

const InputBox = ({ todoList, setTodoList, isLoading, setIsLoading }) => {
  const [text, setText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const inputRef = useRef(null);

  const onChange = (e) => {
    setText(e.target.value);
  };

  const postTodo = async () => {
    if (isPosting) {
      return; // 이미 처리 중인 경우 무시
    }

    if (text.trim() === '') {
      return;
    }

    setIsPosting(true);

    try {
      setIsLoading(true);
      const res = await fetch(
        'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: 'KDT5_nREmPe9B',
            username: 'KDT5_ParkYoungWoong',
          },
          body: JSON.stringify({
            title: text,
            checked: false,
          }),
        }
      );

      const json = await res.json();
      setText('');
      inputRef.current.focus();
      setTodoList((prevList) => [json, ...prevList]);
    } catch (error) {
      console.error('할 일을 등록하는 중에 오류가 발생했습니다:', error);
    } finally {
      setIsPosting(false);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      postTodo();
    }
  };

  return (
    <div className="InputBox">
      <input
        type="text"
        name="todoItem"
        value={text}
        placeholder="할 일"
        className="InputBox-Input"
        onChange={onChange}
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />
      <button className="submit" onClick={postTodo} type="submit" disabled={isLoading}>
        <span class="material-symbols-outlined">
          add
        </span>
      </button>
    </div>
  );
};

export default InputBox;
