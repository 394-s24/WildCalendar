import {describe, expect, test} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import Todo from './pages/Todo';


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// HIBA UNIT TESTS BELOW: 

// Test 0 - add to do item
// Test 1 - edit to do item 
// Test 2 - delete to do item


test('add, edit, and delete a todo item', async () => {
  render(<Todo />);

  // Adding a to-do item first
  await sleep(500);
  fireEvent.click(screen.getAllByText('Add')[0]);

  await sleep(500);
  expect(screen.getAllByText('To-do Item')).toBeDefined();

  // Access the dropdown menu
  fireEvent.click(screen.getAllByText('⋯')[0]);

  // click the edit button
  fireEvent.click(screen.getAllByText('Edit')[0]);
  // edit and save to do item text
  const todoItemText = screen.getAllByText('To-do Item')[0];
  todoItemText.textContent = 'Edited To-do Item';
  fireEvent.click(screen.getByText('Save'));

  await sleep(500);
  expect(screen.getAllByText('Edited To-do Item')).toBeDefined();


    // Access the dropdown menu again
    fireEvent.click(screen.getAllByText('⋯')[0]);

    // Click the delete button
    fireEvent.click(screen.getAllByText('Delete')[0]);
  
    await sleep(500);

    const editedItem = screen.queryByTitle('Edited To-do Item');
    // console.log("EDITED ITEM");
    // console.log(editedItem);
    expect(editedItem).toBeNull()

});