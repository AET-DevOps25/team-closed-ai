import {
  useState,
  type ClassAttributes,
  type HTMLAttributes,
  type LegacyRef,
} from "react";
import { Draggable } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Paperclip } from "lucide-react";
import { format } from "date-fns";
import type { Ticket as TicketType } from "@/types";
import ViewTicketDialog from "@/components/ViewTicketDialog";
import type { JSX } from "react/jsx-runtime";

interface TicketProps {
  ticket: TicketType;
  index: number;
}

const getStateColor = (state: string) => {
  switch (state) {
    case "OPEN":
      return "bg-blue-100 text-blue-800";
    case "IN_PROGRESS":
      return "bg-amber-100 text-amber-800";
    case "CLOSED":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const Ticket = ({ ticket, index }: TicketProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <>
      <Draggable draggableId={ticket.id} index={index}>
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
            className={`p-4 mb-3 bg-white rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow ${
              snapshot.isDragging ? "shadow-lg" : ""
            }`}
            onClick={openDialog}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium leading-tight">{ticket.title}</h3>
              <Badge
                variant="secondary"
                className={`text-xs ${getStateColor(ticket.state)}`}
              >
                {ticket.state.replace("_", " ")}
              </Badge>
            </div>

            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
              {ticket.description}
            </p>

            <div className="flex justify-between items-center pt-2 text-xs text-gray-500">
              <div className="flex items-center">
                <div className="mr-3 flex items-center">
                  <MessageSquare size={14} className="mr-1" />
                  {ticket.comments.length}
                </div>
                <div className="flex items-center">
                  <Paperclip size={14} className="mr-1" />
                  {ticket.attachments.length}
                </div>
              </div>

              <div className="flex items-center">
                <span className="mr-2">
                  {format(new Date(ticket.createdAt), "MMM d")}
                </span>
                {ticket.assignee && (
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={ticket.assignee.avatar}
                      alt={ticket.assignee.name}
                    />
                    <AvatarFallback>
                      {ticket.assignee.name
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

      <ViewTicketDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        ticketId={ticket.id}
      />
    </>
  );
};

export default Ticket;
