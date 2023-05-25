import React, { useEffect, useRef, useCallback } from 'react';
import ToDoItem from './TodoItem';
import Sortable from 'sortablejs';

const ToDoItemList = ({ todoList, setTodoList, setIsLoading }) => {
  const sortableRef = useRef(null);
  const debouncedUpdateOrder = useRef(null);

  const getTodo = useCallback(async () => {
    try {
      setIsLoading(true); // 로딩 시작
      const res = await fetch(
        'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            apikey: 'KDT5_nREmPe9B',
            username: 'KDT5_ParkYoungWoong',
          },
        }
      );
      const json = await res.json();
      setTodoList(json);
    } catch (error) {
      console.error('할 일 목록을 가져오는 중에 오류가 발생했습니다:', error);
    } finally {
      setIsLoading(false); // 로딩 끝
    }
  }, [setIsLoading, setTodoList]);

  const deleteTodo = async (id) => {
    try {
      setIsLoading(true); // 로딩 시작
      await fetch(
        `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            apikey: 'KDT5_nREmPe9B',
            username: 'KDT5_ParkYoungWoong',
          },
        }
      );
      setTodoList((prevList) => prevList.filter((item) => item.id !== id));
    } catch (error) {
      console.error('할 일을 삭제하는 중에 오류가 발생했습니다:', error);
    } finally {
      setIsLoading(false); // 로딩 끝
    }
  };

  const deleteCompletedTodos = async () => {
    try {
      setIsLoading(true); // 로딩 시작
      const completedIds = todoList
        .filter((item) => item.done)
        .map((item) => item.id);
      await Promise.all(
        completedIds.map((id) =>
          fetch(
            `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${id}`,
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                apikey: 'KDT5_nREmPe9B',
                username: 'KDT5_ParkYoungWoong',
              },
            }
          )
        )
      );
      setTodoList((prevList) => prevList.filter((item) => !item.done));
    } catch (error) {
      console.error('완료된 할 일을 삭제하는 중에 오류가 발생했습니다:', error);
    } finally {
      setIsLoading(false); // 로딩 끝
    }
  };

  const updateTodo = async (id, updatedData) => {
    try {
      setIsLoading(true); // 로딩 시작
      const res = await fetch(
        `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            apikey: 'KDT5_nREmPe9B',
            username: 'KDT5_ParkYoungWoong',
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (res.ok) {
        const updatedList = todoList.map((item) =>
          item.id === id ? { ...item, ...updatedData } : item
        );
        setTodoList(updatedList);
      } else {
        console.error('할 일을 업데이트하는 중에 오류가 발생했습니다:', res.status);
      }
    } catch (error) {
      console.error('할 일을 업데이트하는 중에 오류가 발생했습니다:', error);
    } finally {
      setIsLoading(false); // 로딩 끝
    }
  };

  useEffect(() => {
    getTodo();
  }, [getTodo]);

  const updateTodoOrder = useCallback((updatedOrder) => {
    // Todo: 할 일 순서를 업데이트하는 로직 추가
  }, []);

  const debouncedUpdateTodoOrder = useCallback(
    async (updatedOrder) => {
      try {
        setIsLoading(true);
        await fetch(
          'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/reorder',
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              apikey: 'KDT5_nREmPe9B',
              username: 'KDT5_ParkYoungWoong',
            },
            body: JSON.stringify({
              todoIds: updatedOrder,
            }),
          }
        );
      } catch (error) {
        console.error('할 일 순서를 업데이트하는 중에 오류가 발생했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading]
  );

  useEffect(() => {
    if (sortableRef.current) {
      Sortable.create(sortableRef.current, {
        onEnd: ({ oldIndex, newIndex }) => {
          setTodoList((prevList) => {
            const updatedList = [...prevList];
            const [movedItem] = updatedList.splice(oldIndex, 1);
            updatedList.splice(newIndex, 0, movedItem);

            clearTimeout(debouncedUpdateOrder.current);

            debouncedUpdateOrder.current = setTimeout(() => {
              const updatedOrder = updatedList.map((item) => item.id);
              debouncedUpdateTodoOrder(updatedOrder);
            }, 500);

            return updatedList;
          });
        },
      });
    }
  }, [sortableRef, debouncedUpdateTodoOrder, setTodoList]);

  const completedList = todoList.filter((todoItem) => todoItem.done);
  const incompleteList = todoList.filter((todoItem) => !todoItem.done);

  return (
    <div className="TodoItemList">
      <p className="TodoItemList-Title">진행</p>
      <ul ref={sortableRef} className="TodoItemList-Item">
        {incompleteList.length > 0 ? (
          incompleteList.map((todoItem) => (
            <ToDoItem
              key={todoItem.id}
              todoItem={todoItem}
              setTodoList={setTodoList}
              handleDelete={deleteTodo}
              handleUpdate={updateTodo}
              todoList={todoList}
            />
          ))
        ) : (
          <li>
            {completedList.length > 0 ? (
              <span>할 일을 모두 끝낸 당신,<br />정말 훌륭해요! 👏🏼👏🏼👏🏼<br /></span>
            ) : (
              <span>아직 할 일이 없습니다!</span>
            )}
          </li>
        )}
      </ul>
      {completedList.length > 0 && (
        <>
          <hr className="TodoItemList-Divider" />
          <p className="TodoItemList-Title">완료</p>
          <ul className="TodoItemList-Item">
            {completedList.map((todoItem) => (
              <ToDoItem
                key={todoItem.id}
                todoItem={todoItem}
                setTodoList={setTodoList}
                handleDelete={deleteTodo}
                handleUpdate={updateTodo}
                todoList={todoList}
              />
            ))}
          </ul>
        </>
      )}
      {completedList.length > 0 && (
        <div className="TodoItemList-DeleteAll">
          <button
            className="TodoItemList-DeleteAllButton"
            onClick={deleteCompletedTodos}
          >
            완료한 일 모두 삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default ToDoItemList;
