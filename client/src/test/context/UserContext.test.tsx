import { render, screen, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { UserProvider, useUser } from '@/context/UserContext';
import type { UserDto, CreateUserDto } from '@/api/server';
import type { User } from '@/types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock console.error
const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

// Mock the useUserApi hook
const mockUserApi = {
  users: {
    data: null as User[] | null,
    loading: false,
    error: null as string | null,
  },
  user: {
    data: null as User | null,
    loading: false,
    error: null as string | null,
  },
  createdUser: {
    data: null as User | null,
    loading: false,
    error: null as string | null,
  },
  getAllUsers: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
  getUserById: vi.fn(),
  clearErrors: vi.fn(),
};

vi.mock('@/hooks/use-user-api', () => ({
  useUserApi: () => mockUserApi,
}));

// Test component to access context
const TestComponent = () => {
  const context = useUser();
  return (
    <div>
      <div data-testid="users-count">{context.users.length}</div>
      <div data-testid="default-user">
        {context.defaultUser ? context.defaultUser.name : 'None'}
      </div>
      <div data-testid="loading">{context.loading.toString()}</div>
      <div data-testid="error">{context.error || 'None'}</div>
      <button onClick={() => context.setDefaultUser({ id: 1, name: 'Test User', profilePicture: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' })}>
        Set Default User
      </button>
      <button onClick={() => context.setDefaultUser(null)}>
        Clear Default User
      </button>
      <button onClick={() => context.createUser({ name: 'New User', profilePicture: '' })}>
        Create User
      </button>
      <button onClick={() => context.updateUser(1, { name: 'Updated User' })}>
        Update User
      </button>
      <button onClick={() => context.deleteUser(1)}>
        Delete User
      </button>
      <button onClick={() => context.getUserById(1)}>
        Get User By ID
      </button>
      <button onClick={() => context.refetch()}>
        Refetch
      </button>
      <button onClick={() => context.clearErrors()}>
        Clear Errors
      </button>
    </div>
  );
};

describe('UserContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock state
    mockUserApi.users.data = null;
    mockUserApi.users.loading = false;
    mockUserApi.users.error = null;
    mockUserApi.user.data = null;
    mockUserApi.user.loading = false;
    mockUserApi.user.error = null;
    mockUserApi.createdUser.data = null;
    mockUserApi.createdUser.loading = false;
    mockUserApi.createdUser.error = null;
  });

  afterEach(() => {
    consoleErrorMock.mockClear();
  });

  it('should provide default context values', () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    expect(screen.getByTestId('users-count')).toHaveTextContent('0');
    expect(screen.getByTestId('default-user')).toHaveTextContent('None');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('None');
  });

  it('should load saved default user from localStorage on mount', () => {
    const savedUser = { id: 1, name: 'Saved User', profilePicture: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedUser));

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    expect(localStorageMock.getItem).toHaveBeenCalledWith('closedai_default_user');
    expect(screen.getByTestId('default-user')).toHaveTextContent('Saved User');
  });

  it('should handle corrupted localStorage data', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json');

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    expect(consoleErrorMock).toHaveBeenCalledWith(
      'Failed to parse saved default user:',
      expect.any(Error)
    );
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('closedai_default_user');
    expect(screen.getByTestId('default-user')).toHaveTextContent('None');
  });

  it('should fetch all users on mount', () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    expect(mockUserApi.getAllUsers).toHaveBeenCalled();
  });

  it('should update users state when API data changes', async () => {
    const testUsers = [
      { id: 1, name: 'User 1', profilePicture: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: 2, name: 'User 2', profilePicture: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ];

    const { rerender } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Simulate API data update
    act(() => {
      mockUserApi.users.data = testUsers;
    });

    rerender(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('users-count')).toHaveTextContent('2');
    });
  });

  it('should set first user as default when no default user exists', async () => {
    const testUsers = [
      { id: 1, name: 'First User', profilePicture: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: 2, name: 'Second User', profilePicture: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ];

    const { rerender } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    act(() => {
      mockUserApi.users.data = testUsers;
    });

    rerender(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('default-user')).toHaveTextContent('First User');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'closedai_default_user',
        JSON.stringify(testUsers[0])
      );
    });
  });

  it('should preserve existing default user if still in users list', async () => {
    const existingUser = { id: 2, name: 'Existing User', profilePicture: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' };
    const testUsers = [
      { id: 1, name: 'First User', profilePicture: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      existingUser,
    ];

    localStorageMock.getItem.mockReturnValue(JSON.stringify(existingUser));

    const { rerender } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    act(() => {
      mockUserApi.users.data = testUsers;
    });

    rerender(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('default-user')).toHaveTextContent('Existing User');
    });
  });

  it('should clear default user if not in users list anymore', async () => {
    const removedUser = { id: 3, name: 'Removed User', profilePicture: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' };
    const testUsers = [
      { id: 1, name: 'First User', profilePicture: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: 2, name: 'Second User', profilePicture: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ];

    localStorageMock.getItem.mockReturnValue(JSON.stringify(removedUser));

    const { rerender } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    act(() => {
      mockUserApi.users.data = testUsers;
    });

    rerender(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await waitFor(() => {
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('closedai_default_user');
    });
  });

  it('should set default user and save to localStorage', async () => {
    const testUser = { id: 1, name: 'Test User', profilePicture: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' };

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await act(async () => {
      screen.getByText('Set Default User').click();
    });

    expect(screen.getByTestId('default-user')).toHaveTextContent('Test User');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'closedai_default_user',
      JSON.stringify(testUser)
    );
  });

  it('should clear default user and remove from localStorage', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await act(async () => {
      screen.getByText('Clear Default User').click();
    });

    expect(screen.getByTestId('default-user')).toHaveTextContent('None');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('closedai_default_user');
  });

  it('should create user via API', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await act(async () => {
      screen.getByText('Create User').click();
    });

    expect(mockUserApi.createUser).toHaveBeenCalledWith({
      name: 'New User',
      profilePicture: '',
    });
  });

  it('should update user via API', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await act(async () => {
      screen.getByText('Update User').click();
    });

    expect(mockUserApi.updateUser).toHaveBeenCalledWith(1, {
      name: 'Updated User',
    });
  });

  it('should update default user when updating current default user', async () => {
    const defaultUser = { id: 1, name: 'Default User', profilePicture: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' };
    const updatedUser = { id: 1, name: 'Updated Default User', profilePicture: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' };

    localStorageMock.getItem.mockReturnValue(JSON.stringify(defaultUser));
    mockUserApi.getUserById.mockResolvedValue(updatedUser);
    mockUserApi.user.data = updatedUser;

    const { rerender } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await act(async () => {
      screen.getByText('Update User').click();
    });

    expect(mockUserApi.getUserById).toHaveBeenCalledWith(1);
  });

  it('should delete user via API', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await act(async () => {
      screen.getByText('Delete User').click();
    });

    expect(mockUserApi.deleteUser).toHaveBeenCalledWith(1);
  });

  it('should clear default user when deleting current default user', async () => {
    const defaultUser = { id: 1, name: 'Default User', profilePicture: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(defaultUser));

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await act(async () => {
      screen.getByText('Delete User').click();
    });

    expect(screen.getByTestId('default-user')).toHaveTextContent('None');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('closedai_default_user');
  });

  it('should get user by ID and return user data', async () => {
    const testUser = { id: 1, name: 'Test User', profilePicture: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' };
    mockUserApi.user.data = testUser;

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await act(async () => {
      screen.getByText('Get User By ID').click();
    });

    expect(mockUserApi.getUserById).toHaveBeenCalledWith(1);
  });

  it('should update default user when getting user by ID for current default user', async () => {
    const defaultUser = { id: 1, name: 'Default User', profilePicture: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' };
    const updatedUser = { id: 1, name: 'Updated User', profilePicture: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' };

    localStorageMock.getItem.mockReturnValue(JSON.stringify(defaultUser));
    mockUserApi.user.data = updatedUser;

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await act(async () => {
      screen.getByText('Get User By ID').click();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'closedai_default_user',
      JSON.stringify(updatedUser)
    );
  });

  it('should refetch users', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await act(async () => {
      screen.getByText('Refetch').click();
    });

    expect(mockUserApi.getAllUsers).toHaveBeenCalledTimes(2); // Once on mount, once on refetch
  });

  it('should clear errors', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await act(async () => {
      screen.getByText('Clear Errors').click();
    });

    expect(mockUserApi.clearErrors).toHaveBeenCalled();
  });

  it('should display loading state', () => {
    mockUserApi.users.loading = true;

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });

  it('should display error state', () => {
    mockUserApi.users.error = 'Test error';

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    expect(screen.getByTestId('error')).toHaveTextContent('Test error');
  });

  it('should throw error when used outside provider', () => {
    const TestComponentOutsideProvider = () => {
      useUser();
      return <div>Test</div>;
    };

    expect(() => {
      render(<TestComponentOutsideProvider />);
    }).toThrow('useUser must be used within a UserProvider');
  });
});
