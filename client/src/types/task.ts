import type { TaskDto, TaskStatus } from "@/api/server";
import type { Attachment } from "./attachment";
import type { User } from "./user";
import type { Comment } from "./comment";

export interface Task
  extends Omit<TaskDto, "assigneeId" | "comments" | "attachments"> {
  assignee?: User;
  comments: Comment[];
  attachments: Attachment[];
}
