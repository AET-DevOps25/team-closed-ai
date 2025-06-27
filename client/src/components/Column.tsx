import { Droppable } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import Ticket from "@/components/Ticket";
import type { Ticket as TicketType, TicketState } from "@/types";
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
  state: TicketState;
  tickets: TicketType[];
}

const stateColors = {
  BACKLOG: "bg-gray-50 border-gray-200",
  OPEN: "bg-blue-50 border-blue-200",
  IN_PROGRESS: "bg-amber-50 border-amber-200",
  CLOSED: "bg-green-50 border-green-200",
};

const Column = ({ title, state, tickets }: ColumnProps) => {
  return (
    <div
      className={`flex flex-col border rounded-lg ${stateColors[state]} h-full`}
    >
      <div className="p-4 border-b bg-white/50 rounded-t-lg">
        <h2 className="font-semibold">{title}</h2>
        <div className="mt-1 text-sm text-gray-500">
          {tickets.length} tickets
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
              snapshot.isDraggingOver ? "bg-blue-50/50" : ""
            }`}
          >
            {tickets.map((ticket, index) => (
              <Ticket key={ticket.id} ticket={ticket} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
