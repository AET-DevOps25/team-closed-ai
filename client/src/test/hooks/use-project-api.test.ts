import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useProjectApi } from "@/hooks/use-project-api";

// Mock useApi hook
const mockHandleApiCall = vi.fn();
const mockHandleVoidApiCall = vi.fn();
vi.mock("@/hooks/use-api", () => ({
  useApi: () => ({
    handleApiCall: mockHandleApiCall,
    handleVoidApiCall: mockHandleVoidApiCall,
  }),
}));

// Mock the Project API
vi.mock("@/api/server", () => ({
  ProjectApi: vi.fn().mockImplementation(() => ({
    getAllProjects: vi.fn(),
    getProjectById: vi.fn(),
    createProject: vi.fn(),
    updateProject: vi.fn(),
    deleteProject: vi.fn(),
    addTasksToProject: vi.fn(),
  })),
  Configuration: vi.fn(),
}));

describe("useProjectApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useProjectApi());

    expect(result.current.projects).toEqual({
      data: null,
      loading: false,
      error: null,
    });
    expect(result.current.project).toEqual({
      data: null,
      loading: false,
      error: null,
    });
    expect(result.current.createdProject).toEqual({
      data: null,
      loading: false,
      error: null,
    });
    expect(result.current.createdTasks).toEqual({
      data: null,
      loading: false,
      error: null,
    });
  });

  it("should call getAllProjects API", async () => {
    const { result } = renderHook(() => useProjectApi());

    await act(async () => {
      await result.current.getAllProjects();
    });

    expect(mockHandleApiCall).toHaveBeenCalled();
  });

  it("should call getProjectById API", async () => {
    const { result } = renderHook(() => useProjectApi());

    await act(async () => {
      await result.current.getProjectById(1);
    });

    expect(mockHandleApiCall).toHaveBeenCalled();
  });

  it("should call createProject API", async () => {
    const { result } = renderHook(() => useProjectApi());
    const projectData = { name: "Test Project", color: "#ff0000" };

    await act(async () => {
      await result.current.createProject(projectData);
    });

    expect(mockHandleApiCall).toHaveBeenCalled();
  });

  it("should call updateProject API", async () => {
    const { result } = renderHook(() => useProjectApi());
    const projectData = {
      id: 1,
      name: "Updated Project",
      color: "#ff0000",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
      taskIds: [1, 2, 3],
    };

    await act(async () => {
      await result.current.updateProject(1, projectData);
    });

    expect(mockHandleApiCall).toHaveBeenCalled();
  });

  it("should call deleteProject API", async () => {
    const { result } = renderHook(() => useProjectApi());

    await act(async () => {
      await result.current.deleteProject(1);
    });

    expect(mockHandleVoidApiCall).toHaveBeenCalled();
  });

  it("should call addTasksToProject API", async () => {
    const { result } = renderHook(() => useProjectApi());
    const tasks = [{ title: "Test Task", description: "Test Description" }];

    await act(async () => {
      await result.current.addTasksToProject(1, tasks);
    });

    expect(mockHandleApiCall).toHaveBeenCalled();
  });

  it("should clear errors", () => {
    const { result } = renderHook(() => useProjectApi());

    act(() => {
      result.current.clearErrors();
    });

    expect(typeof result.current.clearErrors).toBe("function");
  });

  it("should reset state", () => {
    const { result } = renderHook(() => useProjectApi());

    act(() => {
      result.current.resetState();
    });

    expect(result.current.projects).toEqual({
      data: null,
      loading: false,
      error: null,
    });
    expect(result.current.project).toEqual({
      data: null,
      loading: false,
      error: null,
    });
  });

  it("should have all required methods", () => {
    const { result } = renderHook(() => useProjectApi());

    expect(typeof result.current.getAllProjects).toBe("function");
    expect(typeof result.current.getProjectById).toBe("function");
    expect(typeof result.current.createProject).toBe("function");
    expect(typeof result.current.updateProject).toBe("function");
    expect(typeof result.current.deleteProject).toBe("function");
    expect(typeof result.current.addTasksToProject).toBe("function");
    expect(typeof result.current.clearErrors).toBe("function");
    expect(typeof result.current.resetState).toBe("function");
  });
});
