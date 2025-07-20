import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ModeToggle } from '@/components/ModeToggle';

// Mock the theme context
vi.mock('@/context/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}));

describe('ModeToggle', () => {
  it('should render mode toggle component', () => {
    // Arrange & Act
    const { container } = render(<ModeToggle />);

    // Assert
    expect(container).toBeInTheDocument();
  });

  it('should contain a button element', () => {
    // Arrange & Act
    const { container } = render(<ModeToggle />);
    const button = container.querySelector('button');

    // Assert
    expect(button).toBeInTheDocument();
  });
});
