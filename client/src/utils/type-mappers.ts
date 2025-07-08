import type { UserDto, TaskDto, ProjectDto } from "@/api/server";
import type { User, Task, Project } from "@/types";

export const mapUserDtoToUser = (userDto: UserDto): User => userDto;

export const mapProjectDtoToProject = (projectDto: ProjectDto): Project => {
  return {
    ...projectDto,
    taskCount: projectDto.taskIds?.length || 0,
  };
};

export const mapTaskDtoToTask = (taskDto: TaskDto, users: User[]): Task => {
  let assignee: User | undefined = undefined;
  if (taskDto.assigneeId) {
    assignee = users.find((user) => user.id === taskDto.assigneeId);
  }

  return {
    ...taskDto,
    assignee,
    comments: [],
    attachments: [],
  };
};
