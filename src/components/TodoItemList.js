import React, { useEffect, useRef, useCallback } from 'react';
import ToDoItem from './TodoItem';
import Sortable from 'sortablejs';

const ToDoItemList = ({ todoList, setTodoList, setIsLoading }) => {
  const sortableRef = useRef(null); // Sortable 인스턴스 참조
  const debouncedUpdateOrder = useRef(null); // 순서 업데이트 함수 디바운스 참조


  const getTodo = useCallback(async () => {
    // useCallback 함수를 한번만 생성, 메모리 저장, 성능 최적화
    try {
      setIsLoading(true); // 로딩 시작
      const res = await fetch(
        'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'KDT5_nREmPe9B',
            'username': 'KDT5_ParkYoungWoong',
          },
        }
      );
      const json = await res.json(); // json 변환
      setTodoList(json); // 서버에서 받은 할 일 목록을 TodoList에 상태 할당
    } catch (error) { // 에러가 발생했을 때
      console.error('할 일 리스트 조회 오류', error);
    } finally {
      setIsLoading(false); // 로딩 종료
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
            'apikey': 'KDT5_nREmPe9B',
            'username': 'KDT5_ParkYoungWoong',
          },
        }
      );
      setTodoList((prevList) => prevList.filter((item) => item.id !== id));
      // ID가 일치하는 아이템을 제거, 이전 목록에 새로운 목록 생성, 삭제할 id와 일치하지 않는 항목만 필터링
    } catch (error) {
      console.error('할 일 삭제 오류', error);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  const deleteCompletedTodos = async () => {
    try {
      setIsLoading(true); // 로딩 시작
      const completedIds = todoList
        .filter((item) => item.done)
        .map((item) => item.id);
      // done 속성이 true(완료)인 항목 필터링 후 id값 추출
      // map을 통해 완료된 할 일 ID를 기반으로 삭제 요청
      await Promise.all(
        completedIds.map((id) =>
          fetch(
            `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${id}`,
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'apikey': 'KDT5_nREmPe9B',
                'username': 'KDT5_ParkYoungWoong',
              },
            }
          )
        )
      );
      setTodoList((prevList) => prevList.filter((item) => !item.done));
      // todolist 상태 변수 업데이트
      // 이전 리스트에서 새로운 리스트 생성, done값이 false인 아이템
    } catch (error) {
      console.error('완료 항목 삭제 오류', error);
    } finally {
      setIsLoading(false); // 로딩 상태를 false로 설정하여 로딩 종료
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
            'apikey': 'KDT5_nREmPe9B',
            'username': 'KDT5_ParkYoungWoong',
          },
          body: JSON.stringify(updatedData),
        }
      );
      const updatedList = todoList.map((item) =>
        item.id === id ? { ...item, ...updatedData } : item
      );
      // 수정 아이템과 기존 아이템 id가 일치하면, updatedData 할당
      setTodoList(updatedList); // 상태 업데이트
    } catch (error) {
      console.error('할 일 수정 오류', error);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  useEffect(() => {
    getTodo(); // 컴포넌트 마운트 시 할 일 목록 조회
  }, [getTodo, setIsLoading, setTodoList]);

  const groupUpdateTodoOrder = useCallback(
    async (updatedOrder) => {
      try {
        setIsLoading(true); // 로딩 시작
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
              todoIds: updatedOrder, // 업데이트된 아이템 순서 전달
            }),
          }
        );
      } catch (error) {
        console.error('할 일 순서를 업데이트하는 중에 오류가 발생했습니다:', error);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    },
    [setIsLoading]
  );

  useEffect(() => {
    if (sortableRef.current) {
      // 현재 ul 태그가 존재하면 실행
      const sortable = new Sortable(sortableRef.current, {
        onEnd: ({ oldIndex, newIndex }) => {
          // 드래그 할 때 실행되는 콜백 함수, 드래그 전 인덱스, 드레그 후 인덱스
          setTodoList((prevList) => {
            const updatedList = [...prevList];
            // 이전 배열을 바탕으로 새 배열 생성
            const [movedItem] = updatedList.splice(oldIndex, 1);
            // 드래그 전 인덱스 값 제거, 제거한 항목을 movedItem에 할당
            updatedList.splice(newIndex, 0, movedItem);
            // 이동할 위치, 삭제할 항목의 수, 이동할 항목
            clearTimeout(debouncedUpdateOrder.current);

            debouncedUpdateOrder.current = setTimeout(() => {
              const updatedOrder = updatedList.map((item) => item.id);
              // 항목의 id값 추출 후 새로운 배열 할당 
              groupUpdateTodoOrder(updatedOrder);
              // 일정 시간 동안 호출(추가 드래그)이 없으면 실행
            }, 1000);

            return updatedList;
          });
        },
      });

      sortable.option("onMove", function (evt) {
        // 읻동 요소에 애니메이션 클래스 추가
        const item = evt.dragged;
        item.classList.add("sortable-dragging");
      });

      sortable.option("onUnchoose", function (evt) {
        // 이동 완료 후 애니메이션 클래스 제거
        const item = evt.item;
        item.classList.remove("sortable-dragging");
      });

      return () => {
        sortable.destroy(); // 컴포넌트 언마운트 시 해제
      };
    }
  }, [sortableRef.current, groupUpdateTodoOrder, setTodoList]);

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
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
              todoList={todoList}
            />
          ))
        ) : (
          <li>
            {completedList.length > 0 ? (
              <span>오늘 할 일을 모두 끝낸 당신,<br />정말 훌륭해요! 👏🏼👏🏼👏🏼</span>
            ) : (
              <span>등록된 내역이 없어요!<br />오늘 할 일을 등록해 볼까요?🥸</span>
            )}
          </li>
        )}
      </ul>
      {completedList.length > 0 && (
        <>
          <p className="TodoItemList-Title">완료</p>
          <ul className="TodoItemList-Item">
            {completedList.map((todoItem) => (
              <ToDoItem
                key={todoItem.id}
                todoItem={todoItem}
                setTodoList={setTodoList}
                deleteTodo={deleteTodo}
                updateTodo={updateTodo}
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
            완료 전체 삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default ToDoItemList;