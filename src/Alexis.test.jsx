import { describe, expect, test } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CalendarPage from './pages/Calendar';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('CalendarPage', () => {

  test('adding custom calendar events manually', async () => {
    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>
    );

    // Wait for the page to render
    await sleep(500);

    // Press the Add Event button to bring up the modal
    fireEvent.click(screen.getAllByText('Add Event')[0]);

    // Wait for the modal to render
    await sleep(500);

    // Debugging: Print the current state of the DOM
    screen.debug();

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Meeting' } });
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2024-06-05' } });

    // Fill out the time fields (this assumes that the time fields are labeled 'Start time' and 'End time')
    const timeInputs = screen.getAllByPlaceholderText(/time/i);
    console.log("TIME INPUTS:", timeInputs);

    // For every timeInput couple, set the start and end time
    for (let i = 0; i < timeInputs.length; i += 2) {
      fireEvent.change(timeInputs[i], { target: { value: '10:00 AM' } }); // Start time
      fireEvent.change(timeInputs[i + 1], { target: { value: '11:00 AM' } }); // End time
    }

    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Discuss project status' } });

    // Find and click the first OK button
    const okButtons = screen.getAllByRole('button', { name: 'OK' });
    for (const okButton of okButtons) {
      fireEvent.click(okButton);
    }

    // Wait for the event to be added
    await sleep(500);

    // Debugging: Print the current state of the DOM
    screen.debug();

    // Check if the event is added
    await waitFor(() => {
      expect(screen.getByText('Meeting')).toBeDefined();
    });
  });

  test('adding an event without a title', async () => {
    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>
    );

    // Press the Add Event button to bring up the modal
    await sleep(500);
    fireEvent.click(screen.getAllByText('Add Event')[0]);

    await sleep(500);

    // Attempt to submit the form without filling out the title
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2024-06-01' } });
    fireEvent.change(screen.getByLabelText('Time'), { target: { value: '10:00 AM - 11:00 AM' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Discuss project status' } });

    // Find and click the first Recurring? checkbox
    const recurringCheckboxes = screen.getAllByLabelText('Recurring?');
    fireEvent.click(recurringCheckboxes[0]);

    // Find and click the first OK button
    const okButtons = screen.getAllByText('OK');
    fireEvent.click(okButtons[0]);

    // Check for validation error (assuming validation message appears)
    await sleep(500);
    expect(screen.getByText('Title of the event cannot be empty!')).toBeDefined();
  });
});
