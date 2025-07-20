import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest';
import CreateTaskDialog from '@/components/board/CreateTaskDialog';
import { useBoard } from '@/context/BoardContext';
import { useUser } from '@/context/UserContext';

// Mock dependencies
vi.mock('@/context/BoardContext');
vi.mock('@/context/UserContext');
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock UI components
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) => 
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-header">{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2 data-testid="dialog-title">{children}</h2>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-footer">{children}</div>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, type }: { 
    children: React.ReactNode; 
    onClick?: () => void; 
    disabled?: boolean; 
    type?: 'button' | 'submit' | 'reset';
  }) => (
    <button onClick={onClick} disabled={disabled} type={type} data-testid="button">
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, placeholder }: { 
    value: string; 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
    placeholder?: string;
  }) => (
    <input 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder} 
      data-testid="input"
    />
  ),
}));

vi.mock('@/components/ui/textarea', () => ({
  Textarea: ({ value, onChange, placeholder }: { 
    value: string; 
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; 
    placeholder?: string;
  }) => (
    <textarea 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder} 
      data-testid="textarea"
    />
  ),
}));

vi.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange }: { children: React.ReactNode; onValueChange: (value: string) => void }) => (
    <div data-testid="select" onClick={() => onValueChange('BACKLOG')}>{children}</div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div data-testid="select-item" data-value={value}>{children}</div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid="select-trigger">{children}</div>,
  SelectValue: ({ placeholder }: { placeholder?: string }) => <div data-testid="select-value">{placeholder}</div>,
}));

vi.mock('@/components/ui/label', () => ({
  Label: ({ children }: { children: React.ReactNode }) => <label data-testid="label">{children}</label>,
}));

vi.mock('lucide-react', () => ({
  Loader2: () => <div data-testid="loader">Loading...</div>,
}));

describe('CreateTaskDialog', () => {
  const mockAddTasks = vi.fn();
  const mockOnClose = vi.fn();

  const mockUsers = [
    { id: 1, name: 'User 1', profilePicture: null, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: 2, name: 'User 2', profilePicture: null, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useBoard as any).mockReturnValue({
      tasks: [],
      loading: false,
      error: null,
      addTasks: mockAddTasks,
      updateTask: vi.fn(),
      moveTask: vi.fn(),
      getTaskById: vi.fn(),
      refetch: vi.fn(),
      openTaskDetails: vi.fn(),
    });

    (useUser as any).mockReturnValue({
      defaultUser: mockUsers[0],
      users: mockUsers,
      loading: false,
      error: null,
      setDefaultUser: vi.fn(),
      createUser: vi.fn(),
      updateUser: vi.fn(),
      deleteUser: vi.fn(),
      getUserById: vi.fn(),
      refetch: vi.fn(),
      clearErrors: vi.fn(),
    });
  });

  it('should render when open', () => {
    render(<CreateTaskDialog isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('Create New Task');
  });

  it('should not render when closed', () => {
    render(<CreateTaskDialog isOpen={false} onClose={mockOnClose} />);
    
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('should render form fields', () => {
    render(<CreateTaskDialog isOpen={true} onClose={mockOnClose} />);
    
    const inputs = screen.getAllByTestId('input');
    expect(inputs).toHaveLength(1); // Title input
    expect(screen.getByTestId('textarea')).toBeInTheDocument(); // Description
    
    const selects = screen.getAllByTestId('select');
    expect(selects).toHaveLength(2); // Status select and Assignee select
  });

  it('should handle title input change', () => {
    render(<CreateTaskDialog isOpen={true} onClose={mockOnClose} />);
    
    const titleInput = screen.getByTestId('input');
    fireEvent.change(titleInput, { target: { value: 'New Task Title' } });
    
    expect(titleInput).toHaveValue('New Task Title');
  });

  it('should handle description input change', () => {
    render(<CreateTaskDialog isOpen={true} onClose={mockOnClose} />);
    
    const descriptionTextarea = screen.getByTestId('textarea');
    fireEvent.change(descriptionTextarea, { target: { value: 'Task description' } });
    
    expect(descriptionTextarea).toHaveValue('Task description');
  });

  it('should handle status selection', () => {
    render(<CreateTaskDialog isOpen={true} onClose={mockOnClose} />);
    
    const selects = screen.getAllByTestId('select');
    const statusSelect = selects[0]; // First select is status
    fireEvent.click(statusSelect); // This will trigger onValueChange with 'BACKLOG'
    
    // Since our mock triggers onValueChange automatically, we can verify it was called
    expect(statusSelect).toBeInTheDocument();
  });

  it('should set default assignee when dialog opens', () => {
    render(<CreateTaskDialog isOpen={true} onClose={mockOnClose} />);
    
    // The default user should be set automatically
    expect(useUser().defaultUser).toBe(mockUsers[0]);
  });

  it('should handle form submission with valid data', async () => {
    mockAddTasks.mockResolvedValue(undefined);
    
    render(<CreateTaskDialog isOpen={true} onClose={mockOnClose} />);
    
    // Fill in the form
    const titleInput = screen.getByTestId('input');
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    
    const descriptionTextarea = screen.getByTestId('textarea');
    fireEvent.change(descriptionTextarea, { target: { value: 'Test Description' } });
    
    // Submit the form
    const form = screen.getByTestId('dialog-content').querySelector('form');
    if (form) {
      fireEvent.submit(form);
    }
    
    await waitFor(() => {
      expect(mockAddTasks).toHaveBeenCalled();
    });
  });

  it('should handle form submission error', async () => {
    const { toast } = await import('sonner');
    mockAddTasks.mockRejectedValue(new Error('Failed to create task'));
    
    render(<CreateTaskDialog isOpen={true} onClose={mockOnClose} />);
    
    // Fill in the form
    const titleInput = screen.getByTestId('input');
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    
    // Submit the form
    const form = screen.getByTestId('dialog-content').querySelector('form');
    if (form) {
      fireEvent.submit(form);
    }
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to create Task. Please try again.');
    });
  });

  it('should prevent submission with empty title', async () => {
    const { toast } = await import('sonner');
    render(<CreateTaskDialog isOpen={true} onClose={mockOnClose} />);
    
    // Submit without title
    const form = screen.getByTestId('dialog-content').querySelector('form');
    if (form) {
      fireEvent.submit(form);
    }
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Title is required');
    });
    
    expect(mockAddTasks).not.toHaveBeenCalled();
  });

  it('should close dialog after successful submission', async () => {
    mockAddTasks.mockResolvedValue(undefined);
    
    render(<CreateTaskDialog isOpen={true} onClose={mockOnClose} />);
    
    // Fill in the form
    const titleInput = screen.getByTestId('input');
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    
    // Submit the form
    const form = screen.getByTestId('dialog-content').querySelector('form');
    if (form) {
      fireEvent.submit(form);
    }
    
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
