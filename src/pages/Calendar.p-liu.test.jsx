import {describe, expect, test, vi, it} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CalendarPage from './Calendar'; // Adjust the path as needed

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let namestr = 'r234329879874525415';

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
    <MemoryRouter>
      <CalendarPage />
    </MemoryRouter>
  );

  // Adding a to-do item first
  await sleep(500);
  //const addButton = screen.getAllByText('Add Event')[0];
  const addButton = screen.getAllByRole('button', { name: 'Add Event' })[0]
  fireEvent.click(addButton);

  await sleep(500);

  screen.debug();

  expect(screen.getAllByText('Create an Event')[0]).toBeDefined();

  const IsRecurringCheckbox = screen.getByLabelText('isRecurring')
  fireEvent.click(IsRecurringCheckbox)
  console.log(IsRecurringCheckbox.checked)
  
  expect(IsRecurringCheckbox.checked).toEqual(true)

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
  fireEvent.change(screen.getByLabelText('Title'), { target: { value: namestr } });
  fireEvent.change(screen.getByLabelText('Start-Date'), { target: { value: '2024-04-25' } });
  fireEvent.change(screen.getByLabelText('End-Date'), { target: { value: '2024-05-22' } });
  fireEvent.change(screen.getByLabelText('Description'), { target: { value: namestr } });

  const timePickerInput = screen.getAllByPlaceholderText(/time/i);
  console.log("Time Picker Input:", timePickerInput);

  fireEvent.change(timePickerInput[0], { target: { value: '05:00 AM' } });
  fireEvent.change(timePickerInput[1], { target: { value: '13:00 AM' } });


  const addModalOKButtons = screen.getAllByRole('button', { name: 'OK' });
  for (const addModalOKButton of addModalOKButtons) {
    fireEvent.click(addModalOKButton);
  }

  expect(screen.getAllByText(namestr)[0]).toBeDefined();
});