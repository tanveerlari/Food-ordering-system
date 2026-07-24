import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the food ordering app', () => {
  render(<App />);
  expect(screen.getByText(/choose your meal/i)).toBeInTheDocument();
});
