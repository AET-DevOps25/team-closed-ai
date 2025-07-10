import { useState, useCallback } from "react";
import {
  ProjectApi,
  type ProjectDto,
  type CreateProjectDto,
  type AddTaskDto,
  type TaskDto,
} from "../api/api";
import { Configuration } from "../api/configuration";
import { type ApiState, createInitialApiState } from "../types/api";
import { useApi } from "./use-api";

const projectApi = new ProjectApi(
  new Configuration({ basePath: import.meta.env.VITE_API_URL }),
);

interface ProjectApiHook {
  projects: ApiState<ProjectDto[]>;
  project: ApiState<ProjectDto>;
  createdProject: ApiState<ProjectDto>;
  createdTask: ApiState<TaskDto>;

  getAllProjects: () => Promise<void>;
  getProjectById: (id: number) => Promise<void>;
  createProject: (data: CreateProjectDto) => Promise<void>;
  updateProject: (id: number, data: ProjectDto) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  addTaskToProject: (projectId: number, data: AddTaskDto) => Promise<void>;

  clearErrors: () => void;
  resetState: () => void;
}

export const useProjectApi = (): ProjectApiHook => {
  const { handleApiCall, handleVoidApiCall } = useApi();

  const [projects, setProjects] = useState<ApiState<ProjectDto[]>>(
    createInitialApiState,
  );
  const [project, setProject] = useState<ApiState<ProjectDto>>(
    createInitialApiState,
  );
  const [createdProject, setCreatedProject] = useState<ApiState<ProjectDto>>(
    createInitialApiState,
  );
  const [createdTask, setCreatedTask] = useState<ApiState<TaskDto>>(
    createInitialApiState,
  );

  const getAllProjects = useCallback(async () => {
    await handleApiCall(() => projectApi.getAllProjects(), setProjects);
  }, [handleApiCall]);

  const getProjectById = useCallback(
    async (id: number) => {
      await handleApiCall(() => projectApi.getProjectById(id), setProject);
    },
    [handleApiCall],
  );

  const createProject = useCallback(
    async (data: CreateProjectDto) => {
      const result = await handleApiCall(
        () => projectApi.createProject(data),
        setCreatedProject,
      );
      if (result) {
        await getAllProjects();
      }
    },
    [handleApiCall, getAllProjects],
  );

  const updateProject = useCallback(
    async (id: number, data: ProjectDto) => {
      const result = await handleApiCall(
        () => projectApi.updateProject(id, data),
        setProject,
      );
      if (result) {
        await getAllProjects();
      }
    },
    [handleApiCall, getAllProjects],
  );

  const deleteProject = useCallback(
    async (id: number) => {
      const success = await handleVoidApiCall(
        () => projectApi.deleteProject(id),
        setProject,
      );
      if (success) {
        await getAllProjects();
      }
    },
    [handleVoidApiCall, getAllProjects],
  );

  const addTaskToProject = useCallback(
    async (projectId: number, data: AddTaskDto) => {
      await handleApiCall(
        () => projectApi.addTaskToProject(projectId, data),
        setCreatedTask,
      );
    },
    [handleApiCall],
  );

  const clearErrors = useCallback(() => {
    setProjects((prev) => ({ ...prev, error: null }));
    setProject((prev) => ({ ...prev, error: null }));
    setCreatedProject((prev) => ({ ...prev, error: null }));
    setCreatedTask((prev) => ({ ...prev, error: null }));
  }, []);

  const resetState = useCallback(() => {
    setProjects(createInitialApiState());
    setProject(createInitialApiState());
    setCreatedProject(createInitialApiState());
    setCreatedTask(createInitialApiState());
  }, []);

  return {
    projects,
    project,
    createdProject,
    createdTask,
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    addTaskToProject,
    clearErrors,
    resetState,
  };
};
