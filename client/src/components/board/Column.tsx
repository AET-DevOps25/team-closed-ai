import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "@/components/board/TaskCard";
import type { Task as TaskType, TaskStatus } from "@/types";

interface ColumnProps {
  title: string;
  state: TaskStatus;
  tasks: TaskType[];
}

const stateColors = {
  BACKLOG: "bg-muted/50 border-border",
  OPEN: "bg-muted/50 border-border",
  IN_PROGRESS: "bg-muted/50 border-border",
  DONE: "bg-muted/50 border-border",
};

const Column = ({ title, state, tasks }: ColumnProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: state,
  });

  return (
    <div
      className={`flex flex-col border rounded-lg ${stateColors[state]} h-full`}
    >
      <div className="p-4 border-b bg-card rounded-t-lg border-border">
        <h2 className="font-semibold text-foreground">{title}</h2>
        <div className="mt-1 text-sm text-muted-foreground">
          {tasks.length} tasks
        </div>
      </div>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={`p-3 flex-1 overflow-y-auto min-h-[200px] ${
            isOver ? "bg-muted/80" : ""
          }`}
        >
          {tasks.map((task, index) => (
            <TaskCard key={task.id} task={task} index={index} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default Column;
