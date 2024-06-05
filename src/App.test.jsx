import {describe, expect, test} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import Todo from './pages/Todo';
import Login from './pages/Login';

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

  test('navigates to about page', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('About'));
    expect(screen.getAllByText('About')[0]).toBeDefined();
  });

  test('adds a todo', async () => {
    render(<Todo />);
    await sleep(1000);
    fireEvent.click(screen.getAllByText('Add')[0]);

    await sleep(1000);
    expect(screen.getAllByText('To-do Item')[0]).toBeDefined()
  });

  // Test login to see if no user passes
  test('logs in', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    await sleep(1000);
    expect(screen.getByText('Login to Your Account')).toBeDefined();
  });
});