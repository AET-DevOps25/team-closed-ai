import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Task as TaskType } from "@/types";
import ViewTaskDialog from "@/components/board/ViewTaskDialog";

interface TaskCardProps {
  task: TaskType;
  index: number;
  isDragOverlay?: boolean;
}

const getStateColor = (state: string) => {
  switch (state) {
    case "OPEN":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "IN_PROGRESS":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
    case "DONE":
    case "CLOSED":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

const TaskCard = ({ task }: TaskCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`p-4 mb-3 bg-card rounded-lg shadow-sm border border-border cursor-pointer hover:shadow-md transition-shadow touch-none select-none ${
          isDragging ? "opacity-0" : ""
        }`}
        onClick={openDialog}
      >
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-medium leading-tight text-foreground flex-1 min-w-0 line-clamp-3">
            {task.title}
          </h3>
          <Badge
            variant="secondary"
            className={`text-xs flex-shrink-0 ${getStateColor(task.taskStatus)}`}
          >
            {task.taskStatus.replace("_", " ")}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {task.description}
        </p>

        <div className="flex justify-between items-center pt-2 text-xs text-muted-foreground">
          <div className="flex items-center">
            <span className="mr-2">
              {new Date(task.createdAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
            {task.assignee && (
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src={task.assignee.profilePicture}
                  alt={task.assignee.name}
                />
                <AvatarFallback>
                  {task.assignee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </div>

      <ViewTaskDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        taskId={task.id}
      />
    </>
  );
};

export default TaskCard;
