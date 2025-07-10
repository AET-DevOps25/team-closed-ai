import {
  useState,
  type ClassAttributes,
  type HTMLAttributes,
  type LegacyRef,
} from "react";
import { Draggable } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Task as TaskType } from "@/types";
import ViewTaskDialog from "@/components/board/ViewTaskDialog";
import type { JSX } from "react/jsx-runtime";

interface TaskCardProps {
  task: TaskType;
  index: number;
}

const getStateColor = (state: string) => {
  switch (state) {
    case "OPEN":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "IN_PROGRESS":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
    case "DONE":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

const TaskCard = ({ task, index }: TaskCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(
          provided: {
            innerRef: LegacyRef<HTMLDivElement> | undefined;
            draggableProps: JSX.IntrinsicAttributes &
              ClassAttributes<HTMLDivElement> &
              HTMLAttributes<HTMLDivElement>;
            dragHandleProps: JSX.IntrinsicAttributes &
              ClassAttributes<HTMLDivElement> &
              HTMLAttributes<HTMLDivElement>;
          },
          snapshot: { isDragging: any },
        ) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`p-4 mb-3 bg-white dark:bg-gray-900/90 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow ${
              snapshot.isDragging ? "shadow-lg" : ""
            }`}
            onClick={openDialog}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium leading-tight text-gray-900 dark:text-gray-100">
                {task.title}
              </h3>
              <Badge
                variant="secondary"
                className={`text-xs ${getStateColor(task.taskStatus)}`}
              >
                {task.taskStatus.replace("_", " ")}
              </Badge>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
              {task.description}
            </p>

            <div className="flex justify-between items-center pt-2 text-xs text-gray-500 dark:text-gray-400">
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
        )}
      </Draggable>

      <ViewTaskDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        taskId={task.id}
      />
    </>
  );
};

export default TaskCard;
