import { describe, it, expect } from "vitest";
import {
  mapUserDtoToUser,
  mapProjectDtoToProject,
  mapTaskDtoToTask,
} from "@/utils/type-mappers";
import type { UserDto, ProjectDto, TaskDto } from "@/api/server";
import type { User } from "@/types";

describe("Type Mappers", () => {
  it("should map UserDto to User correctly", () => {
    // Arrange
    const userDto: UserDto = {
      id: 1,
      name: "John Doe",
      profilePicture: "avatar.jpg",
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    };

    // Act
    const result = mapUserDtoToUser(userDto);

    // Assert
    expect(result).toEqual(userDto);
  });

  it("should map ProjectDto to Project with task count", () => {
    // Arrange
    const projectDto: ProjectDto = {
      id: 1,
      name: "Test Project",
      color: "#FF0000",
      taskIds: [1, 2, 3],
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    };

    // Act
    const result = mapProjectDtoToProject(projectDto);

    // Assert
    expect(result).toEqual({
      ...projectDto,
      taskCount: 3,
    });
  });

  it("should map ProjectDto with empty taskIds to Project with zero count", () => {
    // Arrange
    const projectDto: ProjectDto = {
      id: 2,
      name: "Empty Project",
      color: "#00FF00",
      taskIds: [],
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    };

    // Act
    const result = mapProjectDtoToProject(projectDto);

    // Assert
    expect(result.taskCount).toBe(0);
  });

  it("should map ProjectDto without taskIds to Project with zero count", () => {
    // Arrange
    const projectDto: ProjectDto = {
      id: 3,
      name: "No Tasks Project",
      color: "#0000FF",
      taskIds: [],
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    };

    // Act
    const result = mapProjectDtoToProject(projectDto);

    // Assert
    expect(result.taskCount).toBe(0);
  });

  it("should map TaskDto to Task with assignee", () => {
    // Arrange
    const users: User[] = [
      { 
        id: 1, 
        name: "John Doe", 
        profilePicture: "john.jpg",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
      },
      { 
        id: 2, 
        name: "Jane Smith", 
        profilePicture: "jane.jpg",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
      },
    ];
    const taskDto: TaskDto = {
      id: 1,
      title: "Test Task",
      description: "Task description",
      taskStatus: "OPEN",
      assigneeId: 1,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
      comments: [],
      attachments: [],
    };

    // Act
    const result = mapTaskDtoToTask(taskDto, users);

    // Assert
    expect(result.assignee).toEqual(users[0]);
    expect(result.comments).toEqual([]);
    expect(result.attachments).toEqual([]);
  });

  it("should map TaskDto to Task without assignee when assigneeId is missing", () => {
    // Arrange
    const users: User[] = [
      { 
        id: 1, 
        name: "John Doe", 
        profilePicture: "john.jpg",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
      },
    ];
    const taskDto: TaskDto = {
      id: 2,
      title: "Unassigned Task",
      description: "No assignee",
      taskStatus: "BACKLOG",
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
      comments: [],
      attachments: [],
    };

    // Act
    const result = mapTaskDtoToTask(taskDto, users);

    // Assert
    expect(result.assignee).toBeUndefined();
  });

  it("should map TaskDto to Task without assignee when user not found", () => {
    // Arrange
    const users: User[] = [
      { 
        id: 1, 
        name: "John Doe", 
        profilePicture: "john.jpg",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
      },
    ];
    const taskDto: TaskDto = {
      id: 3,
      title: "Task with invalid assignee",
      description: "Assignee does not exist",
      taskStatus: "IN_PROGRESS",
      assigneeId: 999,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
      comments: [],
      attachments: [],
    };

    // Act
    const result = mapTaskDtoToTask(taskDto, users);

    // Assert
    expect(result.assignee).toBeUndefined();
  });
});
