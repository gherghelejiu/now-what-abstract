/**
 * ConvexProvider – implements IBackendProvider using the Convex SDK.
 *
 * All existing Convex SDK calls are preserved here; only call sites in the
 * React component tree change.
 */

import { ConvexReactClient } from 'convex/react';
import { ConvexClient } from 'convex/browser';
import { signIn as convexSignIn, signOut as convexSignOut } from '@convex-dev/auth/react';
import { api } from '../../convex/_generated/api';
import type { IBackendProvider } from '../IBackendProvider';
import type {
  Device,
  Document,
  ID,
  SaveTranscriptionArgs,
  SetCurrentDocIdArgs,
  SignInAnonymousArgs,
  SignInWithPasswordArgs,
  Transcription,
  Unsubscribe,
  UpdateDeviceWithUserIdArgs,
  User,
} from '../types';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Thin wrapper around ConvexClient.onUpdate that subscribes to a query and
 * fires `callback` every time the result changes. Returns an unsubscribe fn.
 *
 * We use the lower-level `ConvexClient` (non-React) so that subscriptions can
 * live outside of the React component lifecycle.
 */
function subscribeQuery<T>(
  client: ConvexClient,
  query: any,
  args: Record<string, unknown>,
  callback: (value: T) => void,
): Unsubscribe {
  const watch = client.watchQuery(query, args);
  // watchQuery returns a Watch object with an onUpdate method
  const unsubscribe = watch.onUpdate(() => {
    try {
      const value = watch.localQueryResult();
      callback(value as T);
    } catch {
      // Query hasn't resolved yet – ignore.
    }
  });

  // Fire immediately with whatever is already cached
  try {
    const initial = watch.localQueryResult();
    callback(initial as T);
  } catch {
    // Nothing cached yet – wait for the first onUpdate.
  }

  return unsubscribe;
}

// ---------------------------------------------------------------------------
// ConvexProvider
// ---------------------------------------------------------------------------

export class ConvexProvider implements IBackendProvider {
  /**
   * The ConvexReactClient instance shared with the rest of the app.
   * We expose it so that the root <ConvexProvider> wrapper can consume it.
   */
  public readonly reactClient: ConvexReactClient;

  /**
   * A non-React ConvexClient used for imperative one-shot calls and
   * subscription helpers that live outside React's render cycle.
   */
  private readonly client: ConvexClient;

  private readonly convexUrl = 'https://brave-roadrunner-570.convex.cloud';

  constructor() {
    this.reactClient = new ConvexReactClient(this.convexUrl);
    // ConvexClient (non-React) for imperative calls
    this.client = new ConvexClient(this.convexUrl);
  }

  // -------------------------------------------------------------------------
  // Auth
  // -------------------------------------------------------------------------

  async signInWithPassword(args: SignInWithPasswordArgs): Promise<void> {
    const { flow, email, password, fingerprint, loginType, username, firstName, lastName, phone } =
      args;
    await convexSignIn('password', {
      flow,
      email,
      password,
      fingerprint,
      loginType,
      username,
      firstName,
      lastName,
      phone,
    });
  }

  async signInAnonymous(args: SignInAnonymousArgs): Promise<void> {
    await convexSignIn('anonymous', { fingerprint: args.fingerprint });
  }

  async signOut(): Promise<void> {
    await convexSignOut();
  }

  // -------------------------------------------------------------------------
  // Users
  // -------------------------------------------------------------------------

  async getCurrentUser(): Promise<User | null> {
    return this.client.query(api.users.getCurrentUser, {}) as Promise<User | null>;
  }

  subscribeCurrentUser(callback: (user: User | null) => void): Unsubscribe {
    return subscribeQuery<User | null>(this.client, api.users.getCurrentUser, {}, callback);
  }

  async getUserByFingerprint(fingerprint: string): Promise<User | null> {
    return this.client.query(api.users.getUserByFingerprint, { fingerprint }) as Promise<
      User | null
    >;
  }

  subscribeUserByFingerprint(
    fingerprint: string,
    callback: (user: User | null) => void,
  ): Unsubscribe {
    return subscribeQuery<User | null>(
      this.client,
      api.users.getUserByFingerprint,
      { fingerprint },
      callback,
    );
  }

  // -------------------------------------------------------------------------
  // Documents
  // -------------------------------------------------------------------------

  async getDocumentById(documentId: ID): Promise<Document | null> {
    return this.client.query(api.documents.getDocumentById, {
      documentId: documentId as any,
    }) as Promise<Document | null>;
  }

  subscribeDocumentById(
    documentId: ID,
    callback: (doc: Document | null) => void,
  ): Unsubscribe {
    return subscribeQuery<Document | null>(
      this.client,
      api.documents.getDocumentById,
      { documentId },
      callback,
    );
  }

  async getDocumentsByUser(userId: string): Promise<Document[]> {
    return this.client.query(api.documents.getDocumentsByUser, { userId }) as Promise<Document[]>;
  }

  subscribeDocumentsByUser(
    userId: string,
    callback: (docs: Document[]) => void,
  ): Unsubscribe {
    return subscribeQuery<Document[]>(
      this.client,
      api.documents.getDocumentsByUser,
      { userId },
      callback,
    );
  }

  async setCurrentDocId(args: SetCurrentDocIdArgs): Promise<void> {
    await this.client.mutation(api.documents.setCurrentDocId, {
      userId: args.userId,
      docId: args.docId,
    });
  }

  // -------------------------------------------------------------------------
  // Transcriptions
  // -------------------------------------------------------------------------

  async saveTranscription(args: SaveTranscriptionArgs): Promise<ID> {
    const id = await this.client.mutation(api.transcriptions.saveTranscription, {
      text: args.text,
      audioStorageId: args.audioStorageId,
      documentId: args.documentId,
      index: args.index,
    });
    return id as ID;
  }

  async getTranscriptions(): Promise<Transcription[]> {
    return this.client.query(api.transcriptions.getTranscriptions, {}) as Promise<Transcription[]>;
  }

  subscribeTranscriptions(callback: (transcriptions: Transcription[]) => void): Unsubscribe {
    return subscribeQuery<Transcription[]>(
      this.client,
      api.transcriptions.getTranscriptions,
      {},
      callback,
    );
  }

  // -------------------------------------------------------------------------
  // Storage
  // -------------------------------------------------------------------------

  async generateUploadUrl(): Promise<string> {
    const url = await this.client.mutation(api.storage.generateUploadUrl, {});
    return url as string;
  }

  // -------------------------------------------------------------------------
  // Transcribe (AI action)
  // -------------------------------------------------------------------------

  async transcribeAudio(storageId: ID): Promise<string> {
    const text = await this.client.action(api.transcribe.transcribeAudio, {
      storageId: storageId as any,
    });
    return text as string;
  }

  // -------------------------------------------------------------------------
  // Devices
  // -------------------------------------------------------------------------

  async findDeviceByFingerprint(fingerprint: string): Promise<Device | null> {
    return this.client.query(api.devices.findDeviceByFingerprint, { fingerprint }) as Promise<
      Device | null
    >;
  }

  subscribeDeviceByFingerprint(
    fingerprint: string,
    callback: (device: Device | null) => void,
  ): Unsubscribe {
    return subscribeQuery<Device | null>(
      this.client,
      api.devices.findDeviceByFingerprint,
      { fingerprint },
      callback,
    );
  }

  async storeDevice(fingerprint: string): Promise<ID> {
    const id = await this.client.mutation(api.devices.storeDevice, { fingerprint });
    return id as ID;
  }

  async updateDeviceWithUserId(args: UpdateDeviceWithUserIdArgs): Promise<ID> {
    const id = await this.client.mutation(api.devices.updateDeviceWithUserId, {
      fingerprint: args.fingerprint,
      userId: args.userId,
    });
    return id as ID;
  }
}