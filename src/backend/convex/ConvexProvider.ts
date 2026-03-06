/**
 * Convex implementation of IBackendProvider.
 *
 * All Convex SDK calls are confined to this file.
 * Swap this file (and index.ts) to switch providers.
 */

import { ConvexReactClient } from 'convex/react'; // TODO: remove if switching backend provider
import { ConvexClient } from 'convex/browser';    // TODO: remove if switching backend provider
import { api } from '../../convex/_generated/api'; // TODO: remove if switching backend provider

import type { IBackendProvider } from '../IBackendProvider';
import type {
  Unsubscribe,
  User,
  Task,
  CreateTaskParams,
  UpdateTaskParams,
  Recording,
  CreateRecordingParams,
  UploadUrlResult,
} from '../types';

const CONVEX_URL = 'https://brave-roadrunner-570.convex.cloud';

/**
 * Thin, stateful wrapper around the Convex React/Browser clients.
 *
 * • `ConvexReactClient` is used for React-hook-style subscriptions
 *   (we drive it manually via `onUpdate`).
 * • `ConvexClient` is used for one-shot queries / mutations / actions
 *   when we need a plain Promise.
 */
export class ConvexProvider implements IBackendProvider {
  // TODO: remove if switching backend provider
  private readonly reactClient: ConvexReactClient;
  // TODO: remove if switching backend provider
  private readonly client: ConvexClient;

  constructor() {
    this.reactClient = new ConvexReactClient(CONVEX_URL);
    this.client = new ConvexClient(CONVEX_URL);
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  /**
   * Generic subscription helper using ConvexClient.onUpdate.
   * Returns an unsubscribe function.
   */
  private subscribe<T>(
    query: unknown,
    args: Record<string, unknown>,
    onData: (data: T) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    // TODO: remove if switching backend provider
    const unsubscribe = (this.client as any).onUpdate(
      query,
      args,
      (value: T) => {
        onData(value);
      },
    );

    // ConvexClient.onUpdate doesn't expose per-subscription error callbacks;
    // errors surface on the client-level event. We attach a one-time listener
    // so callers can handle them.
    if (onError) {
      const handler = (event: { errorMessage: string }) => {
        onError(new Error(event.errorMessage));
      };
      (this.client as any).on?.('error', handler);
    }

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }

  // ─── Auth ──────────────────────────────────────────────────────────────────

  async signIn(provider: string, params: Record<string, unknown>): Promise<unknown> {
    // TODO: remove if switching backend provider
    // @convex-dev/auth exposes signIn through the React client's auth helpers.
    // We call it via action so the provider remains non-React.
    return this.client.action(
      (api as any).auth.signIn,
      { provider, params },
    );
  }

  async signOut(): Promise<void> {
    // TODO: remove if switching backend provider
    await this.client.action((api as any).auth.signOut, {});
  }

  subscribeCurrentUser(
    onData: (user: User | null) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    // TODO: remove if switching backend provider
    return this.subscribe<User | null>(
      (api as any).users.getCurrentUser,
      {},
      onData,
      onError,
    );
  }

  // ─── Tasks ─────────────────────────────────────────────────────────────────

  subscribeTasks(
    onData: (tasks: Task[]) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    // TODO: remove if switching backend provider
    return this.subscribe<Task[]>(
      (api as any).tasks.list,
      {},
      (data) => onData(data ?? []),
      onError,
    );
  }

  async getTasks(): Promise<Task[]> {
    // TODO: remove if switching backend provider
    const result = await this.client.query((api as any).tasks.list, {});
    return result ?? [];
  }

  async getTask(id: string): Promise<Task | null> {
    // TODO: remove if switching backend provider
    return this.client.query((api as any).tasks.get, { id });
  }

  async createTask(params: CreateTaskParams): Promise<string> {
    // TODO: remove if switching backend provider
    return this.client.mutation((api as any).tasks.create, params);
  }

  async updateTask(params: UpdateTaskParams): Promise<void> {
    // TODO: remove if switching backend provider
    const { id, ...fields } = params;
    await this.client.mutation((api as any).tasks.update, { id, ...fields });
  }

  async deleteTask(id: string): Promise<void> {
    // TODO: remove if switching backend provider
    await this.client.mutation((api as any).tasks.remove, { id });
  }

  async toggleTask(id: string, completed: boolean): Promise<void> {
    // TODO: remove if switching backend provider
    await this.client.mutation((api as any).tasks.toggle, { id, completed });
  }

  // ─── Recordings ────────────────────────────────────────────────────────────

  subscribeRecordings(
    onData: (recordings: Recording[]) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    // TODO: remove if switching backend provider
    return this.subscribe<Recording[]>(
      (api as any).recordings.list,
      {},
      (data) => onData(data ?? []),
      onError,
    );
  }

  async getRecordings(): Promise<Recording[]> {
    // TODO: remove if switching backend provider
    const result = await this.client.query((api as any).recordings.list, {});
    return result ?? [];
  }

  async createRecording(params: CreateRecordingParams): Promise<string> {
    // TODO: remove if switching backend provider
    return this.client.mutation((api as any).recordings.create, params);
  }

  async deleteRecording(id: string): Promise<void> {
    // TODO: remove if switching backend provider
    await this.client.mutation((api as any).recordings.remove, { id });
  }

  async getFileUrl(storageId: string): Promise<string | null> {
    // TODO: remove if switching backend provider
    return this.client.query((api as any).recordings.getUrl, { storageId });
  }

  // ─── Storage / Upload ──────────────────────────────────────────────────────

  async generateUploadUrl(): Promise<UploadUrlResult> {
    // TODO: remove if switching backend provider
    const uploadUrl = await this.client.mutation(
      (api as any).recordings.generateUploadUrl,
      {},
    );
    return { uploadUrl };
  }
}