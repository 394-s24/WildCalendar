import React, {useEffect, useState} from 'react';
import TodoItem from '../components/TodoItem';
import { database } from '../firebase';
import {ref, onValue, push} from '@firebase/database';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navigation/Navbar.jsx";

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


  //   const eventRef = database.ref('todos/events');
  //   eventRef.on('value', (snapshot) =>
  //   {
  //     const eventData = snapshot.val();
  //     if (eventData)
  //     {
  //       setEvents(Object.keys(eventData));
  //       setTodos(eventData);
  //     }
  //   });

  //   return () => {
  //     eventRef.off();
  //   };

  // }, []);

  const fetchTodosByEvent = (eventName) => 
  {
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


    // const todosRef = database.ref(`todo/${eventName}`);
    // todosRef.on('value', (snapshot) => {
    //   const todosData = snapshot.val();
    //   if(todosData)
    //   {
    //     setTodos((prevTodos) => ({
    //       ...prevTodos,
    //       [eventName]: todosData
    //     }));
    //   }
    //   });

    //     return () => 
    //     {
    //       todosRef.off();
    //     };
    //   };
      // if (todosData = snapsh)

  useEffect(() => 
  {
    events.forEach((eventName) => 
    {
      fetchTodosByEvent(eventName);
    });
  }, [events]);


  // const addItem = (eventName) => 
  // {
  //   const newItemRef = database.ref(`todo/${eventName}`).push();
  //   newItemRef.set({
  //     description: 'temp',
  //     date: '2024-04-02',
  //     time: '9:30', 
  //     completed: false
  //   });
  // };
    
  return (
    <div>
       <Navbar />
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



// used to add some data

//   const addExampleTodoItems = (eventNames) => {
//     eventNames.forEach(eventName => {
//         const todoRef = ref(database, 'todo');
    
//         const exampleTodos = [
//             {
//                 eventName: eventName,
//                 description: 'Example Todo 1',
//                 date: '2024-04-01',
//                 time: '10:00',
//                 completed: false,
//             },
//             {
//                 eventName: eventName,
//                 description: 'Example Todo 2',
//                 date: '2024-04-02',
//                 time: '11:00',
//                 completed: false,
//             },
//             {
//                 eventName: eventName,
//                 description: 'Example Todo 3',
//                 date: '2024-04-03',
//                 time: '12:00',
//                 completed: false,
//             },
//         ];
    
//         exampleTodos.forEach((todo) => {
//             push(ref(database, `todo/${eventName}`), todo);
//         });
//     });
// };

// useEffect(() => {
//     addExampleTodoItems(['CS449', 'CS394', 'CS330']);
// }, []);