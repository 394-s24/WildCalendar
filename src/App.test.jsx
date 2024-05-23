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

  test('navigates to about page', () => {
    render(<App />);
    fireEvent.click(screen.getByText('About'));
    expect(screen.getAllByText('About')[0]).toBeDefined();
  });

});
