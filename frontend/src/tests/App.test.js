// src/tests/App.test.js
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import this to use toBeInTheDocument
import App from '../App.js';

test('renders welcome message', () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome to Travel Guide/i);
  expect(linkElement).toBeInTheDocument();
});
