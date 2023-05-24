import React, { useState } from 'react';
import InputBox from '../components/InputBox';
import ToDoItemList from '../components/TodoItemList';
import css from '../App.css'

const Home = () => {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false) // 로딩 상태

  const today = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    date: new Date().getDate(),
    week: new Date().getDay(),
  };
  const week = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const todayLabel = week[today.week]

  return (
    <div className="Home">
      <div className='TodayDate'>
        {isLoading && <div class="loading"></div>}
        <div className="today">
          {today.year}년 {today.month}월 {today.date}일
        </div>
        <div className="week">{todayLabel}</div>
      </div>
      <InputBox todoList={todoList} setTodoList={setTodoList} isLoading={isLoading} setIsLoading={setIsLoading} />
      <ToDoItemList todoList={todoList} setTodoList={setTodoList} isLoading={isLoading} setIsLoading={setIsLoading} />
    </div>
  );
};

export default Home;
