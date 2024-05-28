import React, { useState, useEffect } from 'react';
import { Dropdown, Space, Button } from 'antd';
import { updateData, removeData } from '../firebase';

export default function TodoItem({ id, date, time, description, eventName, completed, startEditing, setStartEditing }) {
  const [isCompleted, setCompleted] = useState(completed);
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState(description);
  const [editedDate, setEditedDate] = useState(date);
  const [editedTime, setEditedTime] = useState(time);

  useEffect(() => {
    if (startEditing === id) {
      setEditing(true);
    }
  }, [startEditing, id]);

  const toggleCompleted = async () => {
    const updatedCompleted = !isCompleted;
    setCompleted(updatedCompleted);
    await updateData(`todo/${eventName}/${id}`, { description, completed: updatedCompleted });
  };

  const deleteItem = async () => {
    console.log("Deleting");
    await removeData(`todo/${eventName}/${id}`);
  };

  const updateItem = async () => {
    await updateData(`todo/${eventName}/${id}`, { description: editedText, date: editedDate, time: editedTime });
    setEditing(!editing);
    setStartEditing("");
  };

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
    <div className="border rounded-xl p-4 mb-4 flex flex-row justify-between">
      <div className='flex items-start gap-2'>
        <input type="checkbox" className="cursor-pointer w-5 h-5" checked={isCompleted} onChange={toggleCompleted} />
        {editing ? (
          <>
            <input type="text" value={editedText} onChange={(e) => setEditedText(e.target.value)} />
            <input type="date" value={editedDate} onChange={(e) => setEditedDate(e.target.value)} />
            <input type="time" value={editedTime} onChange={(e) => setEditedTime(e.target.value)} />
          </>
        ) : (
          <div className='flex flex-col gap-1'>
            <p>{editedText}</p>
            <p className='text-gray-500'>{editedDate}</p>
            <p className='text-gray-500'>{editedTime}</p>
          </div>
        )}
      </div>

      {editing ? (
        <Button onClick={updateItem}>
          Save
        </Button>
      ) : (
        <Dropdown
          menu={{
            items,
          }}
          trigger={['click']}
        >
          <a onClick={(e) => e.preventDefault()} className='cursor-pointer h-max'>
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
