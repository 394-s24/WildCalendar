import React, { useState, useEffect } from 'react';
import { ref, update, push, remove } from '@firebase/database';
import { database } from '../firebase';
import { Dropdown, Space, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

export default function TodoItem({ id, date, time, description, eventName, completed /*, addItem */ }) {
  const [isCompleted, setCompleted] = useState(completed);
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState(description);
  const [editedDate, setEditedDate] = useState(date);
  const [editedTime, setEditedTime] = useState(time);
  const [newDescription, setNewDescription] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const toggleCompleted = () => {
    const updatedCompleted = !isCompleted;
    setCompleted(updatedCompleted);
    update(ref(database, `todo/${eventName}/${id}`), { description, completed: updatedCompleted });
  };

  const deleteItem = () => {
    console.log("Deleting");
    remove(ref(database, `todo/${eventName}/${id}`));
  };

  const updateItem = () => {
    update(ref(database, `todo/${eventName}/${id}`), { description: editedText, date: editedDate, time: editedTime });
    setEditing(!editing);
  }

  const items = [
    {
      label: 'Edit',
      key: '0',
      onClick: () => setEditing(!editing),
    },
    {
      label: 'Delete',
      key: '2',
      danger: true,
      onClick: () => deleteItem(),
    },
  ];

  return (
    <div className="flex flex-row min-w-[35rem] w-1/2 justify-between">

      <div className='flex items-center gap-2'>
        <input type="checkbox" className="w-5 h-5" checked={isCompleted} onChange={toggleCompleted} />

        {editing ? (
          <>
            <input type="text" value={editedText} onChange={(e) => setEditedText(e.target.value)} />
            <input type="date" value={editedDate} onChange={(e) => setEditedDate(e.target.value)} />
            <input type="time" value={editedTime} onChange={(e) => setEditedTime(e.target.value)} />
          </>
        ) : (
          <label style={{ textDecoration: isCompleted ? 'line-through' : 'none' }}>
            {editedText} - {editedDate} - {editedTime}
          </label>
        )}
      </div>

      {editing ? (
        <Button onClick={() => updateItem()}>
          Save
        </Button>
      ) : (
        <Dropdown
          menu={{
            items,
          }}
          trigger={['click']}
        >
          <a onClick={(e) => e.preventDefault()} style={{ cursor: 'pointer' }}>
            <Space>
              <Button>
                ⋯
              </Button>
            </Space>
          </a>
        </Dropdown>
      )}
    </div>
  );
}
