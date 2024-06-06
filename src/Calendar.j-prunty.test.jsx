import { describe, expect, test } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CalendarPage from './pages/Calendar';
import TodoPage from './pages/Todo';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('CalendarPage', () => {

  test('adding calendar event with invalid time format', async () => {
    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>
    );

    // Wait for the page to render
    await sleep(500);
    fireEvent.click(screen.getAllByText('Add Event')[0]);
    await sleep(500);

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Tester' } });
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2024-06-01' } });

    const timeInputs = screen.getAllByPlaceholderText(/time/i);
    const okButtons = screen.getAllByRole('button', { name: 'OK' });

    fireEvent.change(timeInputs[0], { target: { value: '10:00 AM' } }); // Start time
    fireEvent.change(timeInputs[1], { target: { value: 'INVALID' } });

    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Placeholder' } });

    fireEvent.click(okButtons[0]);
    await sleep(500);

    expect(screen.getByText("Must enter a valid time!")).toBeDefined();

  });

  test('adding a todo event with invalid date', async () => {
    render(
      <MemoryRouter>
        <TodoPage />
      </MemoryRouter>
    );

    // Press the Add Event button to bring up the modal
    await sleep(500);
    fireEvent.click(screen.getAllByText('Add')[0]);
    await sleep(500);
    fireEvent.click(screen.getAllByText('⋯')[0]);
    await sleep(500);
    fireEvent.click(screen.getAllByText('Edit')[0]);
    await sleep(500);

    const dateInput = screen.getByLabelText('Event Date');
    const timeInput = screen.getByLabelText('Event Time');
    fireEvent.change(dateInput, { target: { value: 'INVALID' } }); // Start time
    fireEvent.change(timeInput, { target: { value: '02:12 AM' } }); // Start time

    await sleep(500);
    fireEvent.click(screen.getAllByText('Save')[0]);
    await sleep(500);

    expect(screen.getByText("Invalid time format. Please use HH:MM format.")).toBeDefined();
  });
});