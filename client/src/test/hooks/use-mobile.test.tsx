import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIsMobile } from '@/hooks/use-mobile';

describe('useIsMobile', () => {
  let mockAddEventListener: ReturnType<typeof vi.fn>;
  let mockRemoveEventListener: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockAddEventListener = vi.fn();
    mockRemoveEventListener = vi.fn();

    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return false for desktop screen width', () => {
    // Arrange
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    // Act
    const { result } = renderHook(() => useIsMobile());

    // Assert
    expect(result.current).toBe(false);
  });

  it('should return true for mobile screen width', () => {
    // Arrange
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 320,
    });

    // Act
    const { result } = renderHook(() => useIsMobile());

    // Assert
    expect(result.current).toBe(true);
  });

  it('should return false for tablet screen width', () => {
    // Arrange
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });

    // Act
    const { result } = renderHook(() => useIsMobile());

    // Assert
    expect(result.current).toBe(false);
  });
});
