import React, {useEffect, useState} from 'react';
import TodoItem from '../components/TodoItem';
import { database } from '../firebase';
import {ref, onValue, push} from '@firebase/database';


const TodoList = () => {

  const [events, setEvents] = useState([]);
  const [todos, setTodos] = useState({});

    const addItem = (eventName, newItemDescription, newItemDate, newItemTime) =>
    {
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
          .then(() => {
              // reset the fields to empty after adding new item
              setNewDescription('');
              setNewDate('');
              setNewTime('');
              setShowInputs(false);
          })
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

  useEffect(() => {
    console.log('Todos:', todos);
  }, [])

  return (
    <div className='w-screen'>
      My todo list!
      {events.map((eventName) => (
          <div key={eventName}>
            <h3>{eventName}</h3>
              <ul>
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
          </div>
      ))}
    </div>
  );
};

export default TodoList;
