import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import NotFound from '@/pages/NotFound';

// Mock console.error to avoid noise in tests
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('NotFound', () => {
  beforeEach(() => {
    consoleErrorSpy.mockClear();
  });

  it('should render 404 error message', () => {
    render(
      <MemoryRouter initialEntries={['/non-existent-route']}>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Oops! Page not found')).toBeInTheDocument();
    expect(screen.getByText('Return to Home')).toBeInTheDocument();
  });

  it('should have correct link to home page', () => {
    render(
      <MemoryRouter initialEntries={['/non-existent-route']}>
        <NotFound />
      </MemoryRouter>
    );

    const homeLink = screen.getByText('Return to Home');
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should log error with current pathname', () => {
    const testPath = '/some/invalid/path';
    
    render(
      <MemoryRouter initialEntries={[testPath]}>
        <NotFound />
      </MemoryRouter>
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '404 Error: User attempted to access non-existent route:',
      testPath
    );
  });

  it('should have correct styling classes', () => {
    render(
      <MemoryRouter initialEntries={['/test']}>
        <NotFound />
      </MemoryRouter>
    );

    const container = screen.getByText('404').closest('div')?.parentElement;
    expect(container).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center', 'bg-gray-100');

    const contentContainer = screen.getByText('404').closest('div');
    expect(contentContainer).toHaveClass('text-center');

    const heading = screen.getByText('404');
    expect(heading).toHaveClass('text-4xl', 'font-bold', 'mb-4');

    const description = screen.getByText('Oops! Page not found');
    expect(description).toHaveClass('text-xl', 'text-gray-600', 'mb-4');

    const link = screen.getByText('Return to Home');
    expect(link).toHaveClass('text-blue-500', 'hover:text-blue-700', 'underline');
  });
});
