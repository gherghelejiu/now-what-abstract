/**
 * Shared domain types / DTOs.
 * No provider-specific imports allowed in this file.
 */

export type Unsubscribe = () => void;

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface SignInParams {
  provider: string;
  [key: string]: unknown;
}

export interface SignOutParams {
  [key: string]: unknown;
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  _creationTime: number;
  name?: string;
  email?: string;
  image?: string;
  [key: string]: unknown;
}

// ─── Task / Item (generic "now-what" domain) ─────────────────────────────────

export interface Task {
  _id: string;
  _creationTime: number;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: number;
  dueDate?: number;
  priority?: number;
  tags?: string[];
  [key: string]: unknown;
}

export interface CreateTaskParams {
  title: string;
  description?: string;
  dueDate?: number;
  priority?: number;
  tags?: string[];
}

export interface UpdateTaskParams {
  id: string;
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: number;
  priority?: number;
  tags?: string[];
}

// ─── Recording / Voice Note ───────────────────────────────────────────────────

export interface Recording {
  _id: string;
  _creationTime: number;
  userId: string;
  title?: string;
  storageId: string;
  url?: string;
  durationMs?: number;
  transcript?: string;
  [key: string]: unknown;
}

export interface CreateRecordingParams {
  storageId: string;
  title?: string;
  durationMs?: number;
}

// ─── Upload ──────────────────────────────────────────────────────────────────

export interface UploadUrlResult {
  uploadUrl: string;
  storageId?: string;
}