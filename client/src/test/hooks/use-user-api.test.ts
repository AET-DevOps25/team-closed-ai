import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useUserApi } from "@/hooks/use-user-api";
import type { UserDto, CreateUserDto } from "@/api/server";

// Mock useApi hook
const mockHandleApiCall = vi.fn();
const mockHandleVoidApiCall = vi.fn();
vi.mock("@/hooks/use-api", () => ({
  useApi: () => ({
    handleApiCall: mockHandleApiCall,
    handleVoidApiCall: mockHandleVoidApiCall,
  }),
}));

// Mock the User API
vi.mock("@/api/server", () => ({
  UserApi: vi.fn().mockImplementation(() => ({
    getAllUsers: vi.fn(),
    getUserById: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  })),
  Configuration: vi.fn(),
}));

describe("useUserApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with correct initial state", () => {
    const { result } = renderHook(() => useUserApi());

    expect(result.current.users).toEqual({
      data: null,
      loading: false,
      error: null,
    });
    expect(result.current.user).toEqual({
      data: null,
      loading: false,
      error: null,
    });
    expect(result.current.createdUser).toEqual({
      data: null,
      loading: false,
      error: null,
    });
  });

  it("should call getAllUsers", async () => {
    const mockUsers: UserDto[] = [
      {
        id: 1,
        name: "Test User",
        profilePicture: "test-avatar.jpg",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ];

    mockHandleApiCall.mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useUserApi());

    await act(async () => {
      await result.current.getAllUsers();
    });

    expect(mockHandleApiCall).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
    );
  });

  it("should call getUserById", async () => {
    const mockUser: UserDto = {
      id: 1,
      name: "Test User",
      profilePicture: "test-avatar.jpg",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };

    mockHandleApiCall.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useUserApi());

    await act(async () => {
      await result.current.getUserById(1);
    });

    expect(mockHandleApiCall).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
    );
  });

  it("should call createUser and refresh users list", async () => {
    const mockCreateUserDto: CreateUserDto = {
      name: "New User",
      profilePicture: "new-avatar.jpg",
    };

    const mockCreatedUser: UserDto = {
      id: 2,
      name: "New User",
      profilePicture: "new-avatar.jpg",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };

    mockHandleApiCall.mockResolvedValue(mockCreatedUser);

    const { result } = renderHook(() => useUserApi());

    await act(async () => {
      await result.current.createUser(mockCreateUserDto);
    });

    expect(mockHandleApiCall).toHaveBeenCalledTimes(2); // createUser + getAllUsers
  });

  it("should call updateUser and refresh users list", async () => {
    const mockUserDto: UserDto = {
      id: 1,
      name: "Updated User",
      profilePicture: "updated-avatar.jpg",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };

    mockHandleApiCall.mockResolvedValue(mockUserDto);

    const { result } = renderHook(() => useUserApi());

    await act(async () => {
      await result.current.updateUser(1, mockUserDto);
    });

    expect(mockHandleApiCall).toHaveBeenCalledTimes(2); // updateUser + getAllUsers
  });

  it("should call deleteUser and refresh users list", async () => {
    mockHandleVoidApiCall.mockResolvedValue(true);

    const { result } = renderHook(() => useUserApi());

    await act(async () => {
      await result.current.deleteUser(1);
    });

    expect(mockHandleVoidApiCall).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
    );
    expect(mockHandleApiCall).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
    ); // getAllUsers called after successful delete
  });

  it("should clear errors", () => {
    const { result } = renderHook(() => useUserApi());

    act(() => {
      result.current.clearErrors();
    });

    // The clearErrors method should be called without errors
    expect(typeof result.current.clearErrors).toBe("function");
  });

  it("should reset state", () => {
    const { result } = renderHook(() => useUserApi());

    act(() => {
      result.current.resetState();
    });

    expect(result.current.users).toEqual({
      data: null,
      loading: false,
      error: null,
    });
    expect(result.current.user).toEqual({
      data: null,
      loading: false,
      error: null,
    });
    expect(result.current.createdUser).toEqual({
      data: null,
      loading: false,
      error: null,
    });
  });

  it("should have all required methods", () => {
    const { result } = renderHook(() => useUserApi());

    expect(typeof result.current.getAllUsers).toBe("function");
    expect(typeof result.current.getUserById).toBe("function");
    expect(typeof result.current.createUser).toBe("function");
    expect(typeof result.current.updateUser).toBe("function");
    expect(typeof result.current.deleteUser).toBe("function");
    expect(typeof result.current.clearErrors).toBe("function");
    expect(typeof result.current.resetState).toBe("function");
  });
});
