import { useState } from "react";
import { DragDropContext } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import { useBoard } from "@/context/BoardContext";
import Column from "@/components/board/Column";
import CreateTaskDialog from "@/components/board/CreateTaskDialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, Plus, AlertCircle } from "lucide-react";
import type { Project, TaskStatus } from "@/types";
import { SidebarTrigger } from "../ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface BoardProps {
  selectedProject: Project | null;
}

const Board = ({ selectedProject }: BoardProps) => {
  const isMobile = useIsMobile();
  const { tasks, moveTask, loading, error, refetch } = useBoard();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleDragEnd = async (result: {
    destination: any;
    draggableId?: any;
  }) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newState = destination.droppableId as TaskStatus;
    await moveTask(draggableId, newState);
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
              <h1 className="text-2xl font-bold truncate">
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
          <div className="flex items-center gap-2">
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

      <DragDropContext onDragEnd={handleDragEnd}>
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
      </DragDropContext>

      <CreateTaskDialog
        isOpen={isCreateDialogOpen}
        onClose={closeCreateDialog}
      />
    </div>
  );
};

export default Board;
