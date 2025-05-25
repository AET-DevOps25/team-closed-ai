import { useState } from "react";
import { DragDropContext } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import { useBoard } from "@/context/BoardContext";
import Column from "@/components/Column";
import CreateTicketDialog from "@/components/CreateTicketDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { TicketState } from "@/types";
import ProjectSelector from "@/components/ProjectSelector.tsx";

const Board = () => {
  const { tickets, moveTicket } = useBoard();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleDragEnd = (result: { destination: any; draggableId?: any }) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newState = destination.droppableId as TicketState;
    moveTicket(draggableId, newState);
  };

  const openCreateDialog = () => setIsCreateDialogOpen(true);
  const closeCreateDialog = () => setIsCreateDialogOpen(false);

  const backlogTickets = tickets.filter((ticket) => ticket.state === "BACKLOG");
  const openTickets = tickets.filter((ticket) => ticket.state === "OPEN");
  const inProgressTickets = tickets.filter(
    (ticket) => ticket.state === "IN_PROGRESS",
  );
  const closedTickets = tickets.filter((ticket) => ticket.state === "CLOSED");

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <ProjectSelector />
        <Button onClick={openCreateDialog} className="flex items-center gap-2">
          <Plus size={18} />
          <span>New Ticket</span>
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100%-4rem)]">
          <Column title="Backlog" state="BACKLOG" tickets={backlogTickets} />
          <Column title="Open" state="OPEN" tickets={openTickets} />
          <Column
            title="In Progress"
            state="IN_PROGRESS"
            tickets={inProgressTickets}
          />
          <Column title="Closed" state="CLOSED" tickets={closedTickets} />
        </div>
      </DragDropContext>

      <CreateTicketDialog
        isOpen={isCreateDialogOpen}
        onClose={closeCreateDialog}
      />
    </div>
  );
};

export default Board;
