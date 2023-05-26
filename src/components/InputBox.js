import React, { useState, useRef } from 'react';

const InputBox = ({ setTodoList, isLoading, setIsLoading }) => {
  const [text, setText] = useState(''); // Input에 입력된 텍스트 값을 상태로 관리
  const [isPosting, setIsPosting] = useState(false); // 등록 중인지 여부를 상태로 관리
  const inputRef = useRef(null); // input 요소에 대한 참조를 생성

  const onChange = (e) => {
    setText(e.target.value); // 입력된 텍스트 값을 업데이트
  };

  const postTodo = async () => {
    if (isPosting) {
      return; // 이미 처리 중인 경우 무시
    }

    if (text.trim() === '') {
      return; // 입력된 텍스트가 없는 경우 무시
    }

    setIsPosting(true); // 등록 중임을 표시

    try {
      setIsLoading(true); // 로딩 상태를 true로 설정
      const res = await fetch(
        'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'KDT5_nREmPe9B', // API 키를 헤더에 추가
            'username': 'KDT5_ParkYoungWoong', // 사용자 이름을 헤더에 추가
          },
          body: JSON.stringify({
            'title': text, // 입력된 텍스트를 요청 데이터에 추가
          }),
        }
      );

      const json = await res.json(); // 응답 데이터를 JSON으로 변환
      setText(''); // 입력된 텍스트를 초기화
      inputRef.current.focus(); // input 요소에 포커스 
      setTodoList((prevList) => [json, ...prevList]); // TodoList 업데이트
    } catch (error) {
      console.error('할 일을 등록하는 중에 오류가 발생했습니다:', error); // 오류 발생 시 에러 메시지 출력
    } finally {
      setIsPosting(false); // 등록 완료 표시
      setIsLoading(false); // 로딩 상태를 false로 설정
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      postTodo(); // Enter 키를 누르면 postTodo 함수 호출
    }
  };

  return (
    <div className="InputBox">
      <input
        type="text"
        name="todoItem"
        value={text}
        placeholder="오늘 해야할 일"
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
