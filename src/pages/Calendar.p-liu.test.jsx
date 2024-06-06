import {describe, expect, test} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CalendarPage from './Calendar'; // Adjust the path as needed

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

test('add, edit, and delete a todo item', async () => {
  render(<CalendarPage />);

  // Adding a to-do item first
  await sleep(500);
  fireEvent.click(screen.getAllByText('Create an Event')[0]);

  await sleep(500);
  const IsRecurringRadio = getByRole('radio', { name: 'isRecurring' })
  //const ipv6Radio = getByRole('radio', { name: 'IPv6' })
  fireEvent.click(ipv6Radio)
  expect(IsRecurringRadio).toBeChecked() 
  //expect(ipv6Radio).toBeChecked()

});