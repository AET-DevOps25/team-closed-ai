import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTaskApi } from "@/hooks/use-task-api";

// Mock useApi hook
const mockHandleApiCall = vi.fn();
const mockHandleVoidApiCall = vi.fn();
vi.mock("@/hooks/use-api", () => ({
  useApi: () => ({
    handleApiCall: mockHandleApiCall,
    handleVoidApiCall: mockHandleVoidApiCall,
  }),
}));

// Mock the Task API
vi.mock("@/api/server", () => ({
  TaskApi: vi.fn().mockImplementation(() => ({
    getAllTasks: vi.fn(),
    getTaskById: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    changeTaskStatus: vi.fn(),
    getTasksByAssignee: vi.fn(),
    getTasksByProject: vi.fn(),
  })),
  Configuration: vi.fn(),
}));

describe("useTaskApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useTaskApi());

    expect(result.current.tasks).toEqual({
      data: null,
      loading: false,
      error: null,
    });
    expect(result.current.task).toEqual({
      data: null,
      loading: false,
      error: null,
    });
    expect(result.current.tasksByAssignee).toEqual({
      data: null,
      loading: false,
      error: null,
    });
    expect(result.current.tasksByProject).toEqual({
      data: null,
      loading: false,
      error: null,
    });
  });

  it("should call getAllTasks API", async () => {
    const { result } = renderHook(() => useTaskApi());

    await act(async () => {
      await result.current.getAllTasks();
    });

    expect(mockHandleApiCall).toHaveBeenCalled();
  });

  it("should call getTaskById API", async () => {
    const { result } = renderHook(() => useTaskApi());

    await act(async () => {
      await result.current.getTaskById(1);
    });

    expect(mockHandleApiCall).toHaveBeenCalled();
  });

  it("should call updateTask API", async () => {
    const { result } = renderHook(() => useTaskApi());
    const taskData = {
      id: 1,
      title: "Updated Task",
      description: "Updated Description",
      taskStatus: "IN_PROGRESS" as const,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
      comments: ["comment1"],
      attachments: ["file1.pdf"],
      assigneeId: 1,
    };

    await act(async () => {
      await result.current.updateTask(1, taskData);
    });

    expect(mockHandleApiCall).toHaveBeenCalled();
  });

  it("should call changeTaskStatus API", async () => {
    const { result } = renderHook(() => useTaskApi());

    await act(async () => {
      await result.current.changeTaskStatus(1, "DONE" as any);
    });

    expect(mockHandleApiCall).toHaveBeenCalled();
  });

  it("should call getTasksByAssignee API", async () => {
    const { result } = renderHook(() => useTaskApi());

    await act(async () => {
      await result.current.getTasksByAssignee(1);
    });

    expect(mockHandleApiCall).toHaveBeenCalled();
  });

  it("should call getTasksByProject API", async () => {
    const { result } = renderHook(() => useTaskApi());

    await act(async () => {
      await result.current.getTasksByProject(1);
    });

    expect(mockHandleApiCall).toHaveBeenCalled();
  });

  it("should call deleteTask API", async () => {
    const { result } = renderHook(() => useTaskApi());

    await act(async () => {
      await result.current.deleteTask(1);
    });

    expect(mockHandleVoidApiCall).toHaveBeenCalled();
  });

  it("should clear errors", () => {
    const { result } = renderHook(() => useTaskApi());

    act(() => {
      result.current.clearErrors();
    });

    expect(typeof result.current.clearErrors).toBe("function");
  });

  it("should reset state", () => {
    const { result } = renderHook(() => useTaskApi());

    act(() => {
      result.current.resetState();
    });

    expect(result.current.tasks).toEqual({
      data: null,
      loading: false,
      error: null,
    });
    expect(result.current.task).toEqual({
      data: null,
      loading: false,
      error: null,
    });
  });

  it("should have all required methods", () => {
    const { result } = renderHook(() => useTaskApi());

    expect(typeof result.current.getAllTasks).toBe("function");
    expect(typeof result.current.getTaskById).toBe("function");
    expect(typeof result.current.updateTask).toBe("function");
    expect(typeof result.current.deleteTask).toBe("function");
    expect(typeof result.current.changeTaskStatus).toBe("function");
    expect(typeof result.current.getTasksByAssignee).toBe("function");
    expect(typeof result.current.getTasksByProject).toBe("function");
    expect(typeof result.current.clearErrors).toBe("function");
    expect(typeof result.current.resetState).toBe("function");
  });
});
