import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders CommendAI application', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  // Test that the app renders without crashing
  expect(document.body).toBeInTheDocument();
});
