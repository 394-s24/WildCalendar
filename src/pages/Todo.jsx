import React, {useEffect, useState} from 'react';
import TodoItem from '../components/TodoItem';
import { database } from '../firebase';
import {ref, onValue, push, update} from '@firebase/database';
import { Button } from 'antd';
import TodoSidebar from "../components/TodoSidebar";

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

  const [editedText, setEditedText] = useState("");

  const addCategory = ({eventName}) =>
    {
      console.log("AddCat")

      const newTodoRef = ref(database, `todo/${eventName}`);

      const updates = {};

      updates[`/todo/${eventName}`] = {};

      return update(newTodoRef, updates)
          .catch((error) => {
              console.error("Error adding new category: ", error);
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
    <div className="mx-auto flex">
      <div className="fixed h-screen">
        <TodoSidebar />
      </div>
      <div className="pt-24 px-2 sm:px-4 sm:ps-20 lg:ps-64 flex-grow w-screen mx-auto">
        <div className="flex flex-col gap-4">
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
            </div>
        ))}
        <div>
          <input type="category text" value={editedText} onChange={(e) => setEditedText(e.target.value)} />
          <Button onClick={() => {addCategory(editedText)}}>Add Category</Button>
        </div>
        </div>
      </div>

      

    </div>
  );
};

export default TodoList;
