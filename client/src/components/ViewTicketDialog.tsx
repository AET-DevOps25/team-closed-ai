import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useBoard } from "@/context/BoardContext";
import CommentSection from "@/components/CommentSection";
import { Paperclip, Calendar } from "lucide-react";

interface ViewTicketDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
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

const ViewTicketDialog = ({
  isOpen,
  onClose,
  ticketId,
}: ViewTicketDialogProps) => {
  const { getTicketById } = useBoard();
  const ticket = getTicketById(ticketId);

  if (!ticket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <DialogTitle className="text-xl">{ticket.title}</DialogTitle>
            <Badge className={`text-sm w-fit ${getStateColor(ticket.state)}`}>
              {ticket.state.replace("_", " ")}
            </Badge>
          </div>
        </DialogHeader>

        <div className="mt-2 space-y-6">
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            {ticket.assignee && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Assignee:</span>
                <div className="flex items-center gap-1.5">
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
                  <span>{ticket.assignee.name}</span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Created:</span>
              <div className="flex items-center gap-1.5">
                <Calendar size={16} />
                <span>{format(new Date(ticket.createdAt), "MMM d, yyyy")}</span>
              </div>
            </div>
            {ticket.attachments.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Attachments:</span>
                <div className="flex items-center gap-1.5">
                  <Paperclip size={16} />
                  <span>{ticket.attachments.length}</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Description</h3>
            <div className="p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
              {ticket.description || (
                <span className="text-gray-400 italic">
                  No description provided
                </span>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <CommentSection ticketId={ticket.id} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTicketDialog;
