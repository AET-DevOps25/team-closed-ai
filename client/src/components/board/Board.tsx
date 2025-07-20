import { useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useBoard } from "@/context/BoardContext";
import Column from "@/components/board/Column";
import CreateTaskDialog from "@/components/board/CreateTaskDialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, Plus, AlertCircle } from "lucide-react";
import { type TaskStatus, type Project } from "@/types";
import { SidebarTrigger } from "../ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import TaskCard from "@/components/board/TaskCard";

interface BoardProps {
  selectedProject: Project | null;
}

const Board = ({ selectedProject }: BoardProps) => {
  const isMobile = useIsMobile();
  const { tasks, moveTask, loading, error, refetch, getTaskById } = useBoard();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = parseInt(active.id as string);
    const newStatus = over.id as TaskStatus;

    const validStatuses: TaskStatus[] = [
      "BACKLOG",
      "OPEN",
      "IN_PROGRESS",
      "DONE",
    ];
    if (!validStatuses.includes(over.id as TaskStatus)) {
      setActiveId(null);
      return;
    }

    await moveTask(taskId, newStatus);
    setActiveId(null);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const openCreateDialog = () => setIsCreateDialogOpen(true);
  const closeCreateDialog = () => setIsCreateDialogOpen(false);

  const backlogTasks = tasks.filter((task) => task.taskStatus === "BACKLOG");
  const openTasks = tasks.filter((task) => task.taskStatus === "OPEN");
  const inProgressTasks = tasks.filter(
    (task) => task.taskStatus === "IN_PROGRESS",
  );
  const doneTasks = tasks.filter((task) => task.taskStatus === "DONE");

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          {isMobile && <SidebarTrigger />}
          {selectedProject ? (
            <>
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedProject.color || "#9ca3af" }}
              />
              <h1 className="text-2xl font-bold truncate text-foreground">
                {selectedProject.name}
              </h1>
            </>
          ) : (
            <h1 className="text-2xl font-bold text-muted-foreground">
              Select a Project
            </h1>
          )}
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Loading board data...</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw
              size={18}
              className={isRefreshing ? "animate-spin" : ""}
            />
            <span>Refresh</span>
          </Button>
          <Button
            onClick={openCreateDialog}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            <span>New Task</span>
          </Button>
        </div>
      </div>

      {error && (
        <Alert className="mb-4" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100%-4rem)]">
          <Column title="Backlog" state="BACKLOG" tasks={backlogTasks} />
          <Column title="Open" state="OPEN" tasks={openTasks} />
          <Column
            title="In Progress"
            state="IN_PROGRESS"
            tasks={inProgressTasks}
          />
          <Column title="Done" state="DONE" tasks={doneTasks} />
        </div>

        <DragOverlay>
          {activeId ? (
            <TaskCard
              task={getTaskById(parseInt(activeId))!}
              index={0}
              isDragOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <CreateTaskDialog
        isOpen={isCreateDialogOpen}
        onClose={closeCreateDialog}
      />
    </div>
  );
};

export default Board;
