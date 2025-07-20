import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BoardProvider, useBoard } from '@/context/BoardContext';
import { useTaskApi } from '@/hooks/use-task-api';
import { useProjectApi } from '@/hooks/use-project-api';
import { useUser } from '@/context/UserContext';
import { useProject } from '@/context/ProjectContext';
import type { TaskDto, AddTaskDto } from '@/api/server';
import type { Task, TaskStatus } from '@/types';

// Mock all the dependencies
vi.mock('@/hooks/use-task-api');
vi.mock('@/hooks/use-project-api');
vi.mock('@/context/UserContext');
vi.mock('@/context/ProjectContext');
vi.mock('@/components/board/ViewTaskDialog', () => ({
  default: ({ isOpen, taskId, onClose }: any) => 
    isOpen ? (
      <div data-testid="view-task-dialog" onClick={onClose}>
        Task Dialog for {taskId}
      </div>
    ) : null
}));

const mockTaskApi = {
  tasksByProject: { data: null as TaskDto[] | null, loading: false, error: null as string | null },
  tasks: { data: null as TaskDto[] | null, loading: false, error: null as string | null },
  getTasksByProject: vi.fn(),
  updateTask: vi.fn(),
  changeTaskStatus: vi.fn(),
};

const mockProjectApi = {
  addTasksToProject: vi.fn(),
};

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

const mockProject = {
  id: 1,
  name: 'Test Project',
  description: 'Test Description',
};

const mockTasksDto: TaskDto[] = [
  {
    id: 1,
    title: 'Task 1',
    description: 'Description 1',
    taskStatus: 'TODO' as TaskStatus,
    assigneeId: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    comments: [],
    attachments: [],
  },
  {
    id: 2,
    title: 'Task 2',
    description: 'Description 2',
    taskStatus: 'IN_PROGRESS' as TaskStatus,
    assigneeId: 2,
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02',
    comments: [],
    attachments: [],
  },
];

// Test component that uses the BoardContext
const TestComponent = () => {
  const board = useBoard();
  
  return (
    <div>
      <div data-testid="task-count">{board.tasks.length}</div>
      <div data-testid="loading">{board.loading.toString()}</div>
      <div data-testid="error">{board.error || 'null'}</div>
      <button 
        onClick={() => board.openTaskDetails(1)}
        data-testid="open-task-button"
      >
        Open Task
      </button>
      <button 
        onClick={() => board.addTasks([{ title: 'New Task', description: 'New Description', taskStatus: 'TODO' as TaskStatus }])}
        data-testid="add-task-button"
      >
        Add Task
      </button>
      <button 
        onClick={() => board.updateTask(1, { title: 'Updated Task' })}
        data-testid="update-task-button"
      >
        Update Task
      </button>
      <button 
        onClick={() => board.moveTask(1, 'IN_PROGRESS')}
        data-testid="move-task-button"
      >
        Move Task
      </button>
      <button 
        onClick={() => board.refetch()}
        data-testid="refetch-button"
      >
        Refetch
      </button>
    </div>
  );
};

describe('BoardContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    (useTaskApi as any).mockReturnValue(mockTaskApi);
    (useProjectApi as any).mockReturnValue(mockProjectApi);
    (useUser as any).mockReturnValue({ users: mockUsers });
    (useProject as any).mockReturnValue({ selectedProject: mockProject });
  });

  it('should provide default context values', () => {
    render(
      <BoardProvider>
        <TestComponent />
      </BoardProvider>
    );

    expect(screen.getByTestId('task-count')).toHaveTextContent('0');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('null');
  });

  it('should throw error when useBoard is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useBoard must be used within a BoardProvider');
    
    consoleSpy.mockRestore();
  });

  it('should fetch tasks when project is selected', async () => {
    render(
      <BoardProvider>
        <TestComponent />
      </BoardProvider>
    );

    await waitFor(() => {
      expect(mockTaskApi.getTasksByProject).toHaveBeenCalledWith(1);
    });
  });

  it('should update tasks when tasksByProject data changes', async () => {
    // Start with empty data
    mockTaskApi.tasksByProject.data = null;
    
    const { rerender } = render(
      <BoardProvider>
        <TestComponent />
      </BoardProvider>
    );

    expect(screen.getByTestId('task-count')).toHaveTextContent('0');

    // Update mock data
    mockTaskApi.tasksByProject.data = mockTasksDto;
    
    rerender(
      <BoardProvider>
        <TestComponent />
      </BoardProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('task-count')).toHaveTextContent('2');
    });
  });

  it('should handle loading state from API', async () => {
    mockTaskApi.tasksByProject.loading = true;
    
    render(
      <BoardProvider>
        <TestComponent />
      </BoardProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });

  it('should handle error state from API', async () => {
    mockTaskApi.tasksByProject.error = 'API Error';
    
    render(
      <BoardProvider>
        <TestComponent />
      </BoardProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('API Error');
    });
  });

  it('should add tasks successfully', async () => {
    const newTaskData: AddTaskDto[] = [
      { title: 'New Task', description: 'New Description', taskStatus: 'TODO' as TaskStatus }
    ];

    mockProjectApi.addTasksToProject.mockResolvedValue(undefined);
    mockTaskApi.getTasksByProject.mockResolvedValue(undefined);

    render(
      <BoardProvider>
        <TestComponent />
      </BoardProvider>
    );

    await act(async () => {
      screen.getByTestId('add-task-button').click();
    });

    await waitFor(() => {
      expect(mockProjectApi.addTasksToProject).toHaveBeenCalledWith(1, newTaskData);
      expect(mockTaskApi.getTasksByProject).toHaveBeenCalledWith(1);
    });
  });

  it('should handle add task error when no project selected', async () => {
    (useProject as any).mockReturnValue({ selectedProject: null });

    render(
      <BoardProvider>
        <TestComponent />
      </BoardProvider>
    );

    await act(async () => {
      screen.getByTestId('add-task-button').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('No project selected');
    });
  });

  it('should update task successfully', async () => {
    mockTaskApi.tasks.data = mockTasksDto;
    mockTaskApi.updateTask.mockResolvedValue(undefined);

    render(
      <BoardProvider>
        <TestComponent />
      </BoardProvider>
    );

    await act(async () => {
      screen.getByTestId('update-task-button').click();
    });

    await waitFor(() => {
      expect(mockTaskApi.updateTask).toHaveBeenCalledWith(1, {
        id: 1,
        title: 'Updated Task',
        description: 'Description 1',
        taskStatus: 'TODO',
        assigneeId: 1,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        comments: [],
        attachments: [],
      });
    });
  });

  it('should handle update task error when task not found', async () => {
    mockTaskApi.tasks.data = [];

    render(
      <BoardProvider>
        <TestComponent />
      </BoardProvider>
    );

    await act(async () => {
      screen.getByTestId('update-task-button').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Task not found');
    });
  });

  it('should move task successfully', async () => {
    mockTaskApi.tasksByProject.data = mockTasksDto;
    mockTaskApi.changeTaskStatus.mockResolvedValue({
      ...mockTasksDto[0],
      taskStatus: 'IN_PROGRESS'
    });

    render(
      <BoardProvider>
        <TestComponent />
      </BoardProvider>
    );

    await act(async () => {
      screen.getByTestId('move-task-button').click();
    });

    await waitFor(() => {
      expect(mockTaskApi.changeTaskStatus).toHaveBeenCalledWith(1, 'IN_PROGRESS');
    });
  });

  it('should revert task movement on error', async () => {
    mockTaskApi.tasksByProject.data = mockTasksDto;
    mockTaskApi.changeTaskStatus.mockRejectedValue(new Error('Move failed'));

    render(
      <BoardProvider>
        <TestComponent />
      </BoardProvider>
    );

    await act(async () => {
      screen.getByTestId('move-task-button').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Move failed');
    });
  });

  it('should refetch tasks when refetch is called', async () => {
    render(
      <BoardProvider>
        <TestComponent />
      </BoardProvider>
    );

    await act(async () => {
      screen.getByTestId('refetch-button').click();
    });

    await waitFor(() => {
      expect(mockTaskApi.getTasksByProject).toHaveBeenCalledWith(1);
    });
  });

  it('should open task details dialog', async () => {
    render(
      <BoardProvider>
        <TestComponent />
      </BoardProvider>
    );

    await act(async () => {
      screen.getByTestId('open-task-button').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('view-task-dialog')).toBeInTheDocument();
      expect(screen.getByTestId('view-task-dialog')).toHaveTextContent('Task Dialog for 1');
    });
  });

  it('should close task details dialog', async () => {
    render(
      <BoardProvider>
        <TestComponent />
      </BoardProvider>
    );

    // Open dialog
    await act(async () => {
      screen.getByTestId('open-task-button').click();
    });

    expect(screen.getByTestId('view-task-dialog')).toBeInTheDocument();

    // Close dialog
    await act(async () => {
      screen.getByTestId('view-task-dialog').click();
    });

    await waitFor(() => {
      expect(screen.queryByTestId('view-task-dialog')).not.toBeInTheDocument();
    });
  });

  it('should handle tasks without users', async () => {
    (useUser as any).mockReturnValue({ users: [] });
    mockTaskApi.tasksByProject.data = mockTasksDto;
    
    render(
      <BoardProvider>
        <TestComponent />
      </BoardProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('task-count')).toHaveTextContent('2');
    });
  });
});
