import React, {useEffect, useState} from 'react';
import TodoItem from '../components/TodoItem';
import { database } from '../firebase';
import {ref, onValue, push, update} from '@firebase/database';
// import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from 'antd';

const TodoList = () => {

  const [events, setEvents] = useState([]);
  const [todos, setTodos] = useState({});

    const addItem = (eventName, newItemDescription, newItemDate, newItemTime) =>
    {
      console.log("AddItem")
      const newData = {
          description: newItemDescription,
          date: newItemDate,
          time: newItemTime,
          completed: false,
      };

      const newTodoRef = push(ref(database, `todo/${eventName}`));
      const newTodoKey = newTodoRef.key;

      const updates = {};

      updates[`/todo/${eventName}/${newTodoKey}`] = newData;

      return update(ref(database), updates)
          .catch((error) => {
              console.error("Error adding new item: ", error);
          });
  };

  useEffect(() => {
    const eventRef = ref(database, 'todo');
    const eventListener = onValue(eventRef, (snapshot) =>
    {
      const eventData = snapshot.val();
      if (eventData)
      {
        setEvents(Object.keys(eventData));
        setTodos(eventData);
      }
    });

    return () => {
      eventListener();
    };
  }, []);

  const fetchTodosByEvent = (eventName) => {
    const todosRef = ref(database, `todo/${eventName}`);
    const todosListener = onValue(todosRef, (snapshot) => {
      const todosData = snapshot.val();
      if(todosData)
      {
        setTodos((prevTodos) => ({
          ...prevTodos,
          [eventName]: todosData
        }));
      }
    });

    return () => {
      todosListener();
    };
  };

  useEffect(() => {
    events.forEach((eventName) =>
    {
      fetchTodosByEvent(eventName);
    });
  }, [events]);

  return (
    <div className='w-screen'>
      <div className='mx-auto w-max'>
        <h1 className="text-3xl font-bold p-4">My Todo List</h1>
        {events.map((eventName) => (
            <div key={eventName}>
              <h3 className='pl-6 text-lg font-bold'>{eventName}</h3>
              <ul className='flex flex-col gap-1'>
                {todos[eventName] &&
                  Object.entries(todos[eventName]).map(([id, todo]) => (
                    <TodoItem
                      key={id}
                      id={id}
                      description={todo.description}
                      date={todo.date}
                      time={todo.time}
                      completed={todo.completed}
                      eventName={eventName}
                      addNewItem={addItem} // so we can access eventname when adding an item
                    />
                  ))}
              </ul>
              <div className='ml-8 mb-10'>
                <Button onClick={() => addItem(eventName, "To-do Item", "", "")}>Add</Button>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
