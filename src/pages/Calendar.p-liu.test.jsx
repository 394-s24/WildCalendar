import {describe, expect, test, vi, it} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CalendarPage from './Calendar'; // Adjust the path as needed
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const mockMatchMedia = () => {
  window.matchMedia = query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
};

beforeAll(() => {
  mockMatchMedia();
});

test('add a recurring event.', async () => {
  render(
    <Router>
      <CalendarPage />
    </Router>
  );

  // Adding a to-do item first
  await sleep(500);
  //const addButton = screen.getAllByText('Add Event')[0];
  const addButton = screen.getAllByRole('button', { name: 'Add Event' })[0]
  console.log(addButton)
  fireEvent.click(addButton);

  // await sleep(500);

  expect(screen.getAllByText('Create an Event')[0]).toBeDefined();
  const IsRecurringCheckbox = screen.getAllByRole('checkbox', { name: 'Recurring?' })[0]
  fireEvent.click(IsRecurringCheckbox)
  expect(IsRecurringCheckbox.checked).toEqual(true)
  // //expect(ipv6Radio).toBeChecked()
  const weekday_group = {
    'mon': screen.getAllByRole('checkbox', { name: 'Monday' })[0],
    //'tue': screen.getAllByRole('checkbox', { name: 'Tuesday' })[0],
    'wed': screen.getAllByRole('checkbox', { name: 'Wednesday' })[0],
    'thu': screen.getAllByRole('checkbox', { name: 'Thursday' })[0],
    //'fri': screen.getAllByRole('checkbox', { name: 'Friday' })[0],
    'sat': screen.getAllByRole('checkbox', { name: 'Saturday' })[0],
    //'sun': screen.getAllByRole('checkbox', { name: 'Sunday' })[0],
  };
  for (const [key, value] of Object.entries(weekday_group))
  {
    expect(value).toBeDefined();
    fireEvent.click(value)
    expect(value.checked).toEqual(true)
  }
});