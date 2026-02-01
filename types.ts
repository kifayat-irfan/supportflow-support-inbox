
export enum Role {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT'
}

export enum TicketStatus {
  OPEN = 'Open',
  PENDING = 'Pending',
  ANSWERED = 'Answered',
  CLOSED = 'Closed'
}

export enum TicketPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent'
}

export interface User {
  id: number;
  email: string;
  role: Role;
  name: string;
}

export interface TicketMessage {
  id: number;
  ticketId: number;
  body: string;
  fromAgent: boolean;
  authorName: string;
  createdAt: string;
}

export interface InternalNote {
  id: number;
  ticketId: number;
  body: string;
  authorName: string;
  createdAt: string;
}

export interface Ticket {
  id: number;
  subject: string;
  requesterEmail: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedId?: number;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  notes: InternalNote[];
}

export interface KBArticle {
  id: number;
  title: string;
  body: string;
  tags: string[];
}

export interface OutboxMessage {
  id: number;
  toEmail: string;
  content: string;
  sentAt: string;
}

export interface AppNotification {
  id: number;
  userId: number;
  message: string;
  ticketId?: number;
  read: boolean;
  createdAt: string;
}
