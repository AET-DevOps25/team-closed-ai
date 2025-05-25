import { createContext, useContext, useState, type ReactNode } from "react";
import type { Ticket, User, Comment, Attachment, TicketState } from "@/types";

interface BoardContextType {
  tickets: Ticket[];
  users: User[];
  addTicket: (
    ticket: Omit<Ticket, "id" | "comments" | "attachments" | "createdAt">,
  ) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  moveTicket: (ticketId: string, newState: TicketState) => void;
  addComment: (ticketId: string, content: string, author: User) => void;
  addAttachment: (ticketId: string, attachment: Omit<Attachment, "id">) => void;
  getTicketById: (id: string) => Ticket | undefined;
}

const defaultUsers: User[] = [
  {
    id: "1",
    name: "Alex Johnson",
    avatar: "https://ui-avatars.com/api/?name=Alex+Johnson",
  },
  {
    id: "2",
    name: "Jamie Smith",
    avatar: "https://ui-avatars.com/api/?name=Jamie+Smith",
  },
  {
    id: "3",
    name: "Taylor Brown",
    avatar: "https://ui-avatars.com/api/?name=Taylor+Brown",
  },
];

const defaultTickets: Ticket[] = [
  {
    id: "0",
    title: "Setup project repository",
    description:
      "Initialize the project with proper folder structure and dependencies",
    state: "BACKLOG",
    assignee: undefined,
    comments: [],
    attachments: [],
    createdAt: new Date(Date.now() - 432000000),
  },
  {
    id: "1",
    title: "Implement drag and drop",
    description: "Add the ability to drag tickets between columns",
    state: "OPEN",
    assignee: defaultUsers[0],
    comments: [
      {
        id: "c1",
        content: "Let's use react-beautiful-dnd for this",
        author: defaultUsers[1],
        createdAt: new Date(Date.now() - 86400000),
      },
    ],
    attachments: [],
    createdAt: new Date(Date.now() - 172800000),
  },
  {
    id: "2",
    title: "Create ticket view modal",
    description: "Design and implement the ticket details view",
    state: "IN_PROGRESS",
    assignee: defaultUsers[1],
    comments: [],
    attachments: [],
    createdAt: new Date(Date.now() - 259200000),
  },
  {
    id: "3",
    title: "Design board layout",
    description: "Create the UI for the kanban board",
    state: "CLOSED",
    assignee: defaultUsers[2],
    comments: [
      {
        id: "c2",
        content: "I've completed the initial design",
        author: defaultUsers[2],
        createdAt: new Date(Date.now() - 43200000),
      },
    ],
    attachments: [],
    createdAt: new Date(Date.now() - 345600000),
  },
];

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider = ({ children }: { children: ReactNode }) => {
  const [tickets, setTickets] = useState<Ticket[]>(defaultTickets);
  const [users] = useState<User[]>(defaultUsers);

  const addTicket = (
    ticketData: Omit<Ticket, "id" | "comments" | "attachments" | "createdAt">,
  ) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: `ticket-${Date.now()}`,
      comments: [],
      attachments: [],
      createdAt: new Date(),
    };
    setTickets([...tickets, newTicket]);
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === id ? { ...ticket, ...updates } : ticket,
      ),
    );
  };

  const moveTicket = (ticketId: string, newState: TicketState) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, state: newState } : ticket,
      ),
    );
  };

  const addComment = (ticketId: string, content: string, author: User) => {
    setTickets(
      tickets.map((ticket) => {
        if (ticket.id === ticketId) {
          const newComment: Comment = {
            id: `comment-${Date.now()}`,
            content,
            author,
            createdAt: new Date(),
          };
          return {
            ...ticket,
            comments: [...ticket.comments, newComment],
          };
        }
        return ticket;
      }),
    );
  };

  const addAttachment = (
    ticketId: string,
    attachmentData: Omit<Attachment, "id">,
  ) => {
    setTickets(
      tickets.map((ticket) => {
        if (ticket.id === ticketId) {
          const newAttachment: Attachment = {
            id: `attachment-${Date.now()}`,
            ...attachmentData,
          };
          return {
            ...ticket,
            attachments: [...ticket.attachments, newAttachment],
          };
        }
        return ticket;
      }),
    );
  };

  const getTicketById = (id: string) => {
    return tickets.find((ticket) => ticket.id === id);
  };

  return (
    <BoardContext.Provider
      value={{
        tickets,
        users,
        addTicket,
        updateTicket,
        moveTicket,
        addComment,
        addAttachment,
        getTicketById,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return context;
};
