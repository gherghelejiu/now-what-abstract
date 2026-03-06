import { ConvexReactClient } from 'convex/react';
import * as SecureStore from 'expo-secure-store';

// TODO: remove if switching backend provider
import { ConvexAuthClient } from '@convex-dev/auth/react';
// TODO: remove if switching backend provider
import { api } from '@/convex/_generated/api';

import type { IBackendProvider } from '../IBackendProvider';
import type {
  Document,
  GetDocumentByIdParams,
  GetDocumentsByUserParams,
  SaveTranscriptionParams,
  SetCurrentDocIdParams,
  SignInParams,
  SignInResult,
  Unsubscribe,
  User,
} from '../types';

// ─── Secure storage adapter (same as in _layout.tsx) ─────────────────────────

const secureStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      const value = await SecureStore.getItemAsync(key);
      console.log('🔵 SecureStore getItem:', key, value ? 'has value' : 'null');
      return value;
    } catch (e) {
      console.error('🔴 SecureStore getItem error:', e);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(key, value);
      console.log('🔵 SecureStore setItem:', key, 'stored successfully');
    } catch (e) {
      console.error('🔴 SecureStore setItem error:', e);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
      console.log('🔵 SecureStore removeItem:', key, 'removed successfully');
    } catch (e) {
      console.error('🔴 SecureStore removeItem error:', e);
    }
  },
};

// ─── ConvexProvider ───────────────────────────────────────────────────────────

export class ConvexBackendProvider implements IBackendProvider {
  // TODO: remove if switching backend provider
  readonly convexClient: ConvexReactClient;
  // TODO: remove if switching backend provider
  readonly authClient: ConvexAuthClient;

  constructor() {
    const url = process.env.EXPO_PUBLIC_CONVEX_URL!;
    this.convexClient = new ConvexReactClient(url);
    // TODO: remove if switching backend provider
    this.authClient = new ConvexAuthClient(this.convexClient, secureStorage);
  }

  // ─── Auth ──────────────────────────────────────────────────────────────────

  async signIn(provider: 'password', params: SignInParams): Promise<SignInResult> {
    // TODO: remove if switching backend provider
    const result = await this.authClient.signIn(provider, {
      flow: params.flow,
      password: params.password,
      username: params.username,
      email: params.email,
      fingerprint: params.fingerprint,
    } as Record<string, unknown>);
    return (result ?? {}) as SignInResult;
  }

  async signOut(): Promise<void> {
    // TODO: remove if switching backend provider
    await this.authClient.signOut();
  }

  // ─── Users ─────────────────────────────────────────────────────────────────

  async getCurrentUser(): Promise<User | null> {
    // TODO: remove if switching backend provider
    const result = await this.convexClient.query(api.users.getCurrentUser, {});
    if (!result) return null;
    return result as unknown as User;
  }

  subscribeCurrentUser(callback: (user: User | null) => void): Unsubscribe {
    // TODO: remove if switching backend provider
    const unwatch = this.convexClient.onUpdate(
      api.users.getCurrentUser,
      {},
      (value) => {
        callback(value ? (value as unknown as User) : null);
      }
    );
    return unwatch;
  }

  // ─── Documents ─────────────────────────────────────────────────────────────

  async getDocumentsByUser(params: GetDocumentsByUserParams): Promise<Document[]> {
    // TODO: remove if switching backend provider
    const result = await this.convexClient.query(api.documents.getDocumentsByUser, {
      userId: params.userId as any,
    });
    return (result ?? []) as unknown as Document[];
  }

  subscribeDocumentsByUser(
    params: GetDocumentsByUserParams,
    callback: (docs: Document[]) => void
  ): Unsubscribe {
    // TODO: remove if switching backend provider
    const unwatch = this.convexClient.onUpdate(
      api.documents.getDocumentsByUser,
      { userId: params.userId as any },
      (value) => {
        callback((value ?? []) as unknown as Document[]);
      }
    );
    return unwatch;
  }

  async getDocumentById(params: GetDocumentByIdParams): Promise<Document | null> {
    // TODO: remove if switching backend provider
    const result = await this.convexClient.query(api.documents.getDocumentById, {
      documentId: params.documentId as any,
    });
    if (!result) return null;
    return result as unknown as Document;
  }

  subscribeDocumentById(
    params: GetDocumentByIdParams,
    callback: (doc: Document | null) => void
  ): Unsubscribe {
    // TODO: remove if switching backend provider
    const unwatch = this.convexClient.onUpdate(
      api.documents.getDocumentById,
      { documentId: params.documentId as any },
      (value) => {
        callback(value ? (value as unknown as Document) : null);
      }
    );
    return unwatch;
  }

  async setCurrentDocId(params: SetCurrentDocIdParams): Promise<void> {
    // TODO: remove if switching backend provider
    await this.convexClient.mutation(api.documents.setCurrentDocId, {
      userId: params.userId as any,
      docId: params.docId,
    });
  }

  // ─── Storage ───────────────────────────────────────────────────────────────

  async generateUploadUrl(): Promise<string> {
    // TODO: remove if switching backend provider
    const url = await this.convexClient.mutation(api.storage.generateUploadUrl, {});
    return url as string;
  }

  // ─── Transcriptions ────────────────────────────────────────────────────────

  async transcribeAudio(params: { storageId: string }): Promise<string> {
    // TODO: remove if switching backend provider
    const text = await this.convexClient.action(api.transcribe.transcribeAudio, {
      storageId: params.storageId as any,
    });
    return text as string;
  }

  async saveTranscription(params: SaveTranscriptionParams): Promise<void> {
    // TODO: remove if switching backend provider
    await this.convexClient.mutation(api.transcriptions.saveTranscription, {
      audioStorageId: params.audioStorageId as any,
      text: params.text,
      documentId: params.documentId as any,
      index: params.index,
    });
  }
}