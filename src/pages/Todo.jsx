import React, { useEffect, useState } from 'react';
import TodoItem from '../components/TodoItem';
import { database } from '../firebase';
import { ref, onValue, push, update } from '@firebase/database';
import { Button, Modal } from 'antd';
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const AddSectionBtn = ({ onClick, isCreateCatModalOpen }) => {
  return (
    <div onClick={onClick} className={`max-w-[300px] sm:max-w-full opacity-0 hover:opacity-100 ${isCreateCatModalOpen && "opacity-100"} transition duration-300`}>
      <div className='flex flex-row gap-2 items-center justify-between cursor-pointer'>
        <div className='bg-red-500 h-[1px] flex-grow'></div>
        <p className='font-bold text-red-500'>Add Section</p>
        <div className='bg-red-500 h-[1px] flex-grow'></div>
      </div>
    </div>
  )
}

const TodoList = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  // Authentication check and redirection
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (!user) {
        // User is not signed in; redirect them to the login page
        navigate("/login");
      }
    });

    return () => unsubscribe(); // Clean up the subscription
  }, [navigate]);

  const [events, setEvents] = useState([]);
  const [todos, setTodos] = useState({});
  const [isCreateCatModalOpen, setIsCreateCatModalOpen] = useState(false);
  const [currTodokey, setCurrTodokey] = useState("");

  const addItem = (eventName, newItemDescription, newItemDate, newItemTime, ph = false) => {
    console.log("AddItem");
    const newData = {
      description: newItemDescription,
      date: newItemDate,
      time: newItemTime,
      completed: false,
      ph: ph
    };

    console.log(newData);

    const newTodoRef = push(ref(database, `todo/${eventName}`));
    const newTodoKey = newTodoRef.key;
    console.log("NEW TODO REF:", newTodoKey);

    const updates = {};
    updates[`/todo/${eventName}/${newTodoKey}`] = newData;

    update(ref(database), updates)
      .catch((error) => {
        console.error("Error adding new item: ", error);
      });
    return newTodoKey;
  };

  const [editedText, setEditedText] = useState("");

  const handleCreateCatModelOpen = () => {
    setIsCreateCatModalOpen(true);
  };

  const handleCreateCatModelOK = () => {
    setIsCreateCatModalOpen(false);
  };

  const handleCreateCatModelCancel = () => {
    setIsCreateCatModalOpen(false);
  };

  const handleCloseCompletely = () => {
    setIsCreateCatModalOpen(false);
    setEditedText("");
  }

  const addCategory = (eventName) => {
    console.log("AddCat");

    const firstData = {
      description: "",
      date: "",
      time: "",
    };

    addItem(eventName, firstData.description, firstData.date, firstData.time, true);
  };

  useEffect(() => {
    const eventRef = ref(database, 'todo');
    const eventListener = onValue(eventRef, (snapshot) => {
      const eventData = snapshot.val();
      if (eventData) {
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
      if (todosData) {
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
    events.forEach((eventName) => {
      fetchTodosByEvent(eventName);
    });
  }, [events]);

  return (
    <div className="mx-auto flex">
      <div className="mt-8 sm:mt-0 pt-24 px-2 sm:ps-20 lg:px-64 w-max mx-auto max-w-[90vw]">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold p-4">My Todo List</h1>

          {events.map((eventName, index) => (
            <div key={eventName} className='min-w-[35rem] w-1/2'>
              {index === 0 &&
                <AddSectionBtn
                  onClick={handleCreateCatModelOpen}
                  isCreateCatModalOpen={isCreateCatModalOpen}
                />
              }

              <h3 className='pl-6 text-lg font-bold'>{eventName}</h3>
              <ul className='flex flex-col gap-1'>
                {todos[eventName] &&
                  Object.entries(todos[eventName]).map(([id, todo]) => (
                    todo.ph ? null :
                      <div key={id} className='max-w-[85vw]'>
                        <TodoItem
                          id={id}
                          description={todo.description}
                          date={todo.date}
                          time={todo.time}
                          completed={todo.completed}
                          eventName={eventName}
                          addNewItem={addItem} // so we can access eventname when adding an item
                          startEditing={currTodokey}
                          setStartEditing={setCurrTodokey}
                        />
                      </div>
                  ))}
              </ul>

              {/* Add todo item button */}
              <Button
                onClick={() => {
                  const newTodoKey = addItem(eventName, "To-do Item", "", "");
                  setCurrTodokey(newTodoKey);
                }}
              >Add</Button>

              {/* Add Section button */}
              <AddSectionBtn
                onClick={handleCreateCatModelOpen}
                isCreateCatModalOpen={isCreateCatModalOpen}
              />
            </div>
          ))}
        </div>
      </div>
      <div className='max-w-[35rem]'>
        <Modal
          open={isCreateCatModalOpen}
          onOk={handleCreateCatModelOK}
          onCancel={handleCreateCatModelCancel}
          destroyOnClose={true}
          afterClose={handleCloseCompletely}
        >
          <div>
            <div className='flex flex-col gap-2 w-max mx-auto'>
              <p>Category Name:</p>
              <input type="text" className='border rounded-sm' value={editedText} onChange={(e) => setEditedText(e.target.value)} />
              <Button onClick={() => { addCategory(editedText); handleCreateCatModelOK(); }}>Add Category</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TodoList;
