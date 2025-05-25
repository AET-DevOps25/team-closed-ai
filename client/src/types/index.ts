export type TicketState = "BACKLOG" | "OPEN" | "IN_PROGRESS" | "CLOSED";

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  state: TicketState;
  assignee?: User;
  comments: Comment[];
  attachments: Attachment[];
  createdAt: Date;
}
