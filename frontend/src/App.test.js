import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders CommendAI homepage', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const titleElement = screen.getByText(/YouTube Yorum Üretici/i);
  expect(titleElement).toBeInTheDocument();
});
