import {describe, expect, test} from 'vitest';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import App from './App';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('calendar tests', () => {

  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('WildCalendar')).toBeDefined();
  });

  test('navigates to todo page', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Todo'));
    expect(screen.getByText('Todo List')).toBeDefined();
  });

  test('navigates to calendar page', () => {
    render(<App />);
    const calendarLinks = screen.getAllByText('Calendar');
    fireEvent.click(calendarLinks[0]);
    expect(screen.getAllByText('Calendar')[0]).toBeDefined();
  });

  test('adds events to the todo list', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('Todo'));
    expect(screen.getByText('My Todo List')).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText('COMP_SCI 394-0 - Agile Software Development')).toBeDefined();
    })

    expect(screen.getByText('To-do Item')).toBeDefined();
  });

});
