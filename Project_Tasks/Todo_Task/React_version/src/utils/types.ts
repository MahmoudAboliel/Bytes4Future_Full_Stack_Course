export type Status = "backlog" | "in_progress" | "done" | "archived";
export type Action = Status | "delete";
export type Priority = "urgent" | "high" | "medium" | "low";
export type Role = "woner" | "member" | "guest";
export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
  createdAt: string | Date;
  updatedAt: string | null | Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeIds: User[];
  creatorId: User;
  tags: string[];
  status: Status;
  priority: Priority;
  dueDate: string;
  completedAt: string | null | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}
export interface TaskDTO {
  id: string;
  title: string;
  description: string;
  assigneeIds: string[];
  creatorId: string;
  tags: string[];
  status: Status;
  priority: Priority;
  dueDate: string;
  completedAt: string | null | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
}

export interface ErrorResponse {
  status: number;
  message: string;
}