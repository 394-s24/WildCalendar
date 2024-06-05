import {describe, expect, test} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import Todo from './pages/Todo';
import Login from './pages/Login';
import ClassSearch from '../components/ClassSearch'; // Adjust the path as needed

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Calendar Component Test', () => {

  test('adding course that does not exist from search bar', async () => {

    // Mock calendarRef
    const calendarRef = { current: { getApi: () => ({ getEventById: jest.fn() }) } };

    // Render ClassSearch component
    render(<ClassSearch calendarRef={calendarRef} />);

    // Find the input element within the AutoComplete component
    const searchBar = screen.getByRole('combobox');

    // Simulate typing in the search bar
    fireEvent.change(searchBar, { target: { value: 'COMP_SCI 999-0 - This Class Does Not Exist' } });
    expect(searchBar.value).toBe('COMP_SCI 999-0 - This Class Does Not Exist')
    await sleep(1000)

    // Navigate to the first item in the autocomplete box
    fireEvent.keyDown(searchBar, { key: 'ArrowDown' });
    await sleep(1000);

    // Check that no options are available
    const noOptions = screen.queryByRole('option');
    expect(noOptions).not.toBeInTheDocument();

    // Ensure that no item can be selected
    fireEvent.keyDown(searchBar, { key: 'Enter' });
    await sleep(1000);

    // Try to click button that doesn't exist
    const searchBarRect = searchBar.getBoundingClientRect();
    const clickCoordinates = [
      { x: searchBarRect.left + 10, y: searchBarRect.bottom + 50 },
      { x: searchBarRect.left + 10, y: searchBarRect.bottom + 100 },
      { x: searchBarRect.left + 10, y: searchBarRect.bottom + 150 },
    ];

    clickCoordinates.forEach(({ x, y }) => {
      fireEvent.mouseDown(document.body, { clientX: x, clientY: y });
      fireEvent.mouseUp(document.body, { clientX: x, clientY: y });
    });

    // Click button to add course from the dropdown results, since bottom row of button says 'Tu Th'
    const addButton = screen.getByText('Tu Th')
    fireEvent.click(addButton)

    // Verify that course has NOT been added to the calendar --> event on calendar says '9:30 - 10:50' on top left corner
    expect(await screen.ByText('9:30 - 10:50')).not.toBeDefined();

  });

  test('add course that exists to calendar from search bar', async () => {

    // Mock calendarRef
    const calendarRef = { current: { getApi: () => ({ getEventById: jest.fn() }) } };

    // Render ClassSearch component
    render(<ClassSearch calendarRef={calendarRef} />);

    // Find the input element within the AutoComplete component
    const searchBar = screen.getByRole('combobox');

    // Simulate typing in the search bar
    fireEvent.change(searchBar, { target: { value: 'COMP_SCI 445-0 - Internet-scale Experimentation' } });
    expect(searchBar.value).toBe('COMP_SCI 445-0 - Internet-scale Experimentation')
    await sleep(1000)

    // Navigate to the first item in the autocomplete box
    fireEvent.keyDown(searchBar, { key: 'ArrowDown' });
    await sleep(1000);

    // Select the first item
    fireEvent.keyDown(searchBar, { key: 'Enter' });
    await sleep(1000);

    // Click button to add course from the dropdown results, since bottom row of button says 'Tu Th'
    const addButton = screen.getByText('Tu Th')
    fireEvent.click(addButton)

    // Verify that course is now on calendar, since event on calendar says '9:30 - 10:50' on top left corner
    expect(await screen.ByText('9:30 - 10:50')).toBeDefined();
  });
});