import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Task, TaskStatus } from "@/types";
import { useTaskApi } from "@/hooks/use-task-api";
import { useProjectApi } from "@/hooks/use-project-api";
import { useUser } from "./UserContext";
import { useProject } from "@/context/ProjectContext";
import type { AddTaskDto, TaskDto } from "@/api/server";
import { mapTaskDtoToTask } from "@/utils/type-mappers";

interface BoardContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTasks: (taskData: AddTaskDto[]) => Promise<void>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
  moveTask: (taskId: number, newState: TaskStatus) => Promise<void>;
  getTaskById: (id: number) => Task | undefined;
  refetch: () => Promise<void>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider = ({ children }: { children: ReactNode }) => {
  const taskApi = useTaskApi();
  const projectApi = useProjectApi();
  const { selectedProject } = useProject();
  const { users } = useUser();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (selectedProject) {
          await taskApi.getTasksByProject(selectedProject.id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedProject]);

  useEffect(() => {
    const tasksData = taskApi.tasksByProject.data || taskApi.tasks.data;

    if (tasksData) {
      if (users.length > 0) {
        // TODO: fix this
        const mappedTasks = tasksData.map((task) =>
          mapTaskDtoToTask(task, users),
        );
        setTasks(mappedTasks);
      } else {
        const tasksWithoutAssignees = tasksData.map((task) =>
          mapTaskDtoToTask(task, []),
        );
        setTasks(tasksWithoutAssignees);
      }
    }
  }, [taskApi.tasksByProject.data, taskApi.tasks.data, users]);

  useEffect(() => {
    const isLoading = taskApi.tasksByProject.loading || taskApi.tasks.loading;
    const hasError = taskApi.tasksByProject.error || taskApi.tasks.error;

    setLoading(isLoading);
    setError(hasError);
  }, [
    taskApi.tasksByProject.loading,
    taskApi.tasksByProject.error,
    taskApi.tasks.loading,
    taskApi.tasks.error,
  ]);

  const refetch = async () => {
    if (selectedProject) {
      await taskApi.getTasksByProject(selectedProject.id);
    }
  };

  const addTasks = async (taskData: AddTaskDto[]) => {
    try {
      if (!selectedProject) {
        throw new Error("No project selected");
      }

      await projectApi.addTasksToProject(selectedProject.id, taskData);
      await taskApi.getTasksByProject(selectedProject.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add task");
    }
  };

  const updateTask = async (id: number, updates: Partial<Task>) => {
    try {
      const existingTask = taskApi.tasks.data?.find((task) => task.id === id);

      if (!existingTask) {
        throw new Error("Task not found");
      }

      const updatedTask: TaskDto = {
        ...existingTask,
        title: updates.title ?? existingTask.title,
        description: updates.description ?? existingTask.description,
        taskStatus: updates.taskStatus
          ? updates.taskStatus
          : existingTask.taskStatus,
        assigneeId: updates.assignee
          ? updates.assignee.id
          : existingTask.assigneeId,
      };

      await taskApi.updateTask(id, updatedTask);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  const moveTask = async (taskId: number, newState: TaskStatus) => {
    const originalTasks = [...tasks];
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, taskStatus: newState } : task,
      ),
    );

    try {
      const result = await taskApi.changeTaskStatus(taskId, newState);

      if (result) {
        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === taskId ? mapTaskDtoToTask(result, users) : task,
          ),
        );
      }
    } catch (err) {
      setTasks(originalTasks);
      setError(err instanceof Error ? err.message : "Failed to move task");
    }
  };

  const getTaskById = (id: number) => {
    return tasks.find((task) => task.id === id);
  };

  return (
    <BoardContext.Provider
      value={{
        tasks,
        loading,
        error,
        addTasks,
        updateTask,
        moveTask,
        getTaskById,
        refetch,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return context;
};
