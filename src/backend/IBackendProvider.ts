/**
 * Provider-agnostic backend interface.
 * No convex/* imports are allowed in this file.
 */

import type {
  Unsubscribe,
  User,
  Task,
  CreateTaskParams,
  UpdateTaskParams,
  Recording,
  CreateRecordingParams,
  UploadUrlResult,
} from './types';

export interface IBackendProvider {
  // ─── Auth ──────────────────────────────────────────────────────────────────

  /**
   * Sign in with the given provider / credentials.
   * Returns whatever the underlying auth system gives back.
   */
  signIn(provider: string, params: Record<string, unknown>): Promise<unknown>;

  /**
   * Sign out the current user.
   */
  signOut(): Promise<void>;

  /**
   * Subscribe to the currently authenticated user.
   * Calls `onData` immediately with the current value, then on every change.
   */
  subscribeCurrentUser(
    onData: (user: User | null) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe;

  // ─── Tasks ─────────────────────────────────────────────────────────────────

  /**
   * Subscribe to the current user's task list.
   */
  subscribeTasks(
    onData: (tasks: Task[]) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe;

  /**
   * Fetch tasks once (non-reactive).
   */
  getTasks(): Promise<Task[]>;

  /**
   * Fetch a single task by id.
   */
  getTask(id: string): Promise<Task | null>;

  /**
   * Create a new task.
   */
  createTask(params: CreateTaskParams): Promise<string>;

  /**
   * Update an existing task.
   */
  updateTask(params: UpdateTaskParams): Promise<void>;

  /**
   * Delete a task by id.
   */
  deleteTask(id: string): Promise<void>;

  /**
   * Mark a task as complete / incomplete.
   */
  toggleTask(id: string, completed: boolean): Promise<void>;

  // ─── Recordings ────────────────────────────────────────────────────────────

  /**
   * Subscribe to the current user's recordings list.
   */
  subscribeRecordings(
    onData: (recordings: Recording[]) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe;

  /**
   * Fetch recordings once (non-reactive).
   */
  getRecordings(): Promise<Recording[]>;

  /**
   * Create a recording record after the file has been uploaded.
   */
  createRecording(params: CreateRecordingParams): Promise<string>;

  /**
   * Delete a recording by id.
   */
  deleteRecording(id: string): Promise<void>;

  /**
   * Get a short-lived serving URL for a stored file.
   */
  getFileUrl(storageId: string): Promise<string | null>;

  // ─── Storage / Upload ──────────────────────────────────────────────────────

  /**
   * Request a pre-signed upload URL from the backend.
   */
  generateUploadUrl(): Promise<UploadUrlResult>;
}