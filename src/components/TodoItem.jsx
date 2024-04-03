import React, {useState, useEffect} from 'react';
import { database } from '../firebase';
import { ref, update, push, remove, set } from '@firebase/database';
import { Button, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';

// need to be able to edit text, toggle complete, add item, delete item

// eventName = any eventName on calendar including courses
// to do data is by eventName

export default function TodoItem ({id, date, time, description, eventName, completed, addItem}){
    const [isCompleted, setCompleted] = useState(completed);
    const [editing, setEditing] = useState(false);
    const [editedText, setEditedText] = useState(description);
    const [editedDate, setEditedDate] = useState(date);
    const [editedTime, setEditedTime] = useState(time);
    const [showAddInputs, setShowInputs] = useState(false);
    const [newDescription, setNewDescription] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');

    const items = [
      {
        label: <a href="https://www.antgroup.com">1st menu item</a>,
        key: '0',
      },
      {
        label: <a href="https://www.aliyun.com">2nd menu item</a>,
        key: '1',
      },
      {
        type: 'divider',
      },
      {
        label: '3rd menu item',
        key: '3',
      },
    ];

    const toggleCompleted = () => {
        const updatedCompleted = !isCompleted;
        setCompleted(updatedCompleted);
        update(ref(database, `todo/${eventName}`), { [id]: {...description, completed: updatedCompleted}});
    };

    const handleAddItem = () => {
        addNewItem(eventName, newDescription, newDate, newTime);
    };

    const addNewItem = (eventName, newItemDescription, newItemDate, newItemTime) => {
        console.log(eventName);

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

    const deleteItem = () => { remove(ref(database, `todo/${eventName}/${id}`)); };

    const editItem = () => {
        if (editing && editedText != description) {
            update(ref(database, `todo/${eventName}/${id}`),
            {
                description: editedText,
                date: editedDate,
                time: editedTime,
            });
        }
        setEditing(!editing);
    };

    return (
      <div className="flex flex-row w-1/2 justify-between">
        {editing ? (
          <>
            <input
              type="text"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />

            <input
            type="date"
            value={editedDate}
            onChange={(e) => setEditedDate(e.target.value)}
            />

            <input
            type="time"
            value={editedTime}
            onChange={(e) => setEditedTime(e.target.value)}
            />
          </>
        ) : (
          <label style={{ textDecoration: isCompleted ? 'line-through' : 'none' }}>
            {description} - {date} - {time}
          </label>
        )}

        {/* show the add new inputs conditionally so the page is not overcrowded */}
        {showAddInputs && (
          <div>
            <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            />
            <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
            />
            <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
            />
          </div>
        )}


        {/* <input type="checkbox" checked={isCompleted} onChange={toggleCompleted} />
        <button onClick={deleteItem}>Delete</button>
        <button onClick={editItem}>{editing ? 'Save' : 'Edit'}</button> */}

        <Dropdown
          menu={{
            items,
          }}
          trigger={['click']}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              Click me
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>

        {/* <button onClick={() => addItem(newDescription, newDate, newTime)}> Add</button> */}
          {/* <button onClick={() => setShowInputs(!showAddInputs)}>Add</button>
              {showAddInputs && <button onClick={handleAddItem}>Save</button>} */}
      </div>
    );
}
