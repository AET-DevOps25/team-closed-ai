import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CreateAllButton } from '@/components/chat/CreateAllButton';

describe('CreateAllButton', () => {
  it('should render with default text', () => {
    const mockOnCreateAll = vi.fn();
    render(<CreateAllButton onCreateAll={mockOnCreateAll} />);
    
    expect(screen.getByText('Create All')).toBeInTheDocument();
  });

  it('should call onCreateAll when clicked', async () => {
    const mockOnCreateAll = vi.fn().mockResolvedValue(undefined);
    render(<CreateAllButton onCreateAll={mockOnCreateAll} />);
    
    await act(async () => {
      fireEvent.click(screen.getByText('Create All'));
    });
    
    expect(mockOnCreateAll).toHaveBeenCalledOnce();
  });

  it('should show creating state during async operation', async () => {
    const mockOnCreateAll = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<CreateAllButton onCreateAll={mockOnCreateAll} />);
    
    await act(async () => {
      fireEvent.click(screen.getByText('Create All'));
    });
    
    expect(screen.getByText('Creating...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
    
    await waitFor(() => {
      expect(screen.getByText('Created')).toBeInTheDocument();
    });
  });

  it('should show completed state after successful creation', async () => {
    const mockOnCreateAll = vi.fn().mockResolvedValue(undefined);
    render(<CreateAllButton onCreateAll={mockOnCreateAll} />);
    
    await act(async () => {
      fireEvent.click(screen.getByText('Create All'));
    });
    
    await waitFor(() => {
      expect(screen.getByText('Created')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  it('should handle error and allow retry', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockOnCreateAll = vi.fn().mockRejectedValue(new Error('Create failed'));
    render(<CreateAllButton onCreateAll={mockOnCreateAll} />);
    
    await act(async () => {
      fireEvent.click(screen.getByText('Create All'));
    });
    
    await waitFor(() => {
      expect(screen.getByText('Create All')).toBeInTheDocument();
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
    
    expect(consoleErrorSpy).toHaveBeenCalledWith('Create All failed:', expect.any(Error));
    consoleErrorSpy.mockRestore();
  });

  it('should not trigger multiple calls when clicked rapidly', async () => {
    const mockOnCreateAll = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<CreateAllButton onCreateAll={mockOnCreateAll} />);
    
    const button = screen.getByText('Create All');
    
    // First click
    fireEvent.click(button);
    
    // Immediately try second click while first is processing
    fireEvent.click(button); 
    
    // Wait for the button to show "Creating..."
    await waitFor(() => {
      expect(screen.getByText('Creating...')).toBeInTheDocument();
    });
    
    // After processing completes, should only have been called once
    await waitFor(() => {
      expect(screen.getByText('Created')).toBeInTheDocument();
    });
    
    expect(mockOnCreateAll).toHaveBeenCalledOnce();
  });

  it('should not allow clicks when completed', async () => {
    const mockOnCreateAll = vi.fn().mockResolvedValue(undefined);
    render(<CreateAllButton onCreateAll={mockOnCreateAll} />);
    
    // First click
    await act(async () => {
      fireEvent.click(screen.getByText('Create All'));
    });
    
    await waitFor(() => {
      expect(screen.getByText('Created')).toBeInTheDocument();
    });
    
    // Try to click again
    await act(async () => {
      fireEvent.click(screen.getByText('Created'));
    });
    
    expect(mockOnCreateAll).toHaveBeenCalledOnce(); // Should still be only one call
  });
});
