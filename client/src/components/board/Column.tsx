import { Droppable } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import TaskCard from "@/components/board/TaskCard";
import type { Task as TaskType, TaskStatus } from "@/types";
import type {
  LegacyRef,
  ClassAttributes,
  HTMLAttributes,
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
} from "react";
import type { JSX } from "react/jsx-runtime";

interface ColumnProps {
  title: string;
  state: TaskStatus;
  tasks: TaskType[];
}

const stateColors = {
  BACKLOG:
    "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-700",
  OPEN: "bg-blue-50 border-blue-200 dark:bg-gray-900/20 dark:border-blue-700",
  IN_PROGRESS:
    "bg-amber-50 border-amber-200 dark:bg-gray-900/20 dark:border-amber-700",
  DONE: "bg-green-50 border-green-200 dark:bg-gray-900/20 dark:border-green-700",
};

const Column = ({ title, state, tasks }: ColumnProps) => {
  return (
    <div
      className={`flex flex-col border rounded-lg ${stateColors[state]} h-full`}
    >
      <div className="p-4 border-b bg-white/80 dark:bg-gray-800/80 rounded-t-lg border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {tasks.length} tasks
        </div>
      </div>

      <Droppable droppableId={state}>
        {(
          provided: {
            innerRef: LegacyRef<HTMLDivElement> | undefined;
            droppableProps: JSX.IntrinsicAttributes &
              ClassAttributes<HTMLDivElement> &
              HTMLAttributes<HTMLDivElement>;
            placeholder:
              | string
              | number
              | boolean
              | ReactElement<any, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | null
              | undefined;
          },
          snapshot: { isDraggingOver: any },
        ) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-3 flex-1 overflow-y-auto min-h-[200px] ${
              snapshot.isDraggingOver ? "bg-blue-50/50 dark:bg-blue-900/30" : ""
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
