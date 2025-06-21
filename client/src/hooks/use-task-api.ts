import React, { useState, useCallback } from "react";
import { ProjectApi, TaskApi, type TaskDto, TaskStatus } from "../api/api";
import { type ApiState, createInitialApiState } from "../types/api";
import { Configuration } from "@/api/configuration";

const taskApi = new TaskApi(
  new Configuration({ basePath: import.meta.env.VITE_API_URL }),
);
const projectApi = new ProjectApi(
  new Configuration({ basePath: import.meta.env.VITE_API_URL }),
);

interface TaskApiHook {
  tasks: ApiState<TaskDto[]>;
  task: ApiState<TaskDto>;
  tasksByAssignee: ApiState<TaskDto[]>;
  tasksByProject: ApiState<TaskDto[]>;

  getAllTasks: () => Promise<void>;
  getTaskById: (id: number) => Promise<void>;
  updateTask: (id: number, data: TaskDto) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  changeTaskStatus: (id: number, status: TaskStatus) => Promise<TaskDto | null>;
  getTasksByAssignee: (assigneeId: number) => Promise<void>;
  getTasksByProject: (projectId: number) => Promise<void>;

  clearErrors: () => void;
  resetState: () => void;
}

export const useTaskApi = (): TaskApiHook => {
  const [tasks, setTasks] = useState<ApiState<TaskDto[]>>(
    createInitialApiState,
  );
  const [task, setTask] = useState<ApiState<TaskDto>>(createInitialApiState);
  const [tasksByAssignee, setTasksByAssignee] = useState<ApiState<TaskDto[]>>(
    createInitialApiState,
  );
  const [tasksByProject, setTasksByProject] = useState<ApiState<TaskDto[]>>(
    createInitialApiState,
  );

  const handleApiCall = async <T>(
    apiCall: () => Promise<{ data: T }>,
    setState: React.Dispatch<React.SetStateAction<ApiState<T>>>,
  ): Promise<T | null> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiCall();
      const data = response.data;
      setState({ data, loading: false, error: null });
      return data;
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred";
      setState((prev) => ({ ...prev, loading: false, error }));
      return null;
    }
  };

  const handleVoidApiCall = async (
    apiCall: () => Promise<{ data: void }>,
    setState: React.Dispatch<React.SetStateAction<ApiState<any>>>,
  ): Promise<boolean> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await apiCall();
      setState((prev) => ({ ...prev, loading: false, error: null }));
      return true;
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred";
      setState((prev) => ({ ...prev, loading: false, error }));
      return false;
    }
  };

  const getAllTasks = useCallback(async () => {
    await handleApiCall(() => taskApi.getAllTasks(), setTasks);
  }, []);

  const getTaskById = useCallback(async (id: number) => {
    await handleApiCall(() => taskApi.getTaskById(id), setTask);
  }, []);

  const updateTask = useCallback(
    async (id: number, data: TaskDto) => {
      const result = await handleApiCall(
        () => taskApi.updateTask(id, data),
        setTask,
      );
      if (result) {
        await getAllTasks();
      }
    },
    [getAllTasks],
  );

  const deleteTask = useCallback(
    async (id: number) => {
      const success = await handleVoidApiCall(
        () => taskApi.deleteTask(id),
        setTask,
      );
      if (success) {
        await getAllTasks();
      }
    },
    [getAllTasks],
  );

  const changeTaskStatus = useCallback(
    async (id: number, status: TaskStatus) => {
      const result = await handleApiCall(
        () => taskApi.changeTaskStatus(id, status),
        setTask,
      );
      return result; // Return result instead of auto-refetching
    },
    [],
  );

  const getTasksByAssignee = useCallback(async (assigneeId: number) => {
    await handleApiCall(
      () => taskApi.getTasksByAssignee(assigneeId),
      setTasksByAssignee,
    );
  }, []);

  const getTasksByProject = useCallback(async (projectId: number) => {
    await handleApiCall(
      () => taskApi.getTasksByProject(projectId),
      setTasksByProject,
    );
  }, []);

  const clearErrors = useCallback(() => {
    setTasks((prev) => ({ ...prev, error: null }));
    setTask((prev) => ({ ...prev, error: null }));
    setTasksByAssignee((prev) => ({ ...prev, error: null }));
    setTasksByProject((prev) => ({ ...prev, error: null }));
  }, []);

  const resetState = useCallback(() => {
    setTasks(createInitialApiState());
    setTask(createInitialApiState());
    setTasksByAssignee(createInitialApiState());
    setTasksByProject(createInitialApiState());
  }, []);

  return {
    tasks,
    task,
    tasksByAssignee,
    tasksByProject,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    changeTaskStatus,
    getTasksByAssignee,
    getTasksByProject,
    clearErrors,
    resetState,
  };
};
